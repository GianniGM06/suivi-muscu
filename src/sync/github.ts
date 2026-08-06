import type { AppData, GithubConfig, Mode } from "../types";
import { estMaison } from "../data/program";
import { toSyncPayload, verifierPayload } from "./filter";

export type SyncResult =
  | { ok: true; sha: string; date: string; mode: Mode }
  | {
      ok: false;
      kind: "config" | "reseau" | "token" | "droits" | "conflit" | "autre" | "rien";
      message: string;
      mode?: Mode;
      remoteSha?: string;
    };

const API = "https://api.github.com";

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function configValide(c: GithubConfig): boolean {
  return Boolean(c.owner && c.repo && c.branch && c.path && c.token);
}

/** Chemin du fichier selon le mode. */
export function cheminPour(c: GithubConfig, mode: Mode): string {
  return mode === "maison" ? c.pathMaison || "data/suivi-maison.json" : c.path;
}

// btoa ne gère pas l'UTF-8 nativement
function toBase64(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

async function getSha(
  c: GithubConfig,
  chemin: string
): Promise<{ sha: string | null } | { error: SyncResult & { ok: false } }> {
  try {
    const res = await fetch(`${API}/repos/${c.owner}/${c.repo}/contents/${chemin}?ref=${c.branch}`, {
      headers: headers(c.token)
    });
    if (res.status === 404) return { sha: null }; // fichier pas encore créé
    if (res.status === 401)
      return { error: { ok: false, kind: "token", message: "Token invalide ou expiré (401)." } };
    if (res.status === 403)
      return {
        error: {
          ok: false,
          kind: "droits",
          message: "Droits insuffisants (403). Vérifie « Contents: Read and write » sur ce dépôt."
        }
      };
    if (!res.ok)
      return { error: { ok: false, kind: "autre", message: `Erreur GitHub ${res.status}.` } };
    const json = (await res.json()) as { sha: string };
    return { sha: json.sha };
  } catch {
    return {
      error: { ok: false, kind: "reseau", message: "Réseau indisponible. Réessaie plus tard." }
    };
  }
}

/**
 * Sauvegarde manuelle d'UN fichier (salle OU maison).
 * @param force true = écraser même si le fichier distant a changé.
 */
export async function sauvegarderSurGithub(
  data: AppData,
  mode: Mode,
  opts: { force?: boolean } = {}
): Promise<SyncResult> {
  const c = data.settings.github;
  if (!configValide(c)) {
    return {
      ok: false,
      kind: "config",
      message: "Configuration GitHub incomplète (Réglages > Sauvegarde GitHub)."
    };
  }

  const payload = toSyncPayload(data, mode);
  if (payload.sessions.length === 0 && payload.chargesReference.length === 0) {
    return { ok: false, kind: "rien", message: "Aucune donnée à sauvegarder pour ce mode.", mode };
  }
  verifierPayload(payload); // garde-fou confidentialité

  const chemin = cheminPour(c, mode);
  const shaConnu = mode === "maison" ? data.sync.lastShaMaison : data.sync.lastSha;

  const remote = await getSha(c, chemin);
  if ("error" in remote) return { ...remote.error, mode };

  if (!opts.force && remote.sha !== null && shaConnu && remote.sha !== shaConnu) {
    return {
      ok: false,
      kind: "conflit",
      message: `Le fichier distant (${mode}) a été modifié depuis ta dernière sauvegarde.`,
      mode,
      remoteSha: remote.sha
    };
  }

  const derniere = payload.sessions[payload.sessions.length - 1];
  const prefixe = mode === "maison" ? "suivi maison" : "suivi";
  const message = derniere
    ? `${prefixe}: séance ${derniere.type} — ${(derniere.dateFin ?? derniere.dateDebut).slice(0, 16).replace("T", " ")}`
    : `${prefixe}: mise à jour — ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

  try {
    const res = await fetch(`${API}/repos/${c.owner}/${c.repo}/contents/${chemin}`, {
      method: "PUT",
      headers: { ...headers(c.token), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: toBase64(JSON.stringify(payload, null, 2)),
        branch: c.branch,
        ...(remote.sha ? { sha: remote.sha } : {})
      })
    });
    if (res.status === 401)
      return { ok: false, kind: "token", message: "Token invalide ou expiré (401).", mode };
    if (res.status === 403)
      return { ok: false, kind: "droits", message: "Droits insuffisants (403).", mode };
    if (res.status === 409)
      return { ok: false, kind: "conflit", message: "Conflit de version (409).", mode };
    if (!res.ok)
      return { ok: false, kind: "autre", message: `Erreur GitHub ${res.status}.`, mode };
    const json = (await res.json()) as { content: { sha: string } };
    return { ok: true, sha: json.content.sha, date: new Date().toISOString(), mode };
  } catch {
    return {
      ok: false,
      kind: "reseau",
      message: "Réseau indisponible. La sauvegarde pourra être relancée.",
      mode
    };
  }
}

/** Quels modes ont des séances terminées à sauvegarder ? */
export function modesASauvegarder(data: AppData): Mode[] {
  const modes: Mode[] = [];
  const terminees = data.sessions.filter((s) => s.statut === "terminee");
  if (terminees.some((s) => !estMaison(s.type))) modes.push("salle");
  if (terminees.some((s) => estMaison(s.type))) modes.push("maison");
  return modes.length > 0 ? modes : ["salle"];
}

/** Récupère le contenu distant (option « Garder la version distante »). */
export async function chargerDepuisGithub(
  c: GithubConfig,
  mode: Mode
): Promise<{ ok: true; contenu: string; sha: string } | { ok: false; message: string }> {
  try {
    const res = await fetch(
      `${API}/repos/${c.owner}/${c.repo}/contents/${cheminPour(c, mode)}?ref=${c.branch}`,
      { headers: headers(c.token) }
    );
    if (!res.ok) return { ok: false, message: `Erreur GitHub ${res.status}.` };
    const json = (await res.json()) as { content: string; sha: string };
    const bin = atob(json.content.replace(/\n/g, ""));
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    return { ok: true, contenu: new TextDecoder().decode(bytes), sha: json.sha };
  } catch {
    return { ok: false, message: "Réseau indisponible." };
  }
}
