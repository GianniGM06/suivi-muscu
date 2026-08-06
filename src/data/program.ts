// ============================================================
// Programme v4 — format 1 heure (révisé le 6 août 2026)
// 4 séances + 1 optionnelle · 6 exos × 3 séries · aucun superset
// Double progression : charge fixe, haut de fourchette atteint
// sur toutes les séries → +2,5 kg.
// Cardio : HORS salle (10 000 pas/jour). Aucun finisher.
// IMPORTANT : ne jamais renommer un id d'exercice existant
// (les charges de référence y sont rattachées).
// ============================================================

import type { Routine, Seance, TestDef } from "../types";

export const INTERDITS_BLOC = [
  "Tout mouvement derrière la nuque (épaule droite non rééduquée)",
  "Back squat barre / développé militaire barre (rotation d'épaule sous charge)",
  "Écarté haltères et pull-over haltère (contrainte max en position étirée)",
  "Poutre, réglettes, campus board (tendons des doigts : pas avant 1 an de grimpe)"
];

export const ROUTINES: Routine[] = [
  {
    id: "routine-epaule",
    nom: "Routine épaule (courte)",
    quand: "Avant les séances A et C (~4 min)",
    items: [
      {
        id: "rot-ext",
        nom: "Rotations externes coude au corps",
        detail: "2×15 — poulie basse, élastique ou haltère. Léger. Repos 30 s.",
        mode: "reps"
      },
      {
        id: "face-pull",
        nom: "Face pull",
        detail: "2×15 — Cable Station + rope hauteur visage. Repos 30 s.",
        mode: "reps"
      }
    ]
  },
  {
    id: "routine-cheville",
    nom: "Routine cheville (courte)",
    quand: "Fin de la séance B (~4 min)",
    items: [
      {
        id: "equilibre",
        nom: "Équilibre unipodal droit",
        detail: "2×30 s — yeux fermés quand la version yeux ouverts est facile.",
        mode: "duree",
        dureeSec: 30
      },
      {
        id: "sautillements",
        nom: "Sautillements bas (sur place puis latéraux)",
        detail: "2×10 — réceptions silencieuses.",
        mode: "reps"
      }
    ]
  },
  {
    id: "routine-complete",
    nom: "Routines complètes épaule + cheville",
    quand: "Fin de la séance E (~10 min)",
    items: [
      {
        id: "rot-ext-c",
        nom: "Rotations externes",
        detail: "3×15 par bras, poulie ou élastique.",
        mode: "reps"
      },
      {
        id: "scaption",
        nom: "Scaption (bras en Y, pouces vers le haut)",
        detail: "2×12 — haltères 2-4 kg.",
        mode: "reps"
      },
      {
        id: "equilibre-c",
        nom: "Équilibre unipodal droit, yeux fermés",
        detail: "3×45 s.",
        mode: "duree",
        dureeSec: 45
      },
      {
        id: "mollets-uni-c",
        nom: "Mollets unilatéral (droit d'abord)",
        detail: "3×12.",
        mode: "reps"
      }
    ]
  }
];

export const SEANCES: Seance[] = [
  // ============================ A — PUSH ============================
  {
    id: "A",
    lettre: "A",
    nom: "Push",
    dominante: "Pectoraux, épaules, triceps · ~50 min",
    objectif:
      "Force de poussée sans irriter la coiffe. Double progression : charge fixe, haut de fourchette sur les 3 séries → +2,5 kg. Développés : jamais plus lourd que 8-10 reps (protection coiffe).",
    routineId: "routine-epaule",
    routinePosition: "debut",
    signauxArret: [
      "Gêne épaule qui augmente pendant l'exercice",
      "Douleur qui irradie dans le bras",
      "Claquement douloureux → fin des poussées du jour"
    ],
    exercices: [
      {
        id: "dev-incline",
        nom: "Développé incliné",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "2-3 reps en réserve",
        reposSec: 120,
        progression: "3×10 propres → +2,5 kg et retour à 8.",
        adaptations: "1re série toujours légère (calibrage).",
        variantes: [
          {
            id: "hs-incline",
            rang: 1,
            nom: "ISO-Lateral Incline Press",
            machine: "Hammer Strength ISO-Lateral Incline Press",
            contrainte: "faible",
            note: "Convergent, unilatéral : le côté droit ne compense pas."
          },
          {
            id: "tg-incline",
            rang: 2,
            nom: "Incline Chest Press",
            machine: "Technogym Incline Chest Press (Selection)",
            contrainte: "faible"
          },
          {
            id: "halt-incline",
            rang: 3,
            nom: "Haltères prise neutre, banc 30°",
            materiel: "Haltères + banc",
            contrainte: "modérée"
          },
          {
            id: "barre-incline",
            rang: 99,
            interdit: true,
            nom: "Barre au banc incliné",
            contrainte: "élevée",
            note: "Rotation interne imposée — pas ce bloc."
          }
        ]
      },
      {
        id: "dev-epaules",
        nom: "Développé épaules (devant, prise neutre)",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "2-3 reps en réserve",
        reposSec: 90,
        adaptations: "Si gêne : remplacer par élévations poulie + face pull.",
        variantes: [
          {
            id: "tg-shoulder",
            rang: 1,
            nom: "Shoulder Press (poignées neutres)",
            machine: "Technogym Shoulder Press",
            contrainte: "modérée"
          },
          {
            id: "hs-shoulder",
            rang: 2,
            nom: "ISO-Lateral Shoulder Press",
            machine: "Hammer Strength ISO-Lateral Shoulder Press",
            contrainte: "modérée"
          },
          {
            id: "militaire",
            rang: 99,
            interdit: true,
            nom: "Développé militaire barre / derrière la nuque",
            contrainte: "élevée"
          }
        ]
      },
      {
        id: "ecarte",
        nom: "Écarté",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "Échec autorisé sur la dernière",
        reposSec: 60,
        variantes: [
          {
            id: "tg-pec",
            rang: 1,
            nom: "Pectoral Machine (chest fly)",
            machine: "Technogym Pectoral Machine",
            contrainte: "faible"
          },
          {
            id: "cable-fly",
            rang: 2,
            nom: "Écarté poulie hauteur poitrine",
            machine: "Cable Station",
            contrainte: "faible"
          },
          {
            id: "halt-fly",
            rang: 99,
            interdit: true,
            nom: "Écarté haltères banc plat",
            contrainte: "élevée"
          }
        ]
      },
      {
        id: "elev-lat-a",
        nom: "Élévations latérales",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "Échec autorisé sur la dernière",
        reposSec: 60,
        variantes: [
          {
            id: "cable-lat",
            rang: 1,
            nom: "Poulie basse unilatérale",
            machine: "Cable Station",
            contrainte: "faible"
          },
          {
            id: "halt-lat",
            rang: 2,
            nom: "Haltères",
            materiel: "Haltères",
            contrainte: "modérée",
            note: "Pas au-dessus de l'horizontale."
          }
        ]
      },
      {
        id: "triceps-a",
        nom: "Triceps pushdown",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "Échec autorisé sur la dernière",
        reposSec: 60,
        variantes: [
          {
            id: "cable-pushdown",
            rang: 1,
            nom: "Pushdown (rope ou barre)",
            machine: "Cable Station + rope",
            contrainte: "faible"
          },
          {
            id: "tg-armext",
            rang: 2,
            nom: "Arm Extension",
            machine: "Technogym Arm Extension",
            contrainte: "faible"
          }
        ]
      },
      {
        id: "rotation-ext-a",
        nom: "Rotation externe poulie (prévention)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "Léger, jamais à l'échec",
        reposSec: 45,
        variantes: [
          {
            id: "rot-cable",
            rang: 1,
            nom: "Poulie basse, coude au corps",
            machine: "Cable Station",
            contrainte: "faible"
          },
          {
            id: "rot-elastique",
            rang: 2,
            nom: "Élastique",
            materiel: "Élastique",
            contrainte: "faible"
          }
        ]
      }
    ],
    cardio: undefined
  },

  // ==================== B — JAMBES COMPLET (volley) ====================
  {
    id: "B",
    lettre: "B",
    nom: "Jambes complet",
    dominante: "Détente, quadriceps, ischios, mollets, cheville · ~48 min",
    objectif:
      "Puissance à froid en début de séance, force en 6-8 sur la presse (ton point fort), équilibre quadri/ischios. Sauts : jamais à l'échec, qualité avant tout.",
    routineId: "routine-cheville",
    routinePosition: "fin",
    signauxArret: [
      "Douleur cheville ou genou pendant les sauts → sauts supprimés, le reste continue"
    ],
    exercices: [
      {
        id: "cmj",
        nom: "Sauts verticaux (CMJ)",
        mode: "reps",
        series: 3,
        repsMin: 3,
        repsMax: 3,
        rpe: "Explosif, jamais à l'échec",
        reposSec: 90,
        sansCharge: true,
        variantes: [
          { id: "cmj-std", rang: 1, nom: "CMJ, intention maximale", contrainte: "aucune" }
        ]
      },
      {
        id: "box-jump",
        nom: "Box jump 30-40 cm",
        mode: "reps",
        series: 3,
        repsMin: 3,
        repsMax: 3,
        rpe: "Qualité > hauteur",
        reposSec: 90,
        sansCharge: true,
        adaptations: "Cheville instable → montée sur box sans saut.",
        variantes: [
          { id: "box-std", rang: 1, nom: "Box jump, réception amortie", materiel: "Box 30-40 cm", contrainte: "aucune" },
          { id: "saut-longueur", rang: 2, nom: "Saut en longueur pieds joints", contrainte: "aucune" }
        ]
      },
      {
        id: "presse",
        nom: "Presse à cuisses",
        mode: "reps",
        series: 3,
        repsMin: 6,
        repsMax: 8,
        rpe: "2-3 reps en réserve",
        reposSec: 120,
        progression: "3×8 propres → +5-10 kg (les paliers de presse sont larges).",
        variantes: [
          {
            id: "tg-legpress",
            rang: 1,
            nom: "Leg Press / Linear Leg Press",
            machine: "Technogym Leg Press ou Hammer Strength Linear Leg Press",
            contrainte: "aucune",
            note: "Ton exercice de force : c'est ici que le lourd est le plus rentable."
          },
          { id: "hack", rang: 2, nom: "Hack Squat", machine: "Hack Squat", contrainte: "aucune" },
          {
            id: "back-squat",
            rang: 99,
            interdit: true,
            nom: "Back squat barre",
            contrainte: "élevée",
            note: "Le rack impose une rotation d'épaule sous charge."
          }
        ]
      },
      {
        id: "quad-uni",
        nom: "Leg extension",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "1-2 reps en réserve, pas l'échec",
        reposSec: 90,
        variantes: [
          { id: "tg-legext", rang: 1, nom: "Leg Extension", machine: "Technogym Leg Extension", contrainte: "aucune" },
          { id: "split-squat", rang: 2, nom: "Split squat haltères", materiel: "Haltères", contrainte: "faible" }
        ]
      },
      {
        id: "leg-curl",
        nom: "Leg curl assis",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "1-2 reps en réserve",
        reposSec: 90,
        variantes: [
          {
            id: "tg-legcurl",
            rang: 1,
            nom: "Leg Curl (assis)",
            machine: "Technogym Leg Curl",
            contrainte: "aucune",
            note: "Assis = meilleure tension sur les ischios."
          },
          {
            id: "prone-curl",
            rang: 2,
            nom: "Prone / Seated Leg Curl",
            machine: "Technogym Prone Leg Curl ou HS Seated Leg Curl",
            contrainte: "aucune"
          }
        ]
      },
      {
        id: "mollets",
        nom: "Mollets debout",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "Échec autorisé sur la dernière",
        reposSec: 45,
        variantes: [
          { id: "tg-calf", rang: 1, nom: "Standing Calf Raise", machine: "Technogym Standing Calf Raise", contrainte: "aucune" },
          { id: "calf-presse", rang: 2, nom: "Presse en pointe de pied", machine: "Leg Press", contrainte: "aucune" },
          { id: "calf-halt", rang: 3, nom: "Mollets haltère unilatéral", materiel: "Haltère + marche", contrainte: "faible" }
        ]
      }
    ],
    cardio: undefined
  },

  // ============================ C — PULL ============================
  {
    id: "C",
    lettre: "C",
    nom: "Pull",
    dominante: "Dos, arrière d'épaule, lombaires, grip · ~50 min",
    objectif:
      "Tirage lourd en 6-8, équilibre des épaules, chaîne postérieure via l'extension 45°, grip pour l'escalade. Pas de biceps ici (concentrés sur la séance D).",
    routineId: "routine-epaule",
    routinePosition: "debut",
    signauxArret: [
      "Douleur au coude interne (épitrochlée) → stop dead hang, réévaluation"
    ],
    exercices: [
      {
        id: "tirage-vertical",
        nom: "Tirage vertical prise neutre",
        mode: "reps",
        series: 3,
        repsMin: 6,
        repsMax: 8,
        rpe: "2-3 reps en réserve — repartir à 32,5 kg",
        reposSec: 120,
        progression: "3×8 propres → +2,5 kg.",
        adaptations: "Grip qui lâche avant le dos : sangles (grip travaillé au dead hang).",
        variantes: [
          {
            id: "tg-vertical",
            rang: 1,
            nom: "Vertical Traction (poignées neutres)",
            machine: "Technogym Vertical Traction",
            contrainte: "faible"
          },
          {
            id: "hs-pulldown",
            rang: 2,
            nom: "ISO-Lateral Front Lat Pulldown",
            machine: "Hammer Strength ISO-Lateral Front Lat Pulldown",
            contrainte: "faible"
          },
          {
            id: "tirage-nuque",
            rang: 99,
            interdit: true,
            nom: "Tirage nuque",
            contrainte: "élevée"
          }
        ]
      },
      {
        id: "rowing",
        nom: "Rowing horizontal",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "2-3 reps en réserve",
        reposSec: 90,
        variantes: [
          {
            id: "hs-row",
            rang: 1,
            nom: "ISO-Lateral Low Row (appui poitrine)",
            machine: "Hammer Strength ISO-Lateral Low Row",
            contrainte: "faible"
          },
          { id: "tg-lowrow", rang: 2, nom: "Low Row", machine: "Technogym Low Row", contrainte: "faible" },
          { id: "row-cable", rang: 3, nom: "Rowing poulie basse triangle", machine: "Cable Station", contrainte: "faible" }
        ]
      },
      {
        id: "pullover",
        nom: "Pull-over bras tendus",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        variantes: [
          { id: "cable-pullover", rang: 1, nom: "Pull-over poulie haute (corde)", machine: "Cable Station", contrainte: "faible" },
          { id: "halt-pullover", rang: 99, interdit: true, nom: "Pull-over haltère sur banc", contrainte: "élevée" }
        ]
      },
      {
        id: "arriere-epaule",
        nom: "Reverse fly (arrière d'épaule)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        variantes: [
          {
            id: "reverse-fly",
            rang: 1,
            nom: "Reverse fly machine",
            machine: "Technogym Pectoral Machine (mode reverse) / Rear Delt",
            contrainte: "faible"
          },
          { id: "face-pull-haut", rang: 2, nom: "Face pull haut", machine: "Cable Station", contrainte: "faible" }
        ]
      },
      {
        id: "extension-45",
        nom: "Extension lombaire (banc à 45°)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "2-3 reps en réserve, mouvement contrôlé",
        reposSec: 60,
        progression: "Poids du corps d'abord ; disque contre la poitrine ensuite.",
        variantes: [
          {
            id: "ext45-std",
            rang: 1,
            nom: "Banc à lombaires 45°",
            machine: "Back Extension Bench",
            contrainte: "aucune",
            note: "Remplace le RDL : chaîne postérieure sans dos chargé en flexion."
          }
        ]
      },
      {
        id: "dead-hang",
        nom: "Dead hang (suspension barre)",
        mode: "duree",
        series: 3,
        dureeCibleSec: 40,
        rpe: "Max, viser 30-45 s",
        reposSec: 90,
        sansCharge: true,
        progression: "+5 s par semaine.",
        variantes: [
          {
            id: "hang-barre",
            rang: 1,
            nom: "Barre, prise pleine main (open hand)",
            materiel: "Barre de traction",
            contrainte: "faible",
            note: "Épaules légèrement engagées, jamais relâchées."
          },
          { id: "farmer-c", rang: 2, nom: "Farmer hold haltères lourds", materiel: "Haltères", contrainte: "faible" }
        ]
      }
    ],
    cardio: undefined
  },

  // ==================== D — BRAS, AVANT-BRAS & GRIP ====================
  {
    id: "D",
    lettre: "D",
    nom: "Bras, avant-bras & grip",
    dominante: "Biceps, triceps, avant-bras — prépa escalade · ~42 min",
    objectif:
      "Bras et surtout avant-bras. Les extenseurs de doigts sont EN PREMIER : c'est l'exercice qui prévient l'épitrochléite du grimpeur, et en fin de séance il ne se fait jamais. Repos courts partout : petits muscles, récupération rapide.",
    signauxArret: [
      "Douleur au coude ou au poignet → stop l'exo concerné, garder les extenseurs légers",
      "Cette séance ne doit jamais laisser de fortes courbatures — volume, pas intensité"
    ],
    exercices: [
      {
        id: "extenseurs-doigts",
        nom: "Extenseurs de doigts (élastique) — EN PREMIER",
        mode: "reps",
        series: 2,
        repsMin: 20,
        repsMax: 20,
        rpe: "Léger",
        reposSec: 30,
        sansCharge: true,
        variantes: [
          {
            id: "elastique-doigts",
            rang: 1,
            nom: "Élastique à doigts (ouverture contre résistance)",
            materiel: "Élastique à doigts ou gros élastique",
            contrainte: "aucune",
            note: "Prévention n°1 de l'épitrochléite. À faire aussi devant la télé."
          }
        ]
      },
      {
        id: "hammer-curl",
        nom: "Hammer curl",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "Repartir à 10 kg — ne pas remonter avant 3×10 propres",
        reposSec: 60,
        variantes: [
          {
            id: "hammer-halt",
            rang: 1,
            nom: "Haltères, prise marteau",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Meilleur transfert escalade (brachioradial)."
          },
          { id: "hammer-cable", rang: 2, nom: "Curl marteau poulie + rope", machine: "Cable Station", contrainte: "faible" }
        ]
      },
      {
        id: "pushdown-d",
        nom: "Triceps pushdown",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "Échec autorisé sur la dernière",
        reposSec: 60,
        variantes: [
          { id: "pushdown-rope", rang: 1, nom: "Pushdown rope", machine: "Cable Station + rope", contrainte: "faible" }
        ]
      },
      {
        id: "curl-etirement",
        nom: "Curl incliné (chef long)",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "Repartir à 6 kg",
        reposSec: 60,
        variantes: [
          { id: "curl-incline", rang: 1, nom: "Curl incliné haltères (banc 45-60°)", materiel: "Haltères + banc", contrainte: "faible" },
          { id: "curl-poulie-basse", rang: 2, nom: "Curl poulie basse", machine: "Cable Station", contrainte: "faible" }
        ]
      },
      {
        id: "reverse-curl",
        nom: "Reverse curl (extenseurs)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        variantes: [
          { id: "reverse-ez", rang: 1, nom: "Barre EZ prise pronation", materiel: "Barre EZ", contrainte: "faible" }
        ]
      },
      {
        id: "wrist-curl",
        nom: "Wrist curl (flexion poignet)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "Échec autorisé",
        reposSec: 45,
        variantes: [
          { id: "wrist-halt", rang: 1, nom: "Haltères, avant-bras posés", materiel: "Haltères + banc", contrainte: "faible" }
        ]
      },
      {
        id: "reverse-wrist-curl",
        nom: "Reverse wrist curl (extension poignet)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "1-2 reps en réserve",
        reposSec: 45,
        variantes: [
          { id: "rwrist-halt", rang: 1, nom: "Haltères, avant-bras posés", materiel: "Haltères + banc", contrainte: "faible" }
        ]
      },
      {
        id: "grip-long",
        nom: "Farmer hold",
        mode: "duree",
        series: 3,
        dureeCibleSec: 40,
        rpe: "Lourd, contrôlé — 30-45 s",
        reposSec: 60,
        progression: "+5 s par semaine.",
        variantes: [
          { id: "farmer-d", rang: 1, nom: "Farmer hold haltères lourds", materiel: "Haltères", contrainte: "faible" },
          { id: "hang-d", rang: 2, nom: "Dead hang barre", materiel: "Barre de traction", contrainte: "faible" },
          { id: "pinch-d", rang: 3, nom: "Pinch plate hold", materiel: "Disques", contrainte: "faible" }
        ]
      }
    ],
    cardio: undefined
  },

  // ============ E — OPTIONNELLE : COMPLÉMENT & PRÉVENTION ============
  {
    id: "E",
    lettre: "E",
    nom: "Optionnelle : complément & prévention",
    dominante: "Chaîne postérieure, gainage, routines complètes · ~40 min",
    objectif:
      "Séance à faire quand tu as le temps. Elle rattrape ce que le format 1 h a fait sauter : extension lombaire, fessiers, gainage, routines épaule et cheville complètes.",
    routineId: "routine-complete",
    routinePosition: "fin",
    signauxArret: ["Douleur lombaire sur l'extension → réduire l'amplitude, poids du corps"],
    exercices: [
      {
        id: "extension-45-e",
        nom: "Extension lombaire (banc à 45°)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "2-3 reps en réserve",
        reposSec: 60,
        variantes: [
          { id: "ext45-std-e", rang: 1, nom: "Banc à lombaires 45°", machine: "Back Extension Bench", contrainte: "aucune" }
        ]
      },
      {
        id: "abduct",
        nom: "Abducteurs machine",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        variantes: [
          {
            id: "tg-abductor",
            rang: 1,
            nom: "Abductor",
            machine: "Technogym Abductor",
            contrainte: "aucune",
            note: "Fessier moyen = stabilité du genou à la réception."
          }
        ]
      },
      {
        id: "leg-curl-e",
        nom: "Leg curl",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        variantes: [
          { id: "tg-legcurl-e", rang: 1, nom: "Leg Curl (assis)", machine: "Technogym Leg Curl", contrainte: "aucune" }
        ]
      },
      {
        id: "fentes",
        nom: "Fentes marchées ou step-up",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 10,
        rpe: "2-3 reps en réserve",
        reposSec: 60,
        parCote: true,
        variantes: [
          { id: "fentes-halt", rang: 1, nom: "Fentes haltères", materiel: "Haltères", contrainte: "faible" },
          { id: "stepup-e", rang: 2, nom: "Step-up sur box", materiel: "Box + haltères", contrainte: "faible" }
        ]
      },
      {
        id: "gainage",
        nom: "Planche",
        mode: "duree",
        series: 3,
        dureeCibleSec: 40,
        rpe: "—",
        reposSec: 45,
        sansCharge: true,
        progression: "+5 s par semaine.",
        variantes: [
          { id: "planche", rang: 1, nom: "Planche + planche latérale (30 s/côté)", contrainte: "aucune" }
        ]
      },
      {
        id: "pallof",
        nom: "Pallof press (anti-rotation)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "1-2 reps en réserve",
        reposSec: 45,
        parCote: true,
        variantes: [
          { id: "pallof-cable", rang: 1, nom: "Cable Station hauteur poitrine", machine: "Cable Station", contrainte: "faible" },
          { id: "pallof-elastique", rang: 2, nom: "Élastique fixé", materiel: "Élastique", contrainte: "faible" }
        ]
      }
    ],
    cardio: undefined
  }
];

export const TESTS: TestDef[] = [
  { id: "test-presse", nom: "Presse à cuisses", protocole: "Charge fixe, max de reps propres (RPE 9)", unite: "reps", chargeFixe: true },
  { id: "test-tirage", nom: "Tirage vertical prise neutre", protocole: "Charge fixe, max de reps (RPE 9)", unite: "reps", chargeFixe: true },
  { id: "test-developpe", nom: "Développé machine", protocole: "Charge fixe, max de reps (RPE 9)", unite: "reps", chargeFixe: true },
  { id: "test-deadhang", nom: "Dead hang", protocole: "Temps max, prise pleine main", unite: "sec", chargeFixe: false },
  { id: "test-farmer", nom: "Farmer hold", protocole: "Temps max, charge fixe", unite: "sec", chargeFixe: true },
  { id: "test-cmj", nom: "CMJ (saut vertical)", protocole: "Meilleur de 3 sauts, marque au mur", unite: "cm", chargeFixe: false }
];

export const ORDRE_SUGGESTION: ReadonlyArray<string> = ["A", "B", "C", "D"];

export function getSeance(id: string): Seance | undefined {
  return SEANCES.find((s) => s.id === id);
}

export function getRoutine(id: string | undefined): Routine | undefined {
  return ROUTINES.find((r) => r.id === id);
}

export function getExercice(exerciceId: string) {
  for (const s of SEANCES) {
    const e = s.exercices.find((x) => x.id === exerciceId);
    if (e) return e;
  }
  return undefined;
}
