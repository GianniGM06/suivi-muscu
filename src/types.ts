// ===== Programme (statique) =====

export type Contrainte = "aucune" | "faible" | "modérée" | "élevée";

export interface Variante {
  id: string;
  rang: number; // 1 = prioritaire ; 99 = interdite (affichée barrée, non sélectionnable)
  nom: string;
  machine?: string; // nom anglais Technogym / Hammer Strength
  materiel?: string;
  contrainte: Contrainte;
  note?: string;
  interdit?: boolean;
}

export type ModeExo = "reps" | "duree";

export interface Exercice {
  id: string;
  nom: string;
  mode: ModeExo;
  series: number;
  repsMin?: number;
  repsMax?: number;
  dureeCibleSec?: number; // pour mode "duree"
  rpe?: string;
  reposSec: number;
  superset?: string; // libellé du groupe (ex. "Superset 1") — repos après la paire
  sansCharge?: boolean; // CMJ, gainage… pas de champ charge
  parCote?: boolean;
  progression?: string;
  adaptations?: string;
  arret?: string;
  variantes: Variante[];
}

export interface RoutineItem {
  id: string;
  nom: string;
  detail: string;
  mode: ModeExo;
  dureeSec?: number;
}

export interface Routine {
  id: string;
  nom: string;
  quand: string;
  items: RoutineItem[];
}

export interface Cardio {
  pente: string;
  dureeMin: number;
  note?: string;
}

export interface Seance {
  id: SeanceId;
  lettre: string;
  nom: string;
  dominante: string;
  objectif: string;
  routineId?: string;
  routinePosition?: "debut" | "fin";
  exercices: Exercice[];
  cardio?: Cardio; // absent depuis la v4 : le cardio se fait hors salle
  signauxArret: string[];
}

export type SeanceId = "A" | "B" | "C" | "D" | "E" | "M1" | "M2" | "M3" | "M4";

export type Mode = "salle" | "maison";

export interface TestDef {
  id: string;
  nom: string;
  protocole: string;
  unite: "reps" | "sec" | "cm";
  chargeFixe: boolean;
}

// ===== État local (localStorage) =====

export interface SetLog {
  charge?: number;
  reps?: number;
  dureeSec?: number;
  rpe?: number;
  faite: boolean;
}

export interface ExoLog {
  exerciceId: string;
  varianteId: string;
  saute: boolean;
  series: SetLog[];
}

export interface SessionRecord {
  id: string;
  type: SeanceId;
  dateDebut: string; // ISO — fixée au clic sur « Commencer la séance »
  dateFin?: string;
  demarree?: boolean; // false tant que « Commencer » n'a pas été pressé
  statut: "en-cours" | "terminee";
  exercices: ExoLog[];
  routineFaite: boolean;
  cardio: { fait: boolean; dureeMin?: number };
  rpeGlobal?: number;
  // ---- Champs LOCAUX UNIQUEMENT (jamais synchronisés — voir sync/filter.ts) ----
  geneEpaule?: number;
  geneCheville?: number;
  note?: string;
}

export interface PerfRecord {
  valeur: number;
  unite: "kg" | "sec";
  date: string;
}

export interface VarianteState {
  chargeReference?: number;
  derniereCharge?: number;
  meilleurePerf?: PerfRecord;
}

export interface ExerciceState {
  varianteActive: string;
  parVariante: Record<string, VarianteState>;
}

export interface TestRecord {
  id: string;
  testId: string;
  date: string;
  chargeFixe?: number;
  valeur: number;
  unite: string;
}

export interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string; // stocké UNIQUEMENT en localStorage, jamais synchronisé ni affiché en clair
}

export interface Settings {
  github: GithubConfig;
  theme: "auto" | "clair" | "sombre";
  son: boolean; // bip de fin de chrono (casque Bluetooth inclus)
  mode: Mode; // "salle" (programme v4) ou "maison" (élastiques + piscine)
}

export type SyncStatut = "jamais" | "ok" | "erreur" | "local-modifie";

export interface SyncState {
  statut: SyncStatut;
  lastSyncAt?: string;
  lastSha?: string;
  lastError?: string;
}

export interface AppData {
  schemaVersion: 1;
  settings: Settings;
  exerciseState: Record<string, ExerciceState>;
  sessions: SessionRecord[];
  tests: TestRecord[];
  sync: SyncState;
  draft?: SessionRecord;
  dernierRappelExport?: string;
}

// ===== Payload synchronisé vers GitHub (public) =====
// Ce type est LA garantie de confidentialité : il ne contient ni gêne, ni note,
// ni poids, ni token, ni réglages. Toute tentative d'y ajouter un champ sensible
// doit échouer au test tests/filter.test.ts.

export interface SyncSet {
  charge?: number;
  reps?: number;
  dureeSec?: number;
  rpe?: number;
  faite: boolean;
}

export interface SyncExo {
  exerciceId: string;
  varianteId: string;
  saute: boolean;
  series: SyncSet[];
}

export interface SyncSession {
  id: string;
  type: SeanceId;
  dateDebut: string;
  dateFin?: string;
  statut: string;
  exercices: SyncExo[];
  routineFaite: boolean;
  cardio: { fait: boolean; dureeMin?: number };
  rpeGlobal?: number;
}

export interface SyncChargeRef {
  exerciceId: string;
  varianteId: string;
  chargeReference?: number;
  derniereCharge?: number;
  meilleurePerf?: PerfRecord;
}

export interface SyncPayload {
  app: "suivi-muscu";
  schemaVersion: 1;
  exporteLe: string;
  sessions: SyncSession[];
  chargesReference: SyncChargeRef[];
  tests: TestRecord[];
}
