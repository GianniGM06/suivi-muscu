import { useRef, useState } from "react";
import type { AppData, Settings } from "../types";
import { bilanPourClaude, exportCsv, exportJsonComplet } from "../export/exports";

export function SettingsScreen({
  data,
  onMajSettings,
  onImport,
  onRetour
}: {
  data: AppData;
  onMajSettings: (s: Settings) => void;
  onImport: (d: AppData, mode: "remplacer" | "fusionner") => void;
  onRetour: () => void;
}) {
  const g = data.settings.github;
  const [owner, setOwner] = useState(g.owner);
  const [repo, setRepo] = useState(g.repo);
  const [branch, setBranch] = useState(g.branch);
  const [path, setPath] = useState(g.path);
  const [pathMaison, setPathMaison] = useState(g.pathMaison ?? "data/suivi-maison.json");
  const [token, setToken] = useState("");
  const [tokenSaisi, setTokenSaisi] = useState(false);
  const [copie, setCopie] = useState(false);
  const [importApercu, setImportApercu] = useState<AppData | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const enregistrer = () => {
    onMajSettings({
      ...data.settings,
      github: {
        owner: owner.trim(),
        repo: repo.trim(),
        branch: branch.trim() || "main",
        path: path.trim() || "data/suivi.json",
        pathMaison: pathMaison.trim() || "data/suivi-maison.json",
        token: token !== "" ? token.trim() : g.token
      }
    });
    setToken("");
    setTokenSaisi(true);
  };

  return (
    <div className="screen">
      <header className="app-header">
        <button className="btn btn-ghost" onClick={onRetour}>‹ Retour</button>
        <h1>Réglages</h1>
      </header>

      <div className="card">
        <h3>Sauvegarde GitHub</h3>
        <p className="muted small">
          Token fine-grained limité à ce seul dépôt, permission « Contents : Read and write »
          uniquement, avec date d'expiration. Il est stocké uniquement sur cet appareil et n'est
          jamais affiché ni synchronisé.
        </p>
        <label>Identifiant GitHub
          <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ton-identifiant" autoCapitalize="none" />
        </label>
        <label>Dépôt
          <input value={repo} onChange={(e) => setRepo(e.target.value)} autoCapitalize="none" />
        </label>
        <label>Branche
          <input value={branch} onChange={(e) => setBranch(e.target.value)} autoCapitalize="none" />
        </label>
        <label>Fichier — séances Salle
          <input value={path} onChange={(e) => setPath(e.target.value)} autoCapitalize="none" />
        </label>
        <label>Fichier — séances Maison
          <input value={pathMaison} onChange={(e) => setPathMaison(e.target.value)} autoCapitalize="none" />
        </label>
        <label>Token {g.token && <span className="badge badge-ok">déjà enregistré ✓</span>}
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={g.token ? "•••••••• (laisser vide pour conserver)" : "github_pat_…"}
            autoCapitalize="none"
            autoComplete="off"
          />
        </label>
        <button className="btn btn-primary" onClick={enregistrer}>Enregistrer la configuration</button>
        {tokenSaisi && <p className="muted small">✅ Configuration enregistrée.</p>}
      </div>

      <div className="card">
        <h3>Son</h3>
        <label className="check-label">
          <input
            type="checkbox"
            checked={data.settings.son}
            onChange={(e) => onMajSettings({ ...data.settings, son: e.target.checked })}
          />
          Bip de fin de chrono (sort dans le casque Bluetooth si connecté)
        </label>
        <p className="muted small">
          Fonctionne quand l'app est à l'écran. Écran verrouillé, iOS suspend l'app : ni son ni
          vibration possibles — le temps restant reste juste au retour.
        </p>
      </div>

      <div className="card">
        <h3>Thème</h3>
        <div className="form-row">
          {(["auto", "clair", "sombre"] as const).map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${data.settings.theme === t ? "btn-primary" : ""}`}
              onClick={() => onMajSettings({ ...data.settings, theme: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Exports & restauration</h3>
        <p className="muted small">
          💾 Pense à exporter une sauvegarde JSON complète chaque mois — iOS peut purger le stockage
          d'une app web longtemps inutilisée.
        </p>
        <div className="btn-col">
          <button className="btn" onClick={() => exportJsonComplet(data)}>⬇ Export JSON complet (local)</button>
          <button className="btn" onClick={() => exportCsv(data)}>⬇ Export CSV (séances + charges)</button>
          <button
            className="btn"
            onClick={async () => {
              await navigator.clipboard.writeText(bilanPourClaude(data));
              setCopie(true);
              setTimeout(() => setCopie(false), 2500);
            }}
          >
            {copie ? "✅ Copié !" : "📋 Copier le bilan pour Claude"}
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>⬆ Importer un JSON</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const parsed = JSON.parse(await f.text()) as AppData;
                if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.sessions)) {
                  alert("Fichier invalide : ce n'est pas une sauvegarde Suivi Muscu.");
                  return;
                }
                setImportApercu(parsed);
              } catch {
                alert("Fichier JSON illisible.");
              }
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {importApercu && (
        <div className="sheet-backdrop" onClick={() => setImportApercu(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head"><h3>Aperçu de l'import</h3></div>
            <div className="sheet-body">
              <p>
                {importApercu.sessions.length} séance(s) · {importApercu.tests.length} test(s) ·{" "}
                {Object.keys(importApercu.exerciseState).length} exercice(s) avec charges.
              </p>
              <p className="muted small">
                <strong>Fusionner</strong> : ajoute les séances/tests absents, garde tes charges actuelles
                en cas de doublon. <strong>Remplacer</strong> : écrase toutes les données locales (le token
                et la config GitHub actuels sont conservés).
              </p>
              <div className="btn-col">
                <button className="btn btn-primary" onClick={() => { onImport(importApercu, "fusionner"); setImportApercu(null); }}>
                  Fusionner avec mes données
                </button>
                <button className="btn" onClick={() => { onImport(importApercu, "remplacer"); setImportApercu(null); }}>
                  Remplacer mes données
                </button>
                <button className="btn btn-ghost" onClick={() => setImportApercu(null)}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <p className="muted small">
          Suivi Muscu v1 · données de santé, gênes et notes : locales uniquement · aucune télémétrie ·
          cette app ne donne aucun diagnostic médical.
        </p>
      </div>
    </div>
  );
}
