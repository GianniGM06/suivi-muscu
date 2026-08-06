import type { AppData } from "./types";

const KEY = "suivi-muscu:v1";

export function defaultData(): AppData {
  return {
    schemaVersion: 1,
    settings: {
      github: {
        owner: "",
        repo: "suivi-muscu",
        branch: "main",
        path: "data/suivi.json",
        token: ""
      },
      theme: "auto",
      son: true
    },
    exerciseState: {},
    sessions: [],
    tests: [],
    sync: { statut: "jamais" }
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as AppData;
    if (parsed.schemaVersion !== 1) {
      // Emplacement des futures migrations de schéma.
      return { ...defaultData(), ...parsed, schemaVersion: 1 };
    }
    // Fusion défensive avec les valeurs par défaut (champs ajoutés plus tard).
    const d = defaultData();
    return {
      ...d,
      ...parsed,
      settings: {
        ...d.settings,
        ...parsed.settings,
        github: { ...d.settings.github, ...parsed.settings?.github }
      },
      sync: { ...d.sync, ...parsed.sync }
    };
  } catch {
    return defaultData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    /* non bloquant */
  }
}
