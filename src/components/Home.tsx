import { ORDRE_SUGGESTION, SEANCES } from "../data/program";
import type { AppData, SeanceId } from "../types";
import { nomSeance } from "../export/exports";

function joursConsecutifsEntrainement(data: AppData): number {
  const jours = new Set(
    data.sessions.filter((s) => s.statut === "terminee").map((s) => s.dateDebut.slice(0, 10))
  );
  let n = 0;
  const d = new Date();
  for (;;) {
    d.setDate(d.getDate() - 1);
    if (jours.has(d.toISOString().slice(0, 10))) n++;
    else break;
  }
  return n;
}

export function Home({
  data,
  onStart,
  onNav
}: {
  data: AppData;
  onStart: (id: SeanceId) => void;
  onNav: (v: "suivi" | "reglages") => void;
}) {
  const terminees = data.sessions.filter((s) => s.statut === "terminee");
  const derniere = terminees[terminees.length - 1];
  const suggestion: SeanceId = derniere
    ? (ORDRE_SUGGESTION[(ORDRE_SUGGESTION.indexOf(derniere.type) + 1) % 5] as SeanceId)
    : "A";

  const joursConsec = joursConsecutifsEntrainement(data);
  const avertJours = joursConsec >= 2;
  const avertBE = (id: SeanceId) =>
    derniere !== undefined &&
    ((derniere.type === "B" && id === "E") || (derniere.type === "E" && id === "B"));

  const sync = data.sync;
  const syncBadge =
    sync.statut === "ok"
      ? { cls: "badge-ok", txt: `✅ Sauvegardé ${sync.lastSyncAt?.slice(0, 16).replace("T", " ") ?? ""}` }
      : sync.statut === "local-modifie"
        ? { cls: "badge-warn", txt: "🟡 Données locales à sauvegarder" }
        : sync.statut === "erreur"
          ? { cls: "badge-err", txt: `⚠️ Erreur : ${sync.lastError ?? "sync"}` }
          : { cls: "badge-neutral", txt: "— Jamais sauvegardé sur GitHub" };

  const derniereParType = new Map<string, string>();
  for (const s of terminees) derniereParType.set(s.type, s.dateDebut.slice(0, 10));

  return (
    <div className="screen">
      <header className="app-header">
        <h1>Suivi Muscu</h1>
        <div className={`badge ${syncBadge.cls}`}>{syncBadge.txt}</div>
      </header>

      {data.draft && (
        <button className="card card-resume" onClick={() => onStart(data.draft!.type)}>
          ▶ Reprendre la séance {nomSeance(data.draft.type)} en cours
        </button>
      )}

      <p className="suggestion">
        Suggestion : <strong>{nomSeance(suggestion)}</strong>
        {derniere && <span className="muted"> (dernière : {nomSeance(derniere.type)})</span>}
        <br />
        <span className="muted">Ordre indicatif A→E — choix libre.</span>
      </p>

      {avertJours && (
        <div className="alert">
          ⚠️ Tu t'es entraîné {joursConsec} jours d'affilée. Règle du programme : jamais 3 jours
          consécutifs sans repos. Tu peux continuer en connaissance de cause.
        </div>
      )}

      <div className="seance-list">
        {SEANCES.map((s) => (
          <button
            key={s.id}
            className={`card seance-card ${s.id === suggestion ? "seance-suggeree" : ""}`}
            onClick={() => onStart(s.id)}
          >
            <div className="seance-lettre">{s.lettre}</div>
            <div className="seance-infos">
              <div className="seance-nom">{s.nom}</div>
              <div className="seance-dominante">{s.dominante}</div>
              <div className="muted">
                {derniereParType.has(s.id) ? `Dernière fois : ${derniereParType.get(s.id)}` : "Jamais faite"}
              </div>
              {avertBE(s.id) && <div className="alert-inline">⚠️ B et E ne devraient pas s'enchaîner</div>}
            </div>
            <div className="seance-fleche">›</div>
          </button>
        ))}
      </div>

      <nav className="bottom-nav">
        <button className="btn btn-nav" onClick={() => onNav("suivi")}>📊 Suivi</button>
        <button className="btn btn-nav" onClick={() => onNav("reglages")}>⚙️ Réglages</button>
      </nav>
    </div>
  );
}
