// ============================================================
// Programme Août 2026 — Bloc "Vacances" (v2)
// Fichier de données ÉDITABLE : modifier ici, jamais dans la logique.
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
    nom: "Routine A — Épaule",
    quand: "Avant les séances A, C et D (~8 min)",
    items: [
      {
        id: "rot-ext",
        nom: "Rotations externes coude au corps",
        detail:
          "2×15 — Cable Station poulie basse (coude collé), élastique ou haltère allongé. Léger, brûlure en fin de série. Repos 30 s.",
        mode: "reps"
      },
      {
        id: "face-pull",
        nom: "Face pull",
        detail:
          "3×15 — Cable Station + rope hauteur visage, ou élastique. RPE 6–7. Repos 45 s.",
        mode: "reps"
      },
      {
        id: "scaption",
        nom: "Scaption (bras en Y, pouces vers le haut)",
        detail: "2×12 — haltères 2–4 kg. Contrôle total. Repos 30 s.",
        mode: "reps"
      }
    ]
  },
  {
    id: "routine-cheville",
    nom: "Routine B — Cheville",
    quand: "Fin des séances B et E (~5 min)",
    items: [
      {
        id: "equilibre",
        nom: "Équilibre unipodal droit",
        detail:
          "3×30 s — S1 yeux ouverts · S2 yeux fermés · S3 sur coussin · S4 yeux fermés sur coussin.",
        mode: "duree",
        dureeSec: 30
      },
      {
        id: "mollets-uni",
        nom: "Mollets debout unilatéral (droit d'abord)",
        detail: "3×12 — Standing Calf Raise ou marche d'escalier.",
        mode: "reps"
      },
      {
        id: "sautillements",
        nom: "Sautillements bas (sur place puis latéraux)",
        detail: "2×10 — à partir de S2, réceptions silencieuses.",
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
    dominante: "Pectoraux, épaules, triceps",
    objectif:
      "Force de poussée sans irriter la coiffe des rotateurs · maintien de la masse en déficit.",
    routineId: "routine-epaule",
    routinePosition: "debut",
    signauxArret: [
      "Gêne épaule > 3/10 qui augmente pendant l'exercice",
      "Douleur qui irradie dans le bras",
      "Claquement douloureux → fin des poussées du jour, passage au cardio"
    ],
    exercices: [
      {
        id: "dev-incline",
        nom: "Développé incliné",
        mode: "reps",
        series: 4,
        repsMin: 8,
        repsMax: 10,
        rpe: "7",
        reposSec: 90,
        progression:
          "Haut de fourchette atteint sur toutes les séries au RPE cible → +2,5 kg ou cran suivant.",
        adaptations: "1re série toujours légère (calibrage).",
        variantes: [
          {
            id: "hs-incline",
            rang: 1,
            nom: "ISO-Lateral Incline Press",
            machine: "Hammer Strength ISO-Lateral Incline Press",
            contrainte: "faible",
            note: "Convergent, unilatéral : le côté droit ne peut pas être compensé par le gauche."
          },
          {
            id: "tg-incline",
            rang: 2,
            nom: "Incline Chest Press",
            machine: "Technogym Incline Chest Press (Selection)",
            contrainte: "faible",
            note: "Trajectoire guidée, réglage de siège précis."
          },
          {
            id: "halt-incline",
            rang: 3,
            nom: "Haltères prise neutre, banc 30°",
            materiel: "Haltères + banc inclinable",
            contrainte: "modérée",
            note: "Excellent stimulus mais stabilisation active de la coiffe."
          },
          {
            id: "barre-incline",
            rang: 99,
            interdit: true,
            nom: "Barre au banc incliné",
            contrainte: "élevée",
            note: "Prise fixe en rotation interne, amplitude imposée — pas ce bloc."
          }
        ]
      },
      {
        id: "dev-horizontal",
        nom: "Développé horizontal",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 10,
        rpe: "7",
        reposSec: 90,
        adaptations: "Ne pas descendre les coudes sous la ligne du buste.",
        variantes: [
          {
            id: "tg-chest",
            rang: 1,
            nom: "Chest Press (poignées neutres)",
            machine: "Technogym Chest Press",
            contrainte: "faible",
            note: "Le plus sûr : dossier réglable, pas de descente sous la ligne du buste."
          },
          {
            id: "hs-bench",
            rang: 2,
            nom: "ISO-Lateral Bench Press",
            machine: "Hammer Strength ISO-Lateral Bench Press",
            contrainte: "faible",
            note: "Unilatéral, convergent."
          },
          {
            id: "halt-plat",
            rang: 3,
            nom: "Haltères prise neutre, banc plat",
            materiel: "Haltères",
            contrainte: "modérée",
            note: "Coudes à 45°, pas sous la ligne du torse."
          },
          {
            id: "barre-couche",
            rang: 99,
            interdit: true,
            nom: "Développé couché barre",
            contrainte: "élevée",
            note: "Rotation interne + amplitude forcée en fin de descente."
          }
        ]
      },
      {
        id: "dev-epaules",
        nom: "Développé épaules (devant, prise neutre)",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 10,
        rpe: "7",
        reposSec: 90,
        adaptations:
          "Si gêne : remplacer par élévations latérales poulie + face pull supplémentaires.",
        variantes: [
          {
            id: "tg-shoulder",
            rang: 1,
            nom: "Shoulder Press (poignées neutres)",
            machine: "Technogym Shoulder Press",
            contrainte: "modérée",
            note: "Dossier haut, trajectoire devant le corps."
          },
          {
            id: "hs-shoulder",
            rang: 2,
            nom: "ISO-Lateral Shoulder Press",
            machine: "Hammer Strength ISO-Lateral Shoulder Press",
            contrainte: "modérée",
            note: "Unilatéral — charge moins lourde à droite possible."
          },
          {
            id: "halt-epaules",
            rang: 3,
            nom: "Haltères prise neutre, dossier 70°",
            materiel: "Haltères + banc",
            contrainte: "modérée",
            note: "Amplitude libre à contrôler."
          },
          {
            id: "militaire",
            rang: 99,
            interdit: true,
            nom: "Développé militaire barre / derrière la nuque",
            contrainte: "élevée",
            note: "Interdit du bloc."
          }
        ]
      },
      {
        id: "ecarte",
        nom: "Écarté",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "7–8",
        reposSec: 60,
        variantes: [
          {
            id: "tg-pec",
            rang: 1,
            nom: "Pectoral Machine (chest fly)",
            machine: "Technogym Pectoral Machine",
            contrainte: "faible",
            note: "Amplitude limitée par la machine, aucune contrainte en fin de course."
          },
          {
            id: "cable-fly",
            rang: 2,
            nom: "Écarté poulie hauteur poitrine",
            machine: "Cable Station",
            contrainte: "faible",
            note: "Tension constante, angle ajustable."
          },
          {
            id: "halt-fly",
            rang: 99,
            interdit: true,
            nom: "Écarté haltères banc plat",
            contrainte: "élevée",
            note: "Contrainte maximale en position basse — à éviter ce bloc."
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
        rpe: "8",
        reposSec: 45,
        variantes: [
          {
            id: "cable-lat",
            rang: 1,
            nom: "Poulie basse unilatérale",
            machine: "Cable Station",
            contrainte: "faible",
            note: "Tension constante, bras légèrement devant = zéro conflit sous-acromial."
          },
          {
            id: "tg-lat",
            rang: 2,
            nom: "Lateral Raise machine",
            machine: "Technogym Lateral Raise",
            contrainte: "faible",
            note: "Trajectoire guidée (si la salle l'a)."
          },
          {
            id: "halt-lat",
            rang: 3,
            nom: "Haltères",
            materiel: "Haltères",
            contrainte: "modérée",
            note: "Pas au-dessus de l'horizontale, pouce légèrement vers le haut."
          }
        ]
      },
      {
        id: "triceps-a",
        nom: "Triceps",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "8",
        reposSec: 45,
        variantes: [
          {
            id: "cable-pushdown",
            rang: 1,
            nom: "Pushdown (rope ou barre)",
            machine: "Cable Station + rope / straight bar",
            contrainte: "faible",
            note: "Coudes au corps, aucune contrainte d'épaule."
          },
          {
            id: "tg-armext",
            rang: 2,
            nom: "Arm Extension",
            machine: "Technogym Arm Extension",
            contrainte: "faible",
            note: "Guidé."
          },
          {
            id: "dips-assist",
            rang: 3,
            nom: "Assisted Dip",
            machine: "Technogym Chin/Dip Assist",
            contrainte: "modérée",
            note: "Ne pas descendre les épaules sous les coudes."
          },
          {
            id: "ext-nuque",
            rang: 99,
            interdit: true,
            nom: "Extension haltère derrière la nuque",
            contrainte: "élevée",
            note: "Interdit du bloc."
          }
        ]
      }
    ],
    cardio: { pente: "12,5 %", dureeMin: 30, note: "Marche 4,5 km/h après la muscu." }
  },

  // ======================= B — LEGS + PUISSANCE =======================
  {
    id: "B",
    lettre: "B",
    nom: "Legs + Puissance",
    dominante: "Quadriceps, détente, cheville",
    objectif:
      "Puissance/détente à froid en début de séance, force des jambes, protection de la cheville droite.",
    routineId: "routine-cheville",
    routinePosition: "fin",
    signauxArret: [
      "Douleur cheville ou genou pendant les sauts → sauts supprimés, le reste de la séance continue"
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
        progression: "S1–2 : 3×3 · S3–4 : 4×3. Volume bas volontairement — qualité avant tout.",
        variantes: [
          {
            id: "cmj-std",
            rang: 1,
            nom: "CMJ, intention maximale",
            contrainte: "aucune",
            note: "Frais, en tout début de séance."
          }
        ]
      },
      {
        id: "box-jump",
        nom: "Box jump 30–40 cm",
        mode: "reps",
        series: 3,
        repsMin: 3,
        repsMax: 3,
        rpe: "Qualité > hauteur",
        reposSec: 90,
        sansCharge: true,
        adaptations:
          "Cheville instable en réception → montée sur box sans saut + sauts sur place.",
        variantes: [
          {
            id: "box-std",
            rang: 1,
            nom: "Box jump, réception amortie",
            materiel: "Box 30–40 cm",
            contrainte: "aucune"
          },
          {
            id: "saut-longueur",
            rang: 2,
            nom: "Saut en longueur pieds joints",
            contrainte: "aucune"
          }
        ]
      },
      {
        id: "presse",
        nom: "Presse à cuisses",
        mode: "reps",
        series: 4,
        repsMin: 8,
        repsMax: 10,
        rpe: "7",
        reposSec: 120,
        variantes: [
          {
            id: "tg-legpress",
            rang: 1,
            nom: "Leg Press / Linear Leg Press",
            machine: "Technogym Leg Press ou Hammer Strength Linear Leg Press",
            contrainte: "aucune",
            note: "Charge lourde sans implication du haut du corps — imbattable dans ta situation."
          },
          {
            id: "hack",
            rang: 2,
            nom: "Hack Squat",
            machine: "Hack Squat",
            contrainte: "aucune",
            note: "Bonne amplitude, dos soutenu."
          },
          {
            id: "goblet",
            rang: 3,
            nom: "Goblet squat haltère",
            materiel: "Haltère",
            contrainte: "faible",
            note: "Charge limitée par le port de l'haltère."
          },
          {
            id: "back-squat",
            rang: 99,
            interdit: true,
            nom: "Back squat barre",
            contrainte: "élevée",
            note: "Le rack impose une rotation externe d'épaule sous charge — écarté du bloc."
          }
        ]
      },
      {
        id: "quad-uni",
        nom: "Quadriceps unilatéral",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "7–8",
        reposSec: 60,
        parCote: true,
        variantes: [
          {
            id: "tg-legext",
            rang: 1,
            nom: "Leg Extension",
            machine: "Technogym Leg Extension",
            contrainte: "aucune",
            note: "Isolation, zéro équilibre requis."
          },
          {
            id: "split-squat",
            rang: 2,
            nom: "Split squat / fentes haltères",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Travaille aussi la stabilité de la cheville droite."
          },
          {
            id: "step-up",
            rang: 3,
            nom: "Step-up sur box",
            materiel: "Box + haltères",
            contrainte: "faible",
            note: "Bon transfert volley."
          }
        ]
      },
      {
        id: "abduct",
        nom: "Abducteurs / fessiers",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "7",
        reposSec: 60,
        variantes: [
          {
            id: "tg-abductor",
            rang: 1,
            nom: "Abductor",
            machine: "Technogym Abductor",
            contrainte: "aucune",
            note: "Fessier moyen = stabilité du genou à la réception."
          },
          {
            id: "hs-glute",
            rang: 2,
            nom: "Glute Drive (hip thrust machine)",
            machine: "Hammer Strength Glute Drive",
            contrainte: "aucune",
            note: "Meilleur pour la puissance d'extension de hanche."
          },
          {
            id: "hip-barre",
            rang: 3,
            nom: "Hip thrust barre",
            materiel: "Barre + banc",
            contrainte: "faible",
            note: "Barre sur les hanches, pas d'implication épaule."
          }
        ]
      }
    ],
    cardio: { pente: "10 %", dureeMin: 25, note: "20–25 min, réduite après les jambes." }
  },

  // ============================ C — PULL ============================
  {
    id: "C",
    lettre: "C",
    nom: "Pull",
    dominante: "Dos, biceps lourd, grip",
    objectif:
      "Dos et biceps lourds · équilibrer les épaules (contrepoids indispensable au volley) · premier bloc de grip.",
    routineId: "routine-epaule",
    routinePosition: "debut",
    signauxArret: [
      "Douleur au coude interne (épitrochlée) → stop biceps et dead hang, réévaluation au check-in"
    ],
    exercices: [
      {
        id: "tirage-vertical",
        nom: "Tirage vertical prise neutre",
        mode: "reps",
        series: 4,
        repsMin: 8,
        repsMax: 10,
        rpe: "7",
        reposSec: 90,
        progression: "+2,5 kg quand 10 reps propres partout.",
        adaptations: "Si le grip lâche avant le dos : sangles (grip travaillé au dead hang).",
        variantes: [
          {
            id: "tg-vertical",
            rang: 1,
            nom: "Vertical Traction (poignées neutres)",
            machine: "Technogym Vertical Traction",
            contrainte: "faible",
            note: "Prise neutre et trajectoire convergente d'origine — exactement ce qu'il te faut."
          },
          {
            id: "hs-pulldown",
            rang: 2,
            nom: "ISO-Lateral Front Lat Pulldown (prise neutre)",
            machine: "Hammer Strength ISO-Lateral Front Lat Pulldown",
            contrainte: "faible",
            note: "Unilatéral, charge ajustable côté droit."
          },
          {
            id: "lat-triangle",
            rang: 3,
            nom: "Lat Machine + triangle neutre",
            machine: "Lat Machine (poulie haute)",
            contrainte: "faible",
            note: "Facile à trouver partout."
          },
          {
            id: "tirage-nuque",
            rang: 99,
            interdit: true,
            nom: "Tirage nuque",
            contrainte: "élevée",
            note: "Tout tirage derrière la tête est interdit du bloc."
          }
        ]
      },
      {
        id: "rowing",
        nom: "Rowing horizontal",
        mode: "reps",
        series: 4,
        repsMin: 10,
        repsMax: 10,
        rpe: "7",
        reposSec: 90,
        variantes: [
          {
            id: "hs-row",
            rang: 1,
            nom: "ISO-Lateral Low Row / Row (appui poitrine)",
            machine: "Hammer Strength ISO-Lateral Low Row",
            contrainte: "faible",
            note: "Appui pectoral = zéro charge lombaire, prise neutre, unilatéral."
          },
          {
            id: "tg-lowrow",
            rang: 2,
            nom: "Low Row",
            machine: "Technogym Low Row",
            contrainte: "faible",
            note: "Guidé, dossier réglable."
          },
          {
            id: "row-haltere",
            rang: 3,
            nom: "Rowing haltère unilatéral (appui banc)",
            materiel: "Haltère + banc",
            contrainte: "faible",
            note: "Bon si tu contrôles le buste."
          },
          {
            id: "row-cable",
            rang: 4,
            nom: "Rowing poulie basse triangle",
            machine: "Cable Station",
            contrainte: "faible",
            note: "Alternative si machines prises."
          }
        ]
      },
      {
        id: "pullover",
        nom: "Pull-over bras tendus",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "7",
        reposSec: 60,
        variantes: [
          {
            id: "cable-pullover",
            rang: 1,
            nom: "Pull-over poulie haute (corde, bras semi-tendus)",
            machine: "Cable Station",
            contrainte: "faible",
            note: "Tension constante, amplitude contrôlée."
          },
          {
            id: "tg-pullover",
            rang: 2,
            nom: "Pullover machine",
            machine: "Technogym Pullover",
            contrainte: "faible",
            note: "Guidé (si dispo)."
          },
          {
            id: "halt-pullover",
            rang: 99,
            interdit: true,
            nom: "Pull-over haltère sur banc",
            contrainte: "élevée",
            note: "Élévation maximale sous charge — à éviter ce bloc."
          }
        ]
      },
      {
        id: "arriere-epaule",
        nom: "Arrière d'épaule",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "7",
        reposSec: 45,
        variantes: [
          {
            id: "reverse-fly",
            rang: 1,
            nom: "Reverse fly machine",
            machine: "Technogym Pectoral Machine (mode reverse) / Rear Delt",
            contrainte: "faible",
            note: "Le meilleur ratio bénéfice/risque de tout le programme pour toi."
          },
          {
            id: "face-pull-haut",
            rang: 2,
            nom: "Face pull haut",
            machine: "Cable Station",
            contrainte: "faible",
            note: "Complète la routine A."
          },
          {
            id: "oiseau",
            rang: 3,
            nom: "Oiseau haltères buste penché",
            materiel: "Haltères",
            contrainte: "modérée",
            note: "Contrôle strict, charges légères."
          }
        ]
      },
      {
        id: "curl-lourd",
        nom: "Curl (biceps lourd)",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 10,
        rpe: "8",
        reposSec: 60,
        variantes: [
          {
            id: "curl-ez",
            rang: 1,
            nom: "Curl barre EZ",
            materiel: "Barre EZ",
            contrainte: "faible",
            note: "Poignets ménagés, charge la plus lourde possible sur le biceps."
          },
          {
            id: "curl-halt",
            rang: 2,
            nom: "Curl haltères (supination)",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Amplitude complète."
          },
          {
            id: "tg-armcurl",
            rang: 3,
            nom: "Arm Curl machine",
            machine: "Technogym Arm Curl",
            contrainte: "faible",
            note: "Si les poignets ou coudes tirent."
          }
        ]
      },
      {
        id: "dead-hang",
        nom: "Dead hang (suspension barre)",
        mode: "duree",
        series: 3,
        dureeCibleSec: 40,
        rpe: "Max, viser 30–45 s",
        reposSec: 90,
        sansCharge: true,
        progression: "+5 s par semaine.",
        variantes: [
          {
            id: "hang-barre",
            rang: 1,
            nom: "Barre, prise pleine main (open hand)",
            materiel: "Barre de traction, grosses barres",
            contrainte: "faible",
            note: "Épaules légèrement engagées, jamais relâchées passivement. Base du grip escalade."
          },
          {
            id: "farmer-c",
            rang: 2,
            nom: "Farmer hold haltères lourds",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Si la barre irrite les épaules. 3×30 s."
          },
          {
            id: "pinch-c",
            rang: 3,
            nom: "Pinch plate hold (2 disques pincés)",
            materiel: "Disques",
            contrainte: "faible",
            note: "Variante pouce. 3×20 s."
          }
        ]
      }
    ],
    cardio: { pente: "12,5 %", dureeMin: 30 }
  },

  // ================== D — BRAS, AVANT-BRAS & GRIP ==================
  {
    id: "D",
    lettre: "D",
    nom: "Bras, avant-bras & grip",
    dominante: "Biceps, brachial, avant-bras — prépa escalade",
    objectif:
      "Développer biceps/brachial et surtout les avant-bras et le grip (facteur limitant en escalade dès septembre) · volume santé d'épaule · faible coût de récupération. AUCUN travail sur poutre, réglettes ou campus board avant 1 an de pratique : les tendons des doigts s'adaptent sur 12–24 mois.",
    routineId: "routine-epaule",
    routinePosition: "debut",
    signauxArret: [
      "Douleur au coude (interne ou externe) ou au poignet → stop l'exo concerné, garder uniquement les extenseurs élastiques en léger",
      "Cette séance ne doit jamais laisser de fortes courbatures — c'est du volume, pas de l'intensité"
    ],
    exercices: [
      {
        id: "hammer-curl",
        nom: "Hammer curl",
        mode: "reps",
        series: 4,
        repsMin: 10,
        repsMax: 12,
        rpe: "8",
        reposSec: 60,
        superset: "Superset 1",
        progression: "+1 rep/semaine avant d'ajouter de la charge.",
        variantes: [
          {
            id: "hammer-halt",
            rang: 1,
            nom: "Haltères, prise marteau",
            materiel: "Haltères",
            contrainte: "faible",
            note: "L'exo bras au meilleur transfert escalade : le brachioradial te tiendra en voie."
          },
          {
            id: "hammer-cable",
            rang: 2,
            nom: "Curl marteau poulie + rope",
            machine: "Cable Station + rope",
            contrainte: "faible",
            note: "Tension constante."
          },
          {
            id: "hammer-croise",
            rang: 3,
            nom: "Curl marteau croisé",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Vers l'épaule opposée."
          }
        ]
      },
      {
        id: "pushdown-d",
        nom: "Triceps pushdown",
        mode: "reps",
        series: 4,
        repsMin: 12,
        repsMax: 15,
        rpe: "8",
        reposSec: 60,
        superset: "Superset 1",
        variantes: [
          {
            id: "pushdown-rope",
            rang: 1,
            nom: "Pushdown rope",
            machine: "Cable Station + rope",
            contrainte: "faible"
          },
          {
            id: "tg-armext-d",
            rang: 2,
            nom: "Arm Extension",
            machine: "Technogym Arm Extension",
            contrainte: "faible"
          }
        ]
      },
      {
        id: "curl-etirement",
        nom: "Curl en étirement (chef long)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "8",
        reposSec: 60,
        superset: "Superset 2",
        variantes: [
          {
            id: "curl-incline",
            rang: 1,
            nom: "Curl incliné haltères (banc 45–60°)",
            materiel: "Haltères + banc",
            contrainte: "faible",
            note: "Chef long en position étirée = meilleur stimulus hypertrophie."
          },
          {
            id: "curl-poulie-basse",
            rang: 2,
            nom: "Curl poulie basse, corps devant",
            machine: "Cable Station",
            contrainte: "faible",
            note: "Plus doux pour le coude."
          },
          {
            id: "tg-armcurl-d",
            rang: 3,
            nom: "Arm Curl machine",
            machine: "Technogym Arm Curl",
            contrainte: "faible"
          }
        ]
      },
      {
        id: "reverse-curl",
        nom: "Reverse curl (extenseurs)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "8",
        reposSec: 60,
        superset: "Superset 2",
        variantes: [
          {
            id: "reverse-ez",
            rang: 1,
            nom: "Barre EZ prise pronation",
            materiel: "Barre EZ",
            contrainte: "faible",
            note: "La faiblesse des extenseurs cause les tendinites du coude chez les grimpeurs."
          },
          {
            id: "reverse-cable",
            rang: 2,
            nom: "Barre droite poulie, pronation",
            machine: "Cable Station",
            contrainte: "faible"
          }
        ]
      },
      {
        id: "wrist-curl",
        nom: "Wrist curl (flexion poignet)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "8",
        reposSec: 45,
        superset: "Superset 3",
        variantes: [
          {
            id: "wrist-halt",
            rang: 1,
            nom: "Haltères, avant-bras posés",
            materiel: "Haltères + banc",
            contrainte: "faible",
            note: "Le plus simple, très efficace."
          },
          {
            id: "wrist-ez",
            rang: 2,
            nom: "Barre EZ, avant-bras posés",
            materiel: "Barre EZ",
            contrainte: "faible",
            note: "Charge plus lourde."
          },
          {
            id: "wrist-roller",
            rang: 3,
            nom: "Wrist roller",
            materiel: "Rouleau + corde + disque",
            contrainte: "faible",
            note: "Le plus complet pour l'endurance d'avant-bras (si la salle en a)."
          }
        ]
      },
      {
        id: "reverse-wrist-curl",
        nom: "Reverse wrist curl (extension poignet)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "7",
        reposSec: 45,
        superset: "Superset 3",
        variantes: [
          {
            id: "rwrist-halt",
            rang: 1,
            nom: "Haltères, avant-bras posés",
            materiel: "Haltères + banc",
            contrainte: "faible"
          }
        ]
      },
      {
        id: "elev-lat-d",
        nom: "Élévations latérales",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "8",
        reposSec: 45,
        superset: "Superset 4",
        variantes: [
          {
            id: "cable-lat-d",
            rang: 1,
            nom: "Poulie basse unilatérale",
            machine: "Cable Station",
            contrainte: "faible"
          },
          {
            id: "halt-lat-d",
            rang: 2,
            nom: "Haltères",
            materiel: "Haltères",
            contrainte: "modérée",
            note: "Pas au-dessus de l'horizontale."
          }
        ]
      },
      {
        id: "extenseurs-doigts",
        nom: "Extenseurs de doigts (élastique)",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Léger",
        reposSec: 45,
        superset: "Superset 4",
        sansCharge: true,
        variantes: [
          {
            id: "elastique-doigts",
            rang: 1,
            nom: "Élastique à doigts (ouverture contre résistance)",
            materiel: "Élastique à doigts (~2 €) ou gros élastique",
            contrainte: "aucune",
            note: "Prévention n°1 de l'épitrochléite du grimpeur. À faire aussi devant la télé."
          }
        ]
      },
      {
        id: "grip-long",
        nom: "Grip long",
        mode: "duree",
        series: 3,
        dureeCibleSec: 40,
        rpe: "Lourd, contrôlé — 30–45 s",
        reposSec: 60,
        progression: "+5 s par semaine.",
        variantes: [
          {
            id: "farmer-d",
            rang: 1,
            nom: "Farmer hold haltères lourds",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Grip d'endurance + trapèzes."
          },
          {
            id: "hang-d",
            rang: 2,
            nom: "Dead hang barre, prise pleine main",
            materiel: "Barre de traction",
            contrainte: "faible",
            note: "Le plus spécifique escalade."
          },
          {
            id: "pinch-d",
            rang: 3,
            nom: "Pinch plate hold",
            materiel: "Disques",
            contrainte: "faible",
            note: "Force du pouce."
          }
        ]
      }
    ],
    cardio: { pente: "12,5 %", dureeMin: 30 }
  },

  // =================== E — LEGS POSTÉRIEUR + CORE ===================
  {
    id: "E",
    lettre: "E",
    nom: "Legs postérieur + Core",
    dominante: "Ischios, fessiers, mollets, gainage",
    objectif:
      "Chaîne postérieure (sous-développée chez la plupart des volleyeurs, protectrice pour genoux et dos) + gainage.",
    routineId: "routine-cheville",
    routinePosition: "fin",
    signauxArret: [
      "Douleur lombaire pendant le RDL → stop immédiat, passage au leg curl"
    ],
    exercices: [
      {
        id: "rdl",
        nom: "Soulevé de terre roumain (RDL)",
        mode: "reps",
        series: 4,
        repsMin: 10,
        repsMax: 10,
        rpe: "7",
        reposSec: 120,
        progression:
          "Dos plat et étirement des ischios avant d'ajouter du poids. +2,5 kg/sem max.",
        adaptations:
          "Lombaires sensibles → haltères légers ou Smith. Pas de RDL le lendemain d'une séance B.",
        variantes: [
          {
            id: "rdl-halt",
            rang: 1,
            nom: "Haltères lourds, bras le long du corps",
            materiel: "Haltères",
            contrainte: "faible",
            note: "Prise neutre, aucune rotation d'épaule."
          },
          {
            id: "rdl-barre",
            rang: 2,
            nom: "Barre (RDL classique)",
            materiel: "Barre",
            contrainte: "faible",
            note: "Prise pronation mais bras tendus = peu de contrainte."
          },
          {
            id: "rdl-smith",
            rang: 3,
            nom: "Multipower (Smith)",
            machine: "Technogym Multipower",
            contrainte: "faible",
            note: "Trajectoire fixe si lombaires sensibles."
          }
        ]
      },
      {
        id: "leg-curl",
        nom: "Leg curl",
        mode: "reps",
        series: 4,
        repsMin: 10,
        repsMax: 12,
        rpe: "7–8",
        reposSec: 90,
        variantes: [
          {
            id: "tg-legcurl",
            rang: 1,
            nom: "Leg Curl (assis)",
            machine: "Technogym Leg Curl",
            contrainte: "aucune",
            note: "Position assise = meilleure tension sur les ischios."
          },
          {
            id: "prone-curl",
            rang: 2,
            nom: "Prone / Seated Leg Curl",
            machine: "Technogym Prone Leg Curl ou Hammer Strength Seated Leg Curl",
            contrainte: "aucune"
          },
          {
            id: "nordic",
            rang: 3,
            nom: "Nordic curl assisté",
            contrainte: "aucune",
            note: "Excentrique, très efficace mais dur."
          }
        ]
      },
      {
        id: "hip-thrust",
        nom: "Hip thrust / pont fessier",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "7",
        reposSec: 90,
        variantes: [
          {
            id: "hs-glute-e",
            rang: 1,
            nom: "Glute Drive",
            machine: "Hammer Strength Glute Drive",
            contrainte: "aucune",
            note: "Mise en place immédiate, charge lourde possible."
          },
          {
            id: "hip-barre-e",
            rang: 2,
            nom: "Hip thrust barre sur banc",
            materiel: "Barre + banc",
            contrainte: "faible"
          },
          {
            id: "pont-halt",
            rang: 3,
            nom: "Pont fessier haltère",
            materiel: "Haltère",
            contrainte: "aucune",
            note: "Version simple."
          }
        ]
      },
      {
        id: "fentes",
        nom: "Fentes ou step-up",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 10,
        rpe: "7",
        reposSec: 60,
        parCote: true,
        variantes: [
          {
            id: "fentes-halt",
            rang: 1,
            nom: "Fentes haltères",
            materiel: "Haltères",
            contrainte: "faible"
          },
          {
            id: "stepup-e",
            rang: 2,
            nom: "Step-up sur box",
            materiel: "Box + haltères",
            contrainte: "faible"
          }
        ]
      },
      {
        id: "mollets",
        nom: "Mollets debout",
        mode: "reps",
        series: 4,
        repsMin: 15,
        repsMax: 15,
        rpe: "8",
        reposSec: 45,
        variantes: [
          {
            id: "tg-calf",
            rang: 1,
            nom: "Standing Calf Raise",
            machine: "Technogym Standing Calf Raise",
            contrainte: "aucune",
            note: "Debout = gastrocnémien, transfert direct détente."
          },
          {
            id: "calf-presse",
            rang: 2,
            nom: "Presse à cuisses en pointe de pied",
            machine: "Leg Press",
            contrainte: "aucune"
          },
          {
            id: "calf-halt",
            rang: 3,
            nom: "Mollets haltère unilatéral",
            materiel: "Haltère + marche",
            contrainte: "faible",
            note: "Utile pour rééquilibrer le côté droit."
          }
        ]
      },
      {
        id: "gainage",
        nom: "Gainage : planche + planche latérale",
        mode: "duree",
        series: 3,
        dureeCibleSec: 40,
        rpe: "40 s + 30 s/côté",
        reposSec: 45,
        sansCharge: true,
        progression: "+5 s de gainage par semaine.",
        variantes: [
          {
            id: "planche",
            rang: 1,
            nom: "Planche (40 s) puis planche latérale (30 s/côté)",
            contrainte: "aucune"
          }
        ]
      },
      {
        id: "pallof",
        nom: "Pallof press (anti-rotation)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "7",
        reposSec: 45,
        parCote: true,
        variantes: [
          {
            id: "pallof-cable",
            rang: 1,
            nom: "Cable Station hauteur poitrine",
            machine: "Cable Station",
            contrainte: "faible",
            note: "L'anti-rotation est le gainage le plus utile au volley."
          },
          {
            id: "pallof-elastique",
            rang: 2,
            nom: "Élastique fixé",
            materiel: "Élastique",
            contrainte: "faible"
          }
        ]
      }
    ],
    cardio: { pente: "10 %", dureeMin: 25, note: "20–25 min, réduite après les jambes." }
  }
];

export const TESTS: TestDef[] = [
  {
    id: "test-presse",
    nom: "Presse à cuisses",
    protocole: "Charge fixe, max de reps propres (RPE 9)",
    unite: "reps",
    chargeFixe: true
  },
  {
    id: "test-tirage",
    nom: "Tirage vertical prise neutre",
    protocole: "Charge fixe, max de reps (RPE 9)",
    unite: "reps",
    chargeFixe: true
  },
  {
    id: "test-developpe",
    nom: "Développé machine",
    protocole: "Charge fixe, max de reps (RPE 9)",
    unite: "reps",
    chargeFixe: true
  },
  {
    id: "test-deadhang",
    nom: "Dead hang",
    protocole: "Temps max, prise pleine main",
    unite: "sec",
    chargeFixe: false
  },
  {
    id: "test-farmer",
    nom: "Farmer hold",
    protocole: "Temps max, charge fixe",
    unite: "sec",
    chargeFixe: true
  },
  {
    id: "test-cmj",
    nom: "CMJ (saut vertical)",
    protocole: "Meilleur de 3 sauts, marque au mur",
    unite: "cm",
    chargeFixe: false
  }
];

export const ORDRE_SUGGESTION: ReadonlyArray<string> = ["A", "B", "C", "D", "E"];

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
