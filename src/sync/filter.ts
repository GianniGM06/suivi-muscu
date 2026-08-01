// ============================================================
// FILTRE DE CONFIDENTIALITÉ
// Seul le résultat de toSyncPayload() part vers GitHub (dépôt public).
// Champs qui ne doivent JAMAIS sortir : geneEpaule, geneCheville, note,
// token, settings, poids, tour de taille, e-mail, identifiants.
// La liste CLES_INTERDITES est vérifiée par tests/filter.test.ts sur la
// sérialisation JSON complète du payload.
// ============================================================

import type { AppData, SyncChargeRef, SyncPayload, SyncSession } from "../types";

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

export function toSyncPayload(data: AppData): SyncPayload {
  const sessions: SyncSession[] = data.sessions
    .filter((s) => s.statut === "terminee")
    .map((s) => ({
      id: s.id,
      type: s.type,
      dateDebut: s.dateDebut,
      dateFin: s.dateFin,
      statut: s.statut,
      routineFaite: s.routineFaite,
      cardio: { fait: s.cardio.fait, dureeMin: s.cardio.dureeMin },
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
    tests: data.tests.map((t) => ({ ...t }))
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
