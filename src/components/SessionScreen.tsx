import { useState } from "react";
import { getRoutine, getSeance } from "../data/program";
import type { AppData, Exercice, ExoLog, SeanceId, SessionRecord, SetLog } from "../types";
import type { TimerApi } from "../hooks/useTimer";
import { VariantSheet } from "./VariantSheet";

function nouveauLog(seanceId: SeanceId, data: AppData): SessionRecord {
  const seance = getSeance(seanceId)!;
  const exercices: ExoLog[] = seance.exercices.map((exo) => {
    const st = data.exerciseState[exo.id];
    const varianteActive =
      st?.varianteActive ?? exo.variantes.filter((v) => !v.interdit).sort((a, b) => a.rang - b.rang)[0].id;
    const derniere = st?.parVariante[varianteActive]?.derniereCharge;
    const series: SetLog[] = Array.from({ length: exo.series }, () => ({
      charge: exo.sansCharge ? undefined : derniere,
      reps: exo.mode === "reps" ? exo.repsMax : undefined,
      dureeSec: exo.mode === "duree" ? exo.dureeCibleSec : undefined,
      faite: false
    }));
    return { exerciceId: exo.id, varianteId: varianteActive, saute: false, series };
  });
  return {
    id: `s-${Date.now()}`,
    type: seanceId,
    dateDebut: new Date().toISOString(), // re-fixée au clic sur « Commencer »
    demarree: false,
    statut: "en-cours",
    exercices,
    routineFaite: false,
    cardio: { fait: false }
  };
}

export function SessionScreen({
  data,
  seanceId,
  timer,
  onUpdateDraft,
  onFinish,
  onQuit
}: {
  data: AppData;
  seanceId: SeanceId;
  timer: TimerApi;
  onUpdateDraft: (d: SessionRecord) => void;
  onFinish: (d: SessionRecord) => void;
  onQuit: () => void;
}) {
  const seance = getSeance(seanceId)!;
  const routine = getRoutine(seance.routineId);
  const [log, setLog] = useState<SessionRecord>(() =>
    data.draft && data.draft.type === seanceId ? data.draft : nouveauLog(seanceId, data)
  );
  const [exoOuvert, setExoOuvert] = useState<string | null>(seance.exercices[0]?.id ?? null);
  const [variantesPour, setVariantesPour] = useState<Exercice | null>(null);
  const [infosOuvertes, setInfosOuvertes] = useState(false);

  const maj = (l: SessionRecord) => {
    setLog(l);
    onUpdateDraft(l);
  };

  const majSet = (exoIdx: number, setIdx: number, patch: Partial<SetLog>) => {
    const l = structuredClone(log);
    Object.assign(l.exercices[exoIdx].series[setIdx], patch);
    maj(l);
  };

  const totalSeries = log.exercices.filter((e) => !e.saute).reduce((n, e) => n + e.series.length, 0);
  const seriesFaites = log.exercices
    .filter((e) => !e.saute)
    .reduce((n, e) => n + e.series.filter((s) => s.faite).length, 0);

  return (
    <div className="screen screen-session">
      <header className="app-header">
        <button className="btn btn-ghost" onClick={onQuit}>‹ Retour</button>
        <h1>
          {seance.lettre} — {seance.nom}
        </h1>
      </header>

      {!log.demarree && (
        <button
          className="btn btn-primary btn-lg btn-start"
          onClick={() => maj({ ...log, demarree: true, dateDebut: new Date().toISOString() })}
        >
          ▶ Commencer la séance
          <span className="btn-sub">Le chrono de durée démarre maintenant</span>
        </button>
      )}

      <div className="progress-wrap">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${totalSeries ? (seriesFaites / totalSeries) * 100 : 0}%` }} />
        </div>
        <span className="muted">{seriesFaites}/{totalSeries} séries</span>
      </div>

      <details className="card" open={infosOuvertes} onToggle={(e) => setInfosOuvertes((e.target as HTMLDetailsElement).open)}>
        <summary>Objectif & consignes de sécurité</summary>
        <p>{seance.objectif}</p>
        <ul>
          {seance.signauxArret.map((s, i) => (
            <li key={i}>🛑 {s}</li>
          ))}
        </ul>
      </details>

      {routine && seance.routinePosition === "debut" && (
        <RoutineBlock routineId={routine.id} timer={timer} fait={log.routineFaite} onFait={(f) => maj({ ...log, routineFaite: f })} />
      )}

      {seance.exercices.map((exo, exoIdx) => {
        const exoLog = log.exercices[exoIdx];
        const variante = exo.variantes.find((v) => v.id === exoLog.varianteId) ?? exo.variantes[0];
        const st = data.exerciseState[exo.id]?.parVariante[exoLog.varianteId];
        const ouvert = exoOuvert === exo.id;
        const exoFait = !exoLog.saute && exoLog.series.length > 0 && exoLog.series.every((s) => s.faite);
        return (
          <div
            key={exo.id}
            className={`card exo-card ${exoLog.saute ? "exo-saute" : ""} ${exoFait ? "exo-fait" : ""}`}
          >
            <button className="exo-head" onClick={() => setExoOuvert(ouvert ? null : exo.id)}>
              <div>
                {exo.superset && <span className="superset-tag">{exo.superset}</span>}
                <div className="exo-nom">{exo.nom}</div>
                <div className="muted">
                  {exo.series}×
                  {exo.mode === "reps"
                    ? exo.repsMin === exo.repsMax
                      ? exo.repsMax
                      : `${exo.repsMin}–${exo.repsMax}`
                    : `${exo.dureeCibleSec} s`}
                  {exo.parCote ? "/côté" : ""} · RPE {exo.rpe ?? "—"} · repos {exo.reposSec} s
                </div>
                <div className="muted variante-active">▸ {variante.nom}{variante.machine ? ` (${variante.machine})` : ""}</div>
                {!exo.sansCharge && (
                  <div className="muted">Charge de référence : {st?.chargeReference ?? "—"} kg</div>
                )}
              </div>
              <span className="exo-chevron">{ouvert ? "▾" : "▸"}</span>
            </button>

            {ouvert && !exoLog.saute && (
              <div className="exo-body">
                <div className="exo-actions">
                  <button className="btn btn-sm" onClick={() => setVariantesPour(exo)}>Variantes</button>
                  <button className="btn btn-sm" onClick={() => timer.start(`Repos — ${exo.nom}`, exo.reposSec)}>
                    Repos {exo.reposSec} s
                  </button>
                  {exo.mode === "duree" && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => timer.start(exo.nom, exo.dureeCibleSec ?? 30, "exo")}
                    >
                      ▶ Démarrer {exo.dureeCibleSec} s
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      const l = structuredClone(log);
                      l.exercices[exoIdx].saute = true;
                      maj(l);
                    }}
                  >
                    Sauter
                  </button>
                </div>

                {exo.progression && <p className="muted small">📈 {exo.progression}</p>}
                {exo.adaptations && <p className="muted small">🔧 {exo.adaptations}</p>}

                <div className="sets">
                  <div className="set-row set-head">
                    <span>#</span>
                    {!exo.sansCharge && <span>kg</span>}
                    <span>{exo.mode === "reps" ? "reps" : "sec"}</span>
                    <span>RPE</span>
                    <span>✓</span>
                  </div>
                  {exoLog.series.map((set, setIdx) => (
                    <div key={setIdx} className={`set-row ${set.faite ? "set-faite" : ""}`}>
                      <span>{setIdx + 1}</span>
                      {!exo.sansCharge && (
                        <input
                          type="number"
                          inputMode="decimal"
                          value={set.charge ?? ""}
                          placeholder="kg"
                          onChange={(e) =>
                            majSet(exoIdx, setIdx, { charge: e.target.value === "" ? undefined : Number(e.target.value) })
                          }
                        />
                      )}
                      <input
                        type="number"
                        inputMode="numeric"
                        value={(exo.mode === "reps" ? set.reps : set.dureeSec) ?? ""}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          majSet(exoIdx, setIdx, exo.mode === "reps" ? { reps: v } : { dureeSec: v });
                        }}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={10}
                        value={set.rpe ?? ""}
                        placeholder="—"
                        onChange={(e) =>
                          majSet(exoIdx, setIdx, { rpe: e.target.value === "" ? undefined : Number(e.target.value) })
                        }
                      />
                      <button
                        className={`check ${set.faite ? "check-on" : ""}`}
                        onClick={() => {
                          majSet(exoIdx, setIdx, { faite: !set.faite });
                          if (!set.faite) timer.start(`Repos — ${exo.nom}`, exo.reposSec);
                        }}
                        aria-label={`Série ${setIdx + 1} faite`}
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {exoLog.saute && (
              <button
                className="btn btn-sm"
                onClick={() => {
                  const l = structuredClone(log);
                  l.exercices[exoIdx].saute = false;
                  maj(l);
                }}
              >
                Réintégrer l'exercice
              </button>
            )}
          </div>
        );
      })}

      {routine && seance.routinePosition === "fin" && (
        <RoutineBlock routineId={routine.id} timer={timer} fait={log.routineFaite} onFait={(f) => maj({ ...log, routineFaite: f })} />
      )}

      {seance.cardio && (
        <div className="card">
          <div className="cardio-row">
            <label className="check-label">
              <input
                type="checkbox"
                checked={log.cardio.fait}
                onChange={(e) => maj({ ...log, cardio: { ...log.cardio, fait: e.target.checked } })}
              />
              Cardio : marche {seance.cardio.pente} — {seance.cardio.dureeMin} min
            </label>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => timer.start(`Cardio ${seance.cardio!.pente}`, seance.cardio!.dureeMin * 60, "exo")}
            >
              ▶ Démarrer
            </button>
          </div>
          {seance.cardio.note && <p className="muted small">{seance.cardio.note}</p>}
        </div>
      )}

      {seance.piscine && (
        <div className="card piscine-card">
          <h3>🏊 Piscine (optionnel)</h3>
          <label className="check-label">
            <input
              type="checkbox"
              checked={log.piscine?.fait ?? false}
              onChange={(e) =>
                maj({ ...log, piscine: { ...(log.piscine ?? {}), fait: e.target.checked } })
              }
            />
            J'ai fait la piscine
          </label>

          <div className="form-row">
            <label style={{ flex: 1, margin: 0 }}>
              Allers-retours
              <input
                type="number"
                inputMode="numeric"
                placeholder="ex. 8"
                value={log.piscine?.allersRetours ?? ""}
                onChange={(e) =>
                  maj({
                    ...log,
                    piscine: {
                      fait: log.piscine?.fait ?? true,
                      nage: log.piscine?.nage,
                      allersRetours: e.target.value === "" ? undefined : Number(e.target.value)
                    }
                  })
                }
              />
            </label>
            <label style={{ flex: 1, margin: 0 }}>
              Nage
              <select
                value={log.piscine?.nage ?? "brasse"}
                onChange={(e) =>
                  maj({
                    ...log,
                    piscine: {
                      fait: log.piscine?.fait ?? true,
                      allersRetours: log.piscine?.allersRetours,
                      nage: e.target.value
                    }
                  })
                }
              >
                <option value="brasse">Brasse</option>
                <option value="alterne">Alterné rapide/lent</option>
                <option value="crawl">Crawl</option>
                <option value="jambes">Jambes seules</option>
              </select>
            </label>
          </div>

          <p className="muted small">{seance.piscine.consigne}</p>
          <div className="alert">
            <strong>Règle épaule</strong>
            <ul style={{ margin: "4px 0" }}>
              {seance.piscine.reglesEpaule.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary btn-lg btn-finish"
        onClick={() => onFinish({ ...log, dateFin: new Date().toISOString(), statut: "terminee" })}
      >
        Terminer la séance
      </button>

      {variantesPour && (
        <VariantSheet
          exo={variantesPour}
          varianteActive={log.exercices.find((e) => e.exerciceId === variantesPour.id)!.varianteId}
          onChoisir={(vid) => {
            const l = structuredClone(log);
            const el = l.exercices.find((e) => e.exerciceId === variantesPour.id)!;
            el.varianteId = vid;
            // Préremplir depuis la dernière charge connue de CETTE variante
            const derniere = data.exerciseState[variantesPour.id]?.parVariante[vid]?.derniereCharge;
            for (const s of el.series) if (!s.faite) s.charge = derniere;
            maj(l);
            setVariantesPour(null);
          }}
          onFermer={() => setVariantesPour(null)}
        />
      )}
    </div>
  );
}

function RoutineBlock({
  routineId,
  timer,
  fait,
  onFait
}: {
  routineId: string;
  timer: TimerApi;
  fait: boolean;
  onFait: (f: boolean) => void;
}) {
  const routine = getRoutine(routineId)!;
  return (
    <details className="card routine-card" open={!fait}>
      <summary>
        🛡 {routine.nom} <span className="muted">({routine.quand})</span>
      </summary>
      <ul className="routine-list">
        {routine.items.map((it) => (
          <li key={it.id}>
            <strong>{it.nom}</strong> — {it.detail}
            {it.mode === "duree" && it.dureeSec && (
              <button className="btn btn-sm" onClick={() => timer.start(it.nom, it.dureeSec!, "exo")}>
                ▶ {it.dureeSec} s
              </button>
            )}
          </li>
        ))}
      </ul>
      <label className="check-label">
        <input type="checkbox" checked={fait} onChange={(e) => onFait(e.target.checked)} />
        Routine faite
      </label>
    </details>
  );
}
