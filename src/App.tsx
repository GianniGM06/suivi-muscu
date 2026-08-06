import { useEffect, useState } from "react";
import { Home } from "./components/Home";
import { SessionScreen } from "./components/SessionScreen";
import { SummaryScreen, type MajCharge } from "./components/SummaryScreen";
import { SuiviScreen } from "./components/SuiviScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { TimerBar } from "./components/TimerBar";
import { useTimer } from "./hooks/useTimer";
import { loadData, requestPersistentStorage, saveData } from "./storage";
import { initSound } from "./sound";
import { chargerDepuisGithub, modesASauvegarder, sauvegarderSurGithub } from "./sync/github";
import { exportJsonComplet } from "./export/exports";
import type { AppData, Mode, SeanceId, SessionRecord, Settings } from "./types";

type Vue =
  | { nom: "home" }
  | { nom: "session"; seanceId: SeanceId }
  | { nom: "recap"; session: SessionRecord }
  | { nom: "suivi" }
  | { nom: "reglages" };

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [vue, setVue] = useState<Vue>({ nom: "home" });
  const [syncEnCours, setSyncEnCours] = useState(false);
  const [conflit, setConflit] = useState<{ message: string; mode: Mode } | null>(null);
  // Le mode n'est PAS persisté : l'app rouvre toujours sur « Salle ».
  const [mode, setMode] = useState<Mode>("salle");
  const timer = useTimer();

  useEffect(() => {
    requestPersistentStorage();
    // iOS exige un geste utilisateur pour débloquer l'audio
    const unlock = () => {
      initSound();
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("click", unlock, { once: true });
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    const theme = data.settings.theme;
    const racine = document.documentElement;
    if (theme === "auto") racine.removeAttribute("data-theme");
    else racine.setAttribute("data-theme", theme);
  }, [data.settings.theme]);

  const marquerModifie = (d: AppData): AppData =>
    d.sync.statut === "ok" ? { ...d, sync: { ...d.sync, statut: "local-modifie" } } : d;

  const terminerSession = (session: SessionRecord) => {
    setData((d) =>
      marquerModifie({
        ...d,
        draft: undefined,
        sessions: [...d.sessions.filter((s) => s.id !== session.id), session]
      })
    );
    setVue({ nom: "recap", session });
  };

  const appliquerMajs = (session: SessionRecord, majs: MajCharge[], rpeGlobal?: number) => {
    setData((d) => {
      const copie = structuredClone(d) as AppData;
      const rec = copie.sessions.find((s) => s.id === session.id);
      if (rec) rec.rpeGlobal = rpeGlobal;

      for (const e of session.exercices) {
        if (e.saute) continue;
        const st = (copie.exerciseState[e.exerciceId] ??= { varianteActive: e.varianteId, parVariante: {} });
        st.varianteActive = e.varianteId; // mémorise la variante active choisie en séance
        const vs = (st.parVariante[e.varianteId] ??= {});
        const faites = e.series.filter((s) => s.faite);
        const charges = faites.filter((s) => s.charge !== undefined).map((s) => s.charge!);
        if (charges.length > 0) vs.derniereCharge = Math.max(...charges);
        // Meilleure performance : record réel uniquement (charge max ou durée max en série faite)
        const durees = faites.filter((s) => s.dureeSec !== undefined).map((s) => s.dureeSec!);
        if (charges.length > 0) {
          const max = Math.max(...charges);
          if (!vs.meilleurePerf || (vs.meilleurePerf.unite === "kg" && max > vs.meilleurePerf.valeur))
            vs.meilleurePerf = { valeur: max, unite: "kg", date: new Date().toISOString() };
        } else if (durees.length > 0) {
          const max = Math.max(...durees);
          if (!vs.meilleurePerf || (vs.meilleurePerf.unite === "sec" && max > vs.meilleurePerf.valeur))
            vs.meilleurePerf = { valeur: max, unite: "sec", date: new Date().toISOString() };
        }
      }
      for (const m of majs) {
        if (!m.appliquer) continue;
        const st = (copie.exerciseState[m.exerciceId] ??= { varianteActive: m.varianteId, parVariante: {} });
        (st.parVariante[m.varianteId] ??= {}).chargeReference = m.nouvelleCharge;
      }
      return marquerModifie(copie);
    });
  };

  /** Sauvegarde les deux fichiers (salle + maison) selon ce qui existe. */
  const lancerSync = async (opts: { force?: boolean; seulement?: Mode } = {}) => {
    setSyncEnCours(true);
    setConflit(null);
    const modes = opts.seulement ? [opts.seulement] : modesASauvegarder(data);
    let erreur: string | null = null;

    for (const m of modes) {
      const res = await sauvegarderSurGithub(data, m, { force: opts.force });
      if (res.ok) {
        setData((d) => ({
          ...d,
          sync: {
            ...d.sync,
            statut: "ok",
            lastSyncAt: res.date,
            lastError: undefined,
            ...(m === "maison" ? { lastShaMaison: res.sha } : { lastSha: res.sha })
          }
        }));
      } else if (res.kind === "conflit") {
        setSyncEnCours(false);
        setConflit({ message: res.message, mode: m });
        return;
      } else if (res.kind !== "rien") {
        erreur = res.message;
      }
    }

    setSyncEnCours(false);
    if (erreur) {
      const msg = erreur;
      setData((d) => ({ ...d, sync: { ...d.sync, statut: "erreur", lastError: msg } }));
    }
  };

  const garderVersionDistante = async () => {
    if (!conflit) return;
    const m = conflit.mode;
    const res = await chargerDepuisGithub(data.settings.github, m);
    setConflit(null);
    if (res.ok) {
      // On aligne simplement le SHA : les données distantes restent la référence publique.
      setData((d) => ({
        ...d,
        sync: {
          ...d.sync,
          statut: "ok",
          lastSyncAt: new Date().toISOString(),
          ...(m === "maison" ? { lastShaMaison: res.sha } : { lastSha: res.sha })
        }
      }));
      alert(
        "Version distante conservée. Tes données locales complètes restent intactes sur cet appareil ; la prochaine sauvegarde proposera à nouveau l'écrasement."
      );
    } else {
      alert(res.message);
    }
  };

  const importer = (imported: AppData, mode: "remplacer" | "fusionner") => {
    setData((d) => {
      const github = d.settings.github; // token et config actuels toujours conservés
      if (mode === "remplacer") {
        return { ...imported, settings: { ...imported.settings, github }, draft: undefined };
      }
      const ids = new Set(d.sessions.map((s) => s.id));
      const testIds = new Set(d.tests.map((t) => t.id));
      return marquerModifie({
        ...d,
        sessions: [...d.sessions, ...imported.sessions.filter((s) => !ids.has(s.id))].sort((a, b) =>
          a.dateDebut.localeCompare(b.dateDebut)
        ),
        tests: [...d.tests, ...imported.tests.filter((t) => !testIds.has(t.id))],
        exerciseState: { ...imported.exerciseState, ...d.exerciseState }
      });
    });
  };

  return (
    <>
      {vue.nom === "home" && (
        <Home
          data={data}
          mode={mode}
          onStart={(id) => setVue({ nom: "session", seanceId: id })}
          onNav={(v) => setVue({ nom: v === "suivi" ? "suivi" : "reglages" })}
          onChangeMode={setMode}
        />
      )}
      {vue.nom === "session" && (
        <SessionScreen
          data={data}
          seanceId={vue.seanceId}
          timer={timer}
          onUpdateDraft={(draft) => setData((d) => ({ ...d, draft }))}
          onFinish={terminerSession}
          onQuit={() => setVue({ nom: "home" })}
        />
      )}
      {vue.nom === "recap" && (
        <SummaryScreen
          data={data}
          session={vue.session}
          syncEnCours={syncEnCours}
          onValider={(majs, rpe) => appliquerMajs(vue.session, majs, rpe)}
          onSauvegarderGithub={() => lancerSync()}
        />
      )}
      {vue.nom === "suivi" && (
        <SuiviScreen
          data={data}
          onAjoutTest={(t) => setData((d) => marquerModifie({ ...d, tests: [...d.tests, t] }))}
          onRetour={() => setVue({ nom: "home" })}
        />
      )}
      {vue.nom === "reglages" && (
        <SettingsScreen
          data={data}
          onMajSettings={(s: Settings) => setData((d) => ({ ...d, settings: s }))}
          onImport={importer}
          onRetour={() => setVue({ nom: "home" })}
        />
      )}

      {(vue.nom === "recap" || vue.nom === "home") && data.sync.statut === "local-modifie" && vue.nom === "home" && (
        <button className="fab-sync" onClick={() => lancerSync()} disabled={syncEnCours}>
          {syncEnCours ? "…" : "☁️ Sauvegarder sur GitHub"}
        </button>
      )}

      {conflit && (
        <div className="sheet-backdrop">
          <div className="sheet">
            <div className="sheet-head">
              <h3>⚠️ Conflit de version ({conflit.mode})</h3>
            </div>
            <div className="sheet-body">
              <p>{conflit.message}</p>
              <p className="muted small">
                Le fichier sur GitHub a changé depuis ta dernière sauvegarde (probablement modifié
                depuis un autre appareil ou à la main). Rien n'a été écrasé.
              </p>
              <div className="btn-col">
                <button className="btn" onClick={() => exportJsonComplet(data)}>
                  ⬇ D'abord : exporter mes données locales (recommandé)
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => lancerSync({ force: true, seulement: conflit.mode })}
                >
                  Écraser avec mes données locales
                  <span className="btn-sub">La version GitHub sera remplacée par ce téléphone</span>
                </button>
                <button className="btn" onClick={garderVersionDistante}>
                  Garder la version distante
                  <span className="btn-sub">GitHub reste tel quel ; tes données locales sont conservées ici</span>
                </button>
                <button className="btn btn-ghost" onClick={() => setConflit(null)}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TimerBar timer={timer} son={data.settings.son} />
    </>
  );
}
