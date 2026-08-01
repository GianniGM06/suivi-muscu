import type { AppData } from "../types";
import { getExercice, getSeance, TESTS } from "../data/program";

function telecharger(nom: string, contenu: string, type: string): void {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  a.click();
  URL.revokeObjectURL(url);
}

/** Export JSON COMPLET local (toutes données, y compris champs locaux — SANS le token). */
export function exportJsonComplet(data: AppData): void {
  const copie = JSON.parse(JSON.stringify(data)) as AppData;
  copie.settings.github.token = ""; // le token ne sort jamais de l'appareil
  telecharger(
    `suivi-muscu-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(copie, null, 2),
    "application/json"
  );
}

export function exportCsv(data: AppData): void {
  const lignes: string[] = [
    "date;seance;exercice;variante;serie;charge_kg;reps;duree_sec;rpe;faite"
  ];
  for (const s of data.sessions.filter((x) => x.statut === "terminee")) {
    for (const e of s.exercices) {
      const exo = getExercice(e.exerciceId);
      e.series.forEach((set, i) => {
        lignes.push(
          [
            s.dateDebut.slice(0, 10),
            s.type,
            exo?.nom ?? e.exerciceId,
            e.varianteId,
            i + 1,
            set.charge ?? "",
            set.reps ?? "",
            set.dureeSec ?? "",
            set.rpe ?? "",
            set.faite ? "oui" : "non"
          ].join(";")
        );
      });
    }
  }
  lignes.push("");
  lignes.push("exercice;variante;charge_reference_kg;derniere_charge_kg");
  for (const [exerciceId, st] of Object.entries(data.exerciseState)) {
    const exo = getExercice(exerciceId);
    for (const [varianteId, v] of Object.entries(st.parVariante)) {
      lignes.push(
        [exo?.nom ?? exerciceId, varianteId, v.chargeReference ?? "", v.derniereCharge ?? ""].join(";")
      );
    }
  }
  telecharger(
    `suivi-muscu-seances-${new Date().toISOString().slice(0, 10)}.csv`,
    "﻿" + lignes.join("\n"),
    "text/csv;charset=utf-8"
  );
}

/** Bilan Markdown concis pour Claude — gênes agrégées, aucun détail médical. */
export function bilanPourClaude(data: AppData): string {
  const sessions = data.sessions.filter((s) => s.statut === "terminee");
  if (sessions.length === 0) return "Aucune séance terminée pour le moment.";

  const debut = sessions[0].dateDebut.slice(0, 10);
  const fin = sessions[sessions.length - 1].dateDebut.slice(0, 10);
  const parType = new Map<string, number>();
  for (const s of sessions) parType.set(s.type, (parType.get(s.type) ?? 0) + 1);

  const l: string[] = [];
  l.push(`# Bilan d'entraînement — ${debut} → ${fin}`);
  l.push("");
  l.push(`**Séances terminées** : ${sessions.length} (${[...parType.entries()].map(([t, n]) => `${t}×${n}`).join(", ")})`);

  const cardioFaits = sessions.filter((s) => s.cardio.fait).length;
  l.push(`**Cardio réalisé** : ${cardioFaits}/${sessions.length} séances`);

  // Charges de référence actuelles
  l.push("");
  l.push("## Charges de référence actuelles");
  for (const [exerciceId, st] of Object.entries(data.exerciseState)) {
    const exo = getExercice(exerciceId);
    const v = st.parVariante[st.varianteActive];
    if (v?.chargeReference !== undefined) {
      l.push(`- ${exo?.nom ?? exerciceId} : ${v.chargeReference} kg`);
    }
  }

  // Tests
  if (data.tests.length > 0) {
    l.push("");
    l.push("## Tests");
    for (const t of data.tests.slice(-12)) {
      const def = TESTS.find((d) => d.id === t.testId);
      l.push(
        `- ${t.date.slice(0, 10)} — ${def?.nom ?? t.testId} : ${t.valeur} ${t.unite}${t.chargeFixe ? ` @ ${t.chargeFixe} kg` : ""}`
      );
    }
  }

  // Exercices sautés
  const sautes = new Map<string, number>();
  for (const s of sessions)
    for (const e of s.exercices)
      if (e.saute) sautes.set(e.exerciceId, (sautes.get(e.exerciceId) ?? 0) + 1);
  if (sautes.size > 0) {
    l.push("");
    l.push("## Exercices sautés");
    for (const [id, n] of sautes.entries()) l.push(`- ${getExercice(id)?.nom ?? id} : ${n}×`);
  }

  // Gênes — AGRÉGÉ uniquement, sans détail
  const epaule3 = sessions.filter((s) => (s.geneEpaule ?? 0) > 3).length;
  const cheville3 = sessions.filter((s) => (s.geneCheville ?? 0) > 3).length;
  l.push("");
  l.push("## Alertes (agrégées)");
  l.push(`- Séances avec gêne épaule > 3/10 : ${epaule3}`);
  l.push(`- Séances avec gêne cheville > 3/10 : ${cheville3}`);

  l.push("");
  l.push("## À adapter / questions");
  l.push("- (à compléter avant l'envoi)");

  return l.join("\n");
}

export function nomSeance(type: string): string {
  const s = getSeance(type);
  return s ? `${s.lettre} — ${s.nom}` : type;
}
