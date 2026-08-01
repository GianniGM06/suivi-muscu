import { useMemo, useState } from "react";
import { getExercice } from "../data/program";
import type { AppData, SessionRecord } from "../types";
import { nomSeance } from "../export/exports";

export interface MajCharge {
  exerciceId: string;
  varianteId: string;
  nouvelleCharge: number;
  ancienne?: number;
  appliquer: boolean;
}

export function SummaryScreen({
  data,
  session,
  onValider,
  onSauvegarderGithub,
  syncEnCours
}: {
  data: AppData;
  session: SessionRecord;
  onValider: (majs: MajCharge[], rpeGlobal?: number) => void;
  onSauvegarderGithub: () => void;
  syncEnCours: boolean;
}) {
  const [rpeGlobal, setRpeGlobal] = useState<number | undefined>(session.rpeGlobal);
  const [valide, setValide] = useState(false);

  const majsInitiales = useMemo<MajCharge[]>(() => {
    const out: MajCharge[] = [];
    for (const e of session.exercices) {
      if (e.saute) continue;
      const charges = e.series.filter((s) => s.faite && s.charge !== undefined).map((s) => s.charge!);
      if (charges.length === 0) continue;
      const chargeMax = Math.max(...charges);
      const ref = data.exerciseState[e.exerciceId]?.parVariante[e.varianteId]?.chargeReference;
      if (ref === undefined || chargeMax !== ref) {
        out.push({
          exerciceId: e.exerciceId,
          varianteId: e.varianteId,
          nouvelleCharge: chargeMax,
          ancienne: ref,
          appliquer: true
        });
      }
    }
    return out;
  }, [session, data]);

  const [majs, setMajs] = useState(majsInitiales);

  const nbExos = session.exercices.filter((e) => !e.saute).length;
  const nbSautes = session.exercices.filter((e) => e.saute).length;
  const seriesIncompletes = session.exercices
    .filter((e) => !e.saute)
    .map((e) => ({ nom: getExercice(e.exerciceId)?.nom ?? e.exerciceId, n: e.series.filter((s) => !s.faite).length }))
    .filter((x) => x.n > 0);

  return (
    <div className="screen">
      <header className="app-header">
        <h1>Séance terminée ✔</h1>
      </header>

      <div className="card">
        <h3>{nomSeance(session.type)}</h3>
        <p>
          {nbExos} exercices réalisés{nbSautes > 0 ? ` · ${nbSautes} sauté(s)` : ""} · cardio :{" "}
          {session.cardio.fait ? "fait" : "non fait"} · routine : {session.routineFaite ? "faite" : "non faite"}
        </p>
        {seriesIncompletes.length > 0 && (
          <p className="muted">
            Séries incomplètes : {seriesIncompletes.map((x) => `${x.nom} (${x.n})`).join(", ")}
          </p>
        )}
        <label className="gene-label">
          RPE global de la séance (facultatif) : {rpeGlobal ?? "—"}
          <input
            type="range"
            min={1}
            max={10}
            value={rpeGlobal ?? 5}
            onChange={(e) => setRpeGlobal(Number(e.target.value))}
          />
        </label>
      </div>

      {majs.length > 0 && !valide && (
        <div className="card">
          <h3>Enregistrer comme nouvelle charge de référence ?</h3>
          {majs.map((m, i) => (
            <label key={i} className="check-label">
              <input
                type="checkbox"
                checked={m.appliquer}
                onChange={(e) => {
                  const copy = [...majs];
                  copy[i] = { ...m, appliquer: e.target.checked };
                  setMajs(copy);
                }}
              />
              {getExercice(m.exerciceId)?.nom ?? m.exerciceId} : {m.ancienne ?? "—"} kg → {m.nouvelleCharge} kg
            </label>
          ))}
        </div>
      )}

      {!valide ? (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            onValider(majs, rpeGlobal);
            setValide(true);
          }}
        >
          Valider le récapitulatif
        </button>
      ) : (
        <>
          <div className="card">
            <p>✅ Séance enregistrée localement.</p>
            <p className="muted small">
              La sauvegarde GitHub est manuelle : seules les données non sensibles (séances, charges,
              tests) sont envoyées. Gênes et notes restent sur cet appareil.
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onSauvegarderGithub} disabled={syncEnCours}>
            {syncEnCours ? "Sauvegarde en cours…" : "☁️ Sauvegarder sur GitHub"}
          </button>
        </>
      )}
    </div>
  );
}
