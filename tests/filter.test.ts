import { describe, expect, it } from "vitest";
import { CLES_INTERDITES, toSyncPayload, verifierPayload } from "../src/sync/filter";
import { defaultData } from "../src/storage";
import type { AppData } from "../src/types";

function donneesAvecChampsSensibles(): AppData {
  const d = defaultData();
  d.settings.github = {
    owner: "utilisateur-prive",
    repo: "suivi-muscu",
    branch: "main",
    path: "data/suivi.json",
    pathMaison: "data/suivi-maison.json",
    token: "github_pat_SECRET_NE_DOIT_JAMAIS_SORTIR"
  };
  d.sessions.push({
    id: "s-1",
    type: "C",
    dateDebut: "2026-08-03T18:00:00.000Z",
    dateFin: "2026-08-03T19:30:00.000Z",
    statut: "terminee",
    routineFaite: true,
    cardio: { fait: true, dureeMin: 30 },
    rpeGlobal: 7,
    geneEpaule: 5, // sensible — ne doit pas sortir
    geneCheville: 2, // sensible
    note: "Douleur bizarre au coude, RDV kiné jeudi", // sensible
    exercices: [
      {
        exerciceId: "tirage-vertical",
        varianteId: "tg-vertical",
        saute: false,
        series: [
          { charge: 60, reps: 10, rpe: 7, faite: true },
          { charge: 60, reps: 9, rpe: 8, faite: true }
        ]
      }
    ]
  });
  d.sessions.push({
    id: "s-2",
    type: "A",
    dateDebut: "2026-08-04T12:00:00.000Z",
    statut: "en-cours", // brouillon — ne doit pas être synchronisé
    routineFaite: false,
    cardio: { fait: false },
    exercices: []
  });
  d.exerciseState["tirage-vertical"] = {
    varianteActive: "tg-vertical",
    parVariante: {
      "tg-vertical": {
        chargeReference: 60,
        derniereCharge: 60,
        meilleurePerf: { valeur: 62.5, unite: "kg", date: "2026-08-01T10:00:00.000Z" }
      }
    }
  };
  d.tests.push({
    id: "t-1",
    testId: "test-deadhang",
    date: "2026-08-16T10:00:00.000Z",
    valeur: 42,
    unite: "sec"
  });
  return d;
}

describe("Filtre de confidentialité (toSyncPayload)", () => {
  it("n'inclut aucune clé interdite dans le JSON sérialisé", () => {
    const payload = toSyncPayload(donneesAvecChampsSensibles());
    const json = JSON.stringify(payload);
    for (const cle of CLES_INTERDITES) {
      expect(json.includes(`"${cle}"`), `clé interdite trouvée : ${cle}`).toBe(false);
    }
  });

  it("n'inclut jamais la valeur du token ni les notes", () => {
    const payload = toSyncPayload(donneesAvecChampsSensibles());
    const json = JSON.stringify(payload);
    expect(json).not.toContain("SECRET");
    expect(json).not.toContain("kiné");
    expect(json).not.toContain("utilisateur-prive");
  });

  it("verifierPayload ne lève pas d'exception sur un payload propre", () => {
    expect(() => verifierPayload(toSyncPayload(donneesAvecChampsSensibles()))).not.toThrow();
  });

  it("exclut les séances en cours (brouillons)", () => {
    const payload = toSyncPayload(donneesAvecChampsSensibles());
    expect(payload.sessions.map((s) => s.id)).toEqual(["s-1"]);
  });

  it("conserve les données d'entraînement utiles", () => {
    const payload = toSyncPayload(donneesAvecChampsSensibles());
    expect(payload.sessions[0].exercices[0].series[0].charge).toBe(60);
    expect(payload.sessions[0].rpeGlobal).toBe(7);
    expect(payload.chargesReference[0].chargeReference).toBe(60);
    expect(payload.chargesReference[0].meilleurePerf?.valeur).toBe(62.5);
    expect(payload.tests).toHaveLength(1);
  });
});

describe("Séparation Salle / Maison", () => {
  function avecSeanceMaison(): AppData {
    const d = donneesAvecChampsSensibles();
    d.sessions.push({
      id: "s-maison-1",
      type: "M1",
      dateDebut: "2026-08-11T09:00:00.000Z",
      dateFin: "2026-08-11T09:30:00.000Z",
      statut: "terminee",
      routineFaite: true,
      cardio: { fait: false },
      piscine: { fait: true, allersRetours: 8, nage: "brasse" },
      exercices: [
        {
          exerciceId: "m-pompes",
          varianteId: "m-pompes-std",
          saute: false,
          series: [{ reps: 18, faite: true }]
        }
      ]
    });
    d.exerciseState["m-pompes"] = { varianteActive: "m-pompes-std", parVariante: { "m-pompes-std": {} } };
    return d;
  }

  it("le fichier SALLE ne contient aucune séance maison", () => {
    const p = toSyncPayload(avecSeanceMaison(), "salle");
    expect(p.sessions.map((s) => s.type)).toEqual(["C"]);
    expect(p.chargesReference.some((c) => c.exerciceId.startsWith("m-"))).toBe(false);
  });

  it("le fichier MAISON ne contient que les séances maison et aucun test de force", () => {
    const p = toSyncPayload(avecSeanceMaison(), "maison");
    expect(p.sessions.map((s) => s.type)).toEqual(["M1"]);
    expect(p.sessions[0].piscine?.allersRetours).toBe(8);
    expect(p.tests).toEqual([]);
  });

  it("le fichier MAISON reste exempt de champs sensibles", () => {
    const json = JSON.stringify(toSyncPayload(avecSeanceMaison(), "maison"));
    for (const cle of CLES_INTERDITES) expect(json.includes(`"${cle}"`)).toBe(false);
  });
});

describe("Persistance locale (structure)", () => {
  it("defaultData produit un schéma v1 complet", () => {
    const d = defaultData();
    expect(d.schemaVersion).toBe(1);
    expect(d.settings.github.path).toBe("data/suivi.json");
    expect(d.sessions).toEqual([]);
    expect(d.sync.statut).toBe("jamais");
  });
});
