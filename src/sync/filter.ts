// ============================================================
// FILTRE DE CONFIDENTIALITÉ + SÉPARATION SALLE / MAISON
// Deux fichiers distincts sur GitHub :
//   data/suivi.json         → séances SALLE (A-E)
//   data/suivi-maison.json  → séances MAISON (M1-M3)
// Champs qui ne doivent JAMAIS sortir : geneEpaule, geneCheville,
// note, token, settings, poids, tour de taille, e-mail, identifiants.
// Vérifié par tests/filter.test.ts sur la sérialisation complète.
// ============================================================

import type { AppData, Mode, SyncChargeRef, SyncPayload, SyncSession } from "../types";
import { estMaison, getExercice, SEANCES_MAISON } from "../data/program";

export const CLES_INTERDITES = [
  "geneEpaule",
  "geneCheville",
  "note",
  "token",
  "github",
  "settings",
  "poids",
  "tourDeTaille",
  "email",
  "owner"
] as const;

/** Un exercice appartient-il au mode Maison ? */
function exerciceMaison(exerciceId: string): boolean {
  return SEANCES_MAISON.some((s) => s.exercices.some((e) => e.id === exerciceId));
}

export function toSyncPayload(data: AppData, mode: Mode = "salle"): SyncPayload {
  const veutMaison = mode === "maison";

  const sessions: SyncSession[] = data.sessions
    .filter((s) => s.statut === "terminee" && estMaison(s.type) === veutMaison)
    .map((s) => ({
      id: s.id,
      type: s.type,
      dateDebut: s.dateDebut,
      dateFin: s.dateFin,
      statut: s.statut,
      routineFaite: s.routineFaite,
      cardio: { fait: s.cardio.fait, dureeMin: s.cardio.dureeMin },
      ...(s.piscine
        ? {
            piscine: {
              fait: s.piscine.fait,
              allersRetours: s.piscine.allersRetours,
              nage: s.piscine.nage
            }
          }
        : {}),
      rpeGlobal: s.rpeGlobal,
      exercices: s.exercices.map((e) => ({
        exerciceId: e.exerciceId,
        varianteId: e.varianteId,
        saute: e.saute,
        series: e.series.map((set) => ({
          charge: set.charge,
          reps: set.reps,
          dureeSec: set.dureeSec,
          rpe: set.rpe,
          faite: set.faite
        }))
      }))
    }));

  const chargesReference: SyncChargeRef[] = [];
  for (const [exerciceId, state] of Object.entries(data.exerciseState)) {
    if (exerciceMaison(exerciceId) !== veutMaison) continue;
    if (!getExercice(exerciceId)) continue; // exercice retiré du programme
    for (const [varianteId, v] of Object.entries(state.parVariante)) {
      chargesReference.push({
        exerciceId,
        varianteId,
        chargeReference: v.chargeReference,
        derniereCharge: v.derniereCharge,
        meilleurePerf: v.meilleurePerf
      });
    }
  }

  return {
    app: "suivi-muscu",
    schemaVersion: 1,
    exporteLe: new Date().toISOString(),
    sessions,
    chargesReference,
    // Les tests de force ne concernent que la salle
    tests: veutMaison ? [] : data.tests.map((t) => ({ ...t }))
  };
}

/** Vérification défensive à l'exécution, en plus du test unitaire. */
export function verifierPayload(payload: SyncPayload): void {
  const json = JSON.stringify(payload);
  for (const cle of CLES_INTERDITES) {
    if (json.includes(`"${cle}"`)) {
      throw new Error(
        `Sécurité : la clé interdite « ${cle} » est présente dans le payload. Synchronisation annulée.`
      );
    }
  }
}
