import { getOrdre, getSeances } from "../data/program";
import type { AppData, Mode, SeanceId } from "../types";
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
  onNav,
  onChangeMode
}: {
  data: AppData;
  onStart: (id: SeanceId) => void;
  onNav: (v: "suivi" | "reglages") => void;
  onChangeMode: (m: Mode) => void;
}) {
  const mode = data.settings.mode;
  const seances = getSeances(mode);
  const ordre = getOrdre(mode);

  const terminees = data.sessions.filter((s) => s.statut === "terminee");
  // La suggestion se base sur la dernière séance du mode courant
  const derniereDuMode = [...terminees].reverse().find((s) => ordre.includes(s.type));
  const suggestion: SeanceId = derniereDuMode
    ? (ordre[(ordre.indexOf(derniereDuMode.type) + 1) % ordre.length] as SeanceId)
    : (ordre[0] as SeanceId);

  const derniere = terminees[terminees.length - 1];
  const joursConsec = joursConsecutifsEntrainement(data);
  const avertJours = mode === "salle" && joursConsec >= 2;
  const avertBE = (id: SeanceId) =>
    mode === "salle" &&
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

      <div className="mode-switch" role="group" aria-label="Mode d'entraînement">
        <button
          className={`mode-btn ${mode === "salle" ? "mode-actif" : ""}`}
          onClick={() => onChangeMode("salle")}
        >
          🏋️ Salle
        </button>
        <button
          className={`mode-btn ${mode === "maison" ? "mode-actif" : ""}`}
          onClick={() => onChangeMode("maison")}
        >
          🏠 Maison
        </button>
      </div>

      {mode === "maison" && (
        <p className="muted small mode-note">
          Élastique 15 kg, piscine et poids du corps. Charge faible : va près de l'échec, 15-25 reps.
        </p>
      )}

      {data.draft && (
        <button className="card card-resume" onClick={() => onStart(data.draft!.type)}>
          ▶ Reprendre la séance {nomSeance(data.draft.type)} en cours
        </button>
      )}

      <p className="suggestion">
        Suggestion : <strong>{nomSeance(suggestion)}</strong>
        {derniereDuMode && <span className="muted"> (dernière : {nomSeance(derniereDuMode.type)})</span>}
        <br />
        <span className="muted">Ordre indicatif — choix libre.</span>
      </p>

      {avertJours && (
        <div className="alert">
          ⚠️ Tu t'es entraîné {joursConsec} jours d'affilée. Règle du programme : jamais 3 jours
          consécutifs sans repos. Tu peux continuer en connaissance de cause.
        </div>
      )}

      <div className="seance-list">
        {seances.map((s) => (
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
