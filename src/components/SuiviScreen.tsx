import { useState } from "react";
import { getExercice, SEANCES, TESTS } from "../data/program";
import type { AppData, TestRecord } from "../types";
import { nomSeance } from "../export/exports";

type Onglet = "historique" | "charges" | "tests";

export function SuiviScreen({
  data,
  onAjoutTest,
  onRetour
}: {
  data: AppData;
  onAjoutTest: (t: TestRecord) => void;
  onRetour: () => void;
}) {
  const [onglet, setOnglet] = useState<Onglet>("historique");

  return (
    <div className="screen">
      <header className="app-header">
        <button className="btn btn-ghost" onClick={onRetour}>‹ Retour</button>
        <h1>Suivi</h1>
      </header>

      <div className="tabs">
        {(["historique", "charges", "tests"] as Onglet[]).map((t) => (
          <button key={t} className={`tab ${onglet === t ? "tab-active" : ""}`} onClick={() => setOnglet(t)}>
            {t === "historique" ? "Historique" : t === "charges" ? "Charges" : "Tests"}
          </button>
        ))}
      </div>

      {onglet === "historique" && <Historique data={data} />}
      {onglet === "charges" && <Charges data={data} />}
      {onglet === "tests" && <Tests data={data} onAjoutTest={onAjoutTest} />}

      <div className="card">
        <p className="muted small">
          Dernière sauvegarde GitHub :{" "}
          {data.sync.lastSyncAt ? data.sync.lastSyncAt.slice(0, 16).replace("T", " ") : "jamais"}
          {data.sync.statut === "local-modifie" && " · 🟡 modifications locales non sauvegardées"}
          {data.sync.statut === "erreur" && ` · ⚠️ ${data.sync.lastError}`}
        </p>
      </div>
    </div>
  );
}

function Historique({ data }: { data: AppData }) {
  const sessions = [...data.sessions.filter((s) => s.statut === "terminee")].reverse();
  if (sessions.length === 0) return <p className="muted">Aucune séance terminée.</p>;
  return (
    <div>
      {sessions.map((s) => {
        const faites = s.exercices.filter((e) => !e.saute).reduce((n, e) => n + e.series.filter((x) => x.faite).length, 0);
        return (
          <details key={s.id} className="card">
            <summary>
              <strong>{s.dateDebut.slice(0, 10)}</strong> — {nomSeance(s.type)} · {faites} séries
              {s.cardio.fait ? " · cardio ✔" : ""}
            </summary>
            <ul>
              {s.exercices.map((e, i) => {
                const exo = getExercice(e.exerciceId);
                if (e.saute) return <li key={i} className="muted">{exo?.nom} — sauté</li>;
                return (
                  <li key={i}>
                    {exo?.nom} :{" "}
                    {e.series
                      .filter((x) => x.faite)
                      .map((x) => (x.charge !== undefined ? `${x.charge}kg×${x.reps ?? x.dureeSec ?? "?"}` : `${x.reps ?? x.dureeSec ?? "?"}`))
                      .join(", ") || "—"}
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </div>
  );
}

function Charges({ data }: { data: AppData }) {
  return (
    <div>
      {SEANCES.map((seance) => (
        <details key={seance.id} className="card">
          <summary>
            <strong>{seance.lettre} — {seance.nom}</strong>
          </summary>
          {seance.exercices
            .filter((e) => !e.sansCharge)
            .map((exo) => {
              const st = data.exerciseState[exo.id];
              if (!st) return (
                <p key={exo.id} className="muted small">{exo.nom} : aucune donnée</p>
              );
              return (
                <div key={exo.id} className="charge-bloc">
                  <strong>{exo.nom}</strong>
                  {Object.entries(st.parVariante).map(([vid, v]) => {
                    const variante = exo.variantes.find((x) => x.id === vid);
                    return (
                      <p key={vid} className="small">
                        {variante?.nom ?? vid}
                        {vid === st.varianteActive ? " (active)" : ""} — Charge de référence :{" "}
                        <strong>{v.chargeReference ?? "—"} kg</strong> · Dernière charge utilisée :{" "}
                        {v.derniereCharge ?? "—"} kg
                        {v.meilleurePerf && (
                          <>
                            {" "}· Meilleure performance : {v.meilleurePerf.valeur} {v.meilleurePerf.unite} (
                            {v.meilleurePerf.date.slice(0, 10)})
                          </>
                        )}
                      </p>
                    );
                  })}
                </div>
              );
            })}
        </details>
      ))}
    </div>
  );
}

function Tests({ data, onAjoutTest }: { data: AppData; onAjoutTest: (t: TestRecord) => void }) {
  const [testId, setTestId] = useState(TESTS[0].id);
  const [valeur, setValeur] = useState("");
  const [chargeFixe, setChargeFixe] = useState("");
  const def = TESTS.find((t) => t.id === testId)!;

  return (
    <div>
      <div className="card">
        <h3>Saisir un test</h3>
        <p className="muted small">{def.protocole}</p>
        <div className="form-row">
          <select value={testId} onChange={(e) => setTestId(e.target.value)}>
            {TESTS.map((t) => (
              <option key={t.id} value={t.id}>{t.nom}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          {def.chargeFixe && (
            <input
              type="number"
              inputMode="decimal"
              placeholder="Charge fixe (kg)"
              value={chargeFixe}
              onChange={(e) => setChargeFixe(e.target.value)}
            />
          )}
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Résultat (${def.unite})`}
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
          />
          <button
            className="btn btn-primary"
            disabled={valeur === "" || (def.chargeFixe && chargeFixe === "")}
            onClick={() => {
              onAjoutTest({
                id: `t-${Date.now()}`,
                testId,
                date: new Date().toISOString(),
                valeur: Number(valeur),
                unite: def.unite,
                ...(def.chargeFixe ? { chargeFixe: Number(chargeFixe) } : {})
              });
              setValeur("");
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>

      {TESTS.map((t) => {
        const historique = data.tests.filter((x) => x.testId === t.id);
        if (historique.length === 0) return null;
        return (
          <div key={t.id} className="card">
            <strong>{t.nom}</strong>
            <ul>
              {historique.map((h) => (
                <li key={h.id}>
                  {h.date.slice(0, 10)} : {h.valeur} {h.unite}
                  {h.chargeFixe ? ` @ ${h.chargeFixe} kg` : ""}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
