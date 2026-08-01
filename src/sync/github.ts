import type { AppData, GithubConfig } from "../types";
import { toSyncPayload, verifierPayload } from "./filter";

export type SyncResult =
  | { ok: true; sha: string; date: string }
  | { ok: false; kind: "config" | "reseau" | "token" | "droits" | "conflit" | "autre"; message: string; remoteSha?: string };

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

// btoa ne gère pas l'UTF-8 nativement
function toBase64(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export async function getRemoteSha(
  c: GithubConfig
): Promise<{ sha: string | null } | { error: SyncResult & { ok: false } }> {
  try {
    const res = await fetch(
      `${API}/repos/${c.owner}/${c.repo}/contents/${c.path}?ref=${c.branch}`,
      { headers: headers(c.token) }
    );
    if (res.status === 404) return { sha: null }; // le fichier n'existe pas encore
    if (res.status === 401)
      return { error: { ok: false, kind: "token", message: "Token invalide ou expiré (401)." } };
    if (res.status === 403)
      return { error: { ok: false, kind: "droits", message: "Droits insuffisants (403). Vérifie la permission « Contents: Read and write » limitée à ce dépôt." } };
    if (!res.ok)
      return { error: { ok: false, kind: "autre", message: `Erreur GitHub ${res.status}.` } };
    const json = (await res.json()) as { sha: string };
    return { sha: json.sha };
  } catch {
    return { error: { ok: false, kind: "reseau", message: "Réseau indisponible. Réessaie quand la connexion revient." } };
  }
}

/**
 * Sauvegarde manuelle vers GitHub.
 * @param force true = écraser même si le fichier distant a changé depuis la dernière sync.
 */
export async function sauvegarderSurGithub(
  data: AppData,
  opts: { force?: boolean; keepRemote?: boolean } = {}
): Promise<SyncResult> {
  const c = data.settings.github;
  if (!configValide(c)) {
    return { ok: false, kind: "config", message: "Configuration GitHub incomplète (Réglages > Sauvegarde GitHub)." };
  }

  const payload = toSyncPayload(data);
  verifierPayload(payload); // garde-fou : lève une exception si un champ sensible est présent

  const remote = await getRemoteSha(c);
  if ("error" in remote) return remote.error;

  // Détection de conflit : le fichier distant a changé depuis notre dernière sync.
  if (
    !opts.force &&
    remote.sha !== null &&
    data.sync.lastSha &&
    remote.sha !== data.sync.lastSha
  ) {
    return {
      ok: false,
      kind: "conflit",
      message: "Le fichier distant a été modifié depuis ta dernière sauvegarde.",
      remoteSha: remote.sha
    };
  }

  if (opts.keepRemote) {
    // « Garder la version distante » : on aligne simplement notre SHA local.
    return { ok: true, sha: remote.sha ?? "", date: new Date().toISOString() };
  }

  const derniere = payload.sessions[payload.sessions.length - 1];
  const message = derniere
    ? `suivi: séance ${derniere.type} — ${(derniere.dateFin ?? derniere.dateDebut).slice(0, 16).replace("T", " ")}`
    : `suivi: mise à jour — ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

  try {
    const res = await fetch(`${API}/repos/${c.owner}/${c.repo}/contents/${c.path}`, {
      method: "PUT",
      headers: { ...headers(c.token), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: toBase64(JSON.stringify(payload, null, 2)),
        branch: c.branch,
        ...(remote.sha ? { sha: remote.sha } : {})
      })
    });
    if (res.status === 401) return { ok: false, kind: "token", message: "Token invalide ou expiré (401)." };
    if (res.status === 403) return { ok: false, kind: "droits", message: "Droits insuffisants (403)." };
    if (res.status === 409) return { ok: false, kind: "conflit", message: "Conflit de version (409). Recharge puis réessaie." };
    if (!res.ok) return { ok: false, kind: "autre", message: `Erreur GitHub ${res.status}.` };
    const json = (await res.json()) as { content: { sha: string } };
    return { ok: true, sha: json.content.sha, date: new Date().toISOString() };
  } catch {
    return { ok: false, kind: "reseau", message: "Réseau indisponible. La sauvegarde pourra être relancée plus tard." };
  }
}

/** Récupère le contenu distant (pour « Garder la version distante » lors d'un conflit). */
export async function chargerDepuisGithub(
  c: GithubConfig
): Promise<{ ok: true; contenu: string; sha: string } | { ok: false; message: string }> {
  try {
    const res = await fetch(
      `${API}/repos/${c.owner}/${c.repo}/contents/${c.path}?ref=${c.branch}`,
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
