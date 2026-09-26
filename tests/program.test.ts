import { describe, expect, it } from "vitest";
import sauvegarde from "../data/suivi.json";
import { getExercice, getRoutine, libelleExoVariante, getSeance, getSeances, ORDRE_MAISON, ORDRE_SUGGESTION, SEANCES_MAISON, SEANCES_SALLE } from "../src/data/program";

describe("Programme v5", () => {
  it("propose les 4 séances salle dans l'ordre 1, 2, 3, +", () => {
    expect(getSeances("salle").map((s) => s.lettre)).toEqual(["1", "2", "3", "+"]);
    expect(ORDRE_SUGGESTION.every((id) => getSeance(id))).toBe(true);
  });

  it("n'utilise jamais deux fois le même id d'exercice dans les séances actives", () => {
    const ids = SEANCES_SALLE.flatMap((s) => s.exercices.map((e) => e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("rattache chaque séance active à une routine existante", () => {
    for (const s of SEANCES_SALLE) if (s.routineId) expect(getRoutine(s.routineId), s.id).toBeDefined();
  });

  it("garde lisibles toutes les séances et charges déjà sauvegardées", () => {
    for (const s of sauvegarde.sessions) {
      expect(getSeance(s.type), `séance ${s.type}`).toBeDefined();
      for (const e of s.exercices) expect(getExercice(e.exerciceId), e.exerciceId).toBeDefined();
    }
    for (const c of sauvegarde.chargesReference) expect(getExercice(c.exerciceId), c.exerciceId).toBeDefined();
  });

  it("propose les 3 séances maison A, B, C avec des ids d'exercice propres à la maison", () => {
    expect(getSeances("maison").map((s) => s.lettre)).toEqual(["A", "B", "C"]);
    expect(ORDRE_MAISON.every((id) => getSeance(id))).toBe(true);
    const idsMaison = SEANCES_MAISON.flatMap((s) => s.exercices.map((e) => e.id));
    const idsSalle = new Set(SEANCES_SALLE.flatMap((s) => s.exercices.map((e) => e.id)));
    expect(new Set(idsMaison).size).toBe(idsMaison.length);
    expect(idsMaison.every((id) => id.startsWith("m-") && !idsSalle.has(id))).toBe(true);
    for (const s of SEANCES_MAISON) expect(getRoutine(s.routineId), s.id).toBeDefined();
  });

  it("nomme la variante pour ne jamais confondre des charges de machines différentes", () => {
    expect(libelleExoVariante("presse", "hack")).toBe("Presse à cuisses · Hack Squat");
    expect(libelleExoVariante("presse", "tg-legpress")).toBe("Presse à cuisses · Leg Press / Linear Leg Press");
    expect(libelleExoVariante("reverse-curl", "reverse-ez")).toBe("Reverse curl (extenseurs)");
  });
});
