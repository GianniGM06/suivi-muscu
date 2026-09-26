// ============================================================
// Programme v5 — 3 séances + 1 optionnelle (révisé le 26 septembre 2026)
// 1 Haut du corps (poussée + tirage, focus coiffe) · 2 Bras & avant-bras
// 3 Jambes volley (explosivité) · + Optionnelle (2e passage haut du corps)
// Double progression : charge fixe, haut de fourchette atteint
// sur toutes les séries → +2,5 kg.
// Cardio : HORS salle (40 min de marche par jour).
// IMPORTANT : ne jamais renommer un id d'exercice existant
// (les charges de référence y sont rattachées).
// Les séances de l'ancien programme (A Push, C Pull, E) restent dans
// SEANCES_ARCHIVE : l'historique et les charges continuent de s'afficher.
// ============================================================

import type { Mode, Routine, Seance, TestDef } from "../types";

export const INTERDITS_BLOC = [
  "Tout mouvement derrière la nuque (épaule droite non rééduquée)",
  "Dips (contrainte maximale sur l'avant de l'épaule)",
  "Back squat barre / développé militaire barre (rotation d'épaule sous charge)",
  "Écarté haltères et pull-over haltère (contrainte max en position étirée)",
  "Poutre, réglettes, campus board (tendons des doigts : pas avant 1 an de grimpe)"
];

export const ROUTINES: Routine[] = [
  {
    id: "routine-epaule",
    nom: "Routine épaule (courte)",
    quand: "Ancien programme — avant les séances A et C (~4 min)",
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
  },
  {
    id: "routine-haut",
    nom: "Échauffement haut du corps",
    quand: "Début de la séance 1 — Haut du corps (~8 min)",
    items: [
      {
        id: "cardio-h",
        nom: "Cardio facile",
        detail: "3 min — rameur si possible, sinon vélo.",
        mode: "duree",
        dureeSec: 180
      },
      {
        id: "dislocations-h",
        nom: "Dislocations d'épaule à l'élastique",
        detail: "2×12 — bras tendus, amplitude confortable.",
        mode: "reps"
      },
      {
        id: "rot-ext-h",
        nom: "Rotation externe élastique, coude au corps",
        detail: "2×15 — serviette roulée sous le coude. 2 s aller, 3 s retour.",
        mode: "reps"
      },
      {
        id: "tirage-scapulaire",
        nom: "Tirage scapulaire",
        detail:
          "2×10 — tirage vertical très léger, bras tendus : tu descends seulement les épaules, sans plier les coudes. Apprend à engager le dos avant de tirer.",
        mode: "reps"
      }
    ]
  },
  {
    id: "routine-jambes",
    nom: "Échauffement jambes & cheville",
    quand: "Début de la séance 3 — Jambes volley (~10 min)",
    items: [
      {
        id: "cardio-j",
        nom: "Vélo ou tapis",
        detail: "5 min facile, juste pour chauffer.",
        mode: "duree",
        dureeSec: 300
      },
      {
        id: "balanciers",
        nom: "Balanciers de jambe avant/arrière + latéraux",
        detail: "10 par côté — amplitude progressive.",
        mode: "reps"
      },
      {
        id: "fentes-rotation",
        nom: "Fentes marchées avec rotation du buste",
        detail: "2×6 par jambe — ouvre hanches et chevilles.",
        mode: "reps"
      },
      {
        id: "equilibre-j",
        nom: "Équilibre unipodal, jambe droite",
        detail: "2×30 s — yeux fermés quand c'est facile.",
        mode: "duree",
        dureeSec: 30
      },
      {
        id: "sautillements-j",
        nom: "Sautillements bas sur place puis latéraux",
        detail: "2×20 s — rebond court, chevilles toniques.",
        mode: "duree",
        dureeSec: 20
      },
      {
        id: "sauts-progressifs",
        nom: "Sauts progressifs",
        detail: "3 sauts à 50 %, 70 % puis 90 % — prépare le bloc explosif.",
        mode: "reps"
      }
    ]
  },
  {
    id: "routine-optionnelle",
    nom: "Échauffement épaules",
    quand: "Début de la séance optionnelle (~6 min)",
    items: [
      {
        id: "cardio-o",
        nom: "Cardio facile",
        detail: "3 min.",
        mode: "duree",
        dureeSec: 180
      },
      {
        id: "dislocations-o",
        nom: "Dislocations d'épaule à l'élastique",
        detail: "2×12.",
        mode: "reps"
      },
      {
        id: "rot-ext-o",
        nom: "Rotation externe élastique, coude au corps",
        detail: "2×15.",
        mode: "reps"
      }
    ]
  }
];

export const SEANCES_SALLE: Seance[] = [
  // ============== 1 — HAUT DU CORPS (poussée + tirage, focus coiffe) ==============
  {
    id: "H",
    lettre: "1",
    nom: "Haut du corps",
    dominante: "Dos, pectoraux, épaules, coiffe · ~55 min",
    objectif:
      "Poussée et tirage dans la même séance, focus coiffe. 11 séries de tirage pour 6 de poussée : le ratio 2:1 protège l'épaule. Double progression : charge FIXE sur les 3 séries, haut de fourchette atteint partout → +2,5 kg la fois suivante. Développés : jamais plus lourd que 8-10 reps.",
    routineId: "routine-haut",
    routinePosition: "debut",
    signauxArret: [
      "Gêne épaule > 3/10 qui augmente pendant l'exercice → variante suivante",
      "Douleur qui irradie dans le bras → fin des poussées du jour",
      "Toujours interdits : tout mouvement derrière la nuque, dips"
    ],
    exercices: [
      {
        id: "pullover-activation",
        nom: "Pull-over poulie bras tendus (activation dos)",
        mode: "reps",
        series: 2,
        repsMin: 12,
        repsMax: 12,
        rpe: "3 reps en réserve — léger (~10 kg)",
        reposSec: 60,
        adaptations:
          "Sert à « allumer » le grand dorsal avant le tirage : il travaille sans les biceps. Pense à ramener la barre vers les cuisses, bras tendus, épaules basses.",
        variantes: [
          {
            id: "cable-pullover-act",
            rang: 1,
            nom: "Poulie haute, corde ou barre droite",
            machine: "Cable Station",
            contrainte: "faible"
          },
          { id: "pullover-elastique", rang: 2, nom: "Élastique fixé en hauteur", materiel: "Élastique", contrainte: "faible" },
          { id: "halt-pullover-act", rang: 99, interdit: true, nom: "Pull-over haltère sur banc", contrainte: "élevée" }
        ]
      },
      {
        id: "tirage-vertical",
        nom: "Tirage vertical prise neutre",
        mode: "reps",
        series: 3,
        repsMin: 6,
        repsMax: 8,
        rpe: "2 reps en réserve — charge FIXE 45 kg sur les 3 séries",
        reposSec: 120,
        progression: "3×8 propres → +2,5 kg.",
        adaptations:
          "Descends les épaules AVANT de plier les coudes, puis coudes vers les hanches, poitrine vers les poignées, pause 1 s en bas. Épaules qui montent vers les oreilles = trop lourd.",
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
            contrainte: "faible",
            note: "Faisable un bras à la fois : le plus simple pour sentir le dos."
          },
          {
            id: "poulie-haute-uni",
            rang: 3,
            nom: "Poulie haute unilatérale, à genoux",
            machine: "Cable Station",
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
        id: "dev-incline",
        nom: "Développé incliné",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "2-3 reps en réserve — passe à 12,5 kg",
        reposSec: 120,
        progression: "3×10 propres → +2,5 kg et retour à 8.",
        adaptations: "Omoplates serrées et basses contre le dossier.",
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
        id: "rowing",
        nom: "Rowing appui poitrine",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "2 reps en réserve — passe à 42,5 kg",
        reposSec: 90,
        progression: "3×10 propres → +2,5 kg.",
        adaptations: "Coudes vers les hanches, omoplates serrées 1 s en fin de mouvement.",
        variantes: [
          {
            id: "hs-row",
            rang: 1,
            nom: "ISO-Lateral Low Row (appui poitrine)",
            machine: "Hammer Strength ISO-Lateral Low Row",
            contrainte: "faible"
          },
          { id: "tg-lowrow", rang: 2, nom: "Low Row", machine: "Technogym Low Row", contrainte: "faible" },
          { id: "row-cable", rang: 3, nom: "Rowing poulie basse triangle", machine: "Cable Station", contrainte: "faible" },
          { id: "row-halt-uni", rang: 4, nom: "Rowing haltère unilatéral, appui banc", materiel: "Haltère + banc", contrainte: "faible" }
        ]
      },
      {
        id: "dev-epaules",
        nom: "Développé épaules (devant, prise neutre)",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 10,
        rpe: "2-3 reps en réserve — garde 15 kg sur les 3 séries",
        reposSec: 90,
        progression: "3×10 propres → +2,5 kg.",
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
            id: "halt-shoulder-neutre",
            rang: 3,
            nom: "Haltères assis, prise neutre",
            materiel: "Haltères + banc",
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
        id: "face-pull-h",
        nom: "Face pull à la corde (remplace l'oiseau)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "2 reps en réserve",
        reposSec: 60,
        adaptations:
          "Tire vers le front, coudes hauts, et termine en ouvrant les mains vers l'arrière : arrière d'épaule + coiffe en un seul mouvement.",
        variantes: [
          { id: "face-pull-corde", rang: 1, nom: "Poulie hauteur visage + corde", machine: "Cable Station + rope", contrainte: "faible" },
          { id: "face-pull-elastique", rang: 2, nom: "Élastique fixé à hauteur de visage", materiel: "Élastique", contrainte: "faible" }
        ]
      },
      {
        id: "elev-lat-a",
        nom: "Élévations latérales",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        progression: "3×15 propres → cran suivant.",
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
        id: "rotation-ext-a",
        nom: "Rotation externe, coude au corps (prévention)",
        mode: "reps",
        series: 2,
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

  // ============== 2 — BRAS, AVANT-BRAS & GRIP (inchangée) ==============
  {
    id: "D",
    lettre: "2",
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

  // ==================== 3 — JAMBES VOLLEY (explosivité) ====================
  {
    id: "B",
    lettre: "3",
    nom: "Jambes volley",
    dominante: "Détente, appuis, force des jambes, cheville · ~55 min",
    objectif:
      "Explosivité d'abord, à frais, puis force. Sauts : qualité avant quantité, réceptions silencieuses, genoux dans l'axe des pieds. Jamais à l'échec sur le bloc force : le volley doit rester frais. Pas de jambes dans les 48 h avant le volley.",
    routineId: "routine-jambes",
    routinePosition: "debut",
    signauxArret: [
      "Douleur cheville ou genou à la réception → sauts supprimés, bloc force seulement",
      "Hauteur de saut qui baisse → fin de la série",
      "Douleur aiguë → on remplace l'exercice, pas la séance"
    ],
    exercices: [
      {
        id: "cmj",
        nom: "Saut vertical contre-mouvement (bras actifs)",
        mode: "reps",
        series: 4,
        repsMin: 3,
        repsMax: 3,
        rpe: "Intention maximale, jamais à l'échec",
        reposSec: 90,
        sansCharge: true,
        adaptations: "Chaque saut aussi haut que le premier, sinon fin de la série.",
        variantes: [
          { id: "cmj-std", rang: 1, nom: "CMJ, intention maximale", contrainte: "aucune" },
          { id: "cmj-box", rang: 2, nom: "Box jump 40-50 cm (moins d'impact à la réception)", materiel: "Box", contrainte: "aucune" }
        ]
      },
      {
        id: "saut-elan",
        nom: "Saut avec élan (approche 2-3 pas)",
        mode: "reps",
        series: 3,
        repsMin: 3,
        repsMax: 3,
        rpe: "Intention maximale",
        reposSec: 90,
        sansCharge: true,
        adaptations: "Approche type attaque, bras qui montent fort. Repos complet entre les sauts.",
        variantes: [
          { id: "elan-std", rang: 1, nom: "Approche 2-3 pas + saut maximal", contrainte: "aucune" },
          { id: "elan-box", rang: 2, nom: "Box jump avec 1 pas d'élan", materiel: "Box", contrainte: "aucune" }
        ]
      },
      {
        id: "bonds-lateraux",
        nom: "Bonds latéraux, réception tenue 2 s",
        mode: "reps",
        series: 3,
        repsMin: 4,
        repsMax: 4,
        rpe: "Rapide et contrôlé",
        reposSec: 60,
        sansCharge: true,
        parCote: true,
        adaptations: "Changements de direction + stabilité de la cheville droite.",
        variantes: [
          { id: "bonds-std", rang: 1, nom: "Bond latéral sur une jambe, réception stabilisée", contrainte: "faible" },
          { id: "pas-chasses", rang: 2, nom: "Pas chassés rapides + arrêt net", contrainte: "aucune" }
        ]
      },
      {
        id: "presse",
        nom: "Presse à cuisses",
        mode: "reps",
        series: 4,
        repsMin: 6,
        repsMax: 8,
        rpe: "2-3 reps en réserve",
        reposSec: 120,
        progression: "4×8 propres → +5-10 kg (les paliers de presse sont larges).",
        adaptations: "1re série prudente pour calibrer la charge.",
        variantes: [
          {
            id: "tg-legpress",
            rang: 1,
            nom: "Leg Press / Linear Leg Press",
            machine: "Technogym Leg Press ou Hammer Strength Linear Leg Press",
            contrainte: "aucune"
          },
          { id: "hack", rang: 2, nom: "Hack Squat", machine: "Hack Squat", contrainte: "aucune" },
          { id: "goblet", rang: 3, nom: "Goblet squat haltère", materiel: "Haltère", contrainte: "faible" },
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
        id: "fente-bulgare",
        nom: "Fente bulgare",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 8,
        rpe: "2-3 reps en réserve",
        reposSec: 90,
        parCote: true,
        progression: "3×8 propres par jambe → haltères suivants.",
        variantes: [
          { id: "bulgare-halt", rang: 1, nom: "Fente bulgare haltères, pied arrière sur banc", materiel: "Haltères + banc", contrainte: "faible" },
          { id: "fente-arriere-halt", rang: 2, nom: "Fente arrière haltères", materiel: "Haltères", contrainte: "faible" },
          { id: "split-squat-sol", rang: 3, nom: "Split squat sans surélévation", materiel: "Haltères", contrainte: "faible" }
        ]
      },
      {
        id: "leg-curl",
        nom: "Leg curl assis",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "2 reps en réserve",
        reposSec: 75,
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
          },
          { id: "rdl-halt-leger", rang: 3, nom: "Soulevé de terre jambes tendues haltères (léger)", materiel: "Haltères", contrainte: "faible" }
        ]
      },
      {
        id: "mollets",
        nom: "Mollets debout (pause 1 s en haut)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
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

  // ============== + — OPTIONNELLE : 2e PASSAGE HAUT DU CORPS ==============
  {
    id: "O",
    lettre: "+",
    nom: "Optionnelle — complément",
    dominante: "2e passage pecs/dos/épaules, gainage, lombaires · ~45 min",
    objectif:
      "Seulement si tu as la motivation : elle fait passer pectoraux, dos et épaules à 2 fois par semaine. Elle ne doit JAMAIS fatiguer pour les autres séances : 3 reps en réserve, jamais d'échec. Au moins 48 h après la séance Haut du corps. Finir par 30 s d'étirements pectoraux et dorsaux.",
    routineId: "routine-optionnelle",
    routinePosition: "debut",
    signauxArret: [
      "Gêne épaule > 3/10 qui augmente → variante suivante",
      "Douleur lombaire sur l'extension → réduire l'amplitude, poids du corps"
    ],
    exercices: [
      {
        id: "chest-press-o",
        nom: "Chest press horizontale",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "3 reps en réserve",
        reposSec: 90,
        variantes: [
          { id: "tg-chestpress", rang: 1, nom: "Chest Press", machine: "Technogym Chest Press", contrainte: "faible" },
          { id: "hs-bench", rang: 2, nom: "ISO-Lateral Bench Press", machine: "Hammer Strength ISO-Lateral Bench Press", contrainte: "faible" },
          { id: "halt-plat-neutre", rang: 3, nom: "Haltères prise neutre, banc plat", materiel: "Haltères + banc", contrainte: "modérée" }
        ]
      },
      {
        id: "tirage-uni-o",
        nom: "Tirage poulie haute unilatéral",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 12,
        rpe: "3 reps en réserve",
        reposSec: 60,
        parCote: true,
        adaptations: "Entraînement technique : sur un seul bras, on sent beaucoup mieux le dos. Épaule basse, coude vers la hanche.",
        variantes: [
          { id: "poulie-haute-uni-o", rang: 1, nom: "Poulie haute, poignée simple", machine: "Cable Station", contrainte: "faible" },
          { id: "hs-pulldown-uni", rang: 2, nom: "ISO-Lateral Front Lat Pulldown, un bras", machine: "Hammer Strength ISO-Lateral Front Lat Pulldown", contrainte: "faible" }
        ]
      },
      {
        id: "ecarte",
        nom: "Écarté",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "2 reps en réserve — repars à 7,5 kg",
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
        id: "rowing-large-o",
        nom: "Rowing prise large (haut du dos)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "3 reps en réserve",
        reposSec: 60,
        adaptations: "Coudes à 45° du buste, tire vers le bas de la poitrine.",
        variantes: [
          { id: "row-cable-large", rang: 1, nom: "Poulie basse, barre large", machine: "Cable Station", contrainte: "faible" },
          { id: "tg-lowrow-large", rang: 2, nom: "Low Row, prise large", machine: "Technogym Low Row", contrainte: "faible" }
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
            contrainte: "aucune"
          },
          { id: "pont-fessier-sol", rang: 2, nom: "Pont fessier au sol", contrainte: "aucune" }
        ]
      },
      {
        id: "pallof",
        nom: "Pallof press (anti-rotation)",
        mode: "reps",
        series: 3,
        repsMin: 10,
        repsMax: 10,
        rpe: "Contrôlé",
        reposSec: 45,
        parCote: true,
        variantes: [
          { id: "pallof-cable", rang: 1, nom: "Cable Station hauteur poitrine", machine: "Cable Station", contrainte: "faible" },
          { id: "pallof-elastique", rang: 2, nom: "Élastique fixé", materiel: "Élastique", contrainte: "faible" }
        ]
      },
      {
        id: "planche-laterale",
        nom: "Planche latérale",
        mode: "duree",
        series: 2,
        dureeCibleSec: 30,
        rpe: "Tenue propre",
        reposSec: 30,
        sansCharge: true,
        parCote: true,
        progression: "+5 s par semaine.",
        variantes: [
          { id: "planche-lat-std", rang: 1, nom: "Sur l'avant-bras, corps gainé", contrainte: "aucune" },
          { id: "planche-lat-genoux", rang: 2, nom: "Sur les genoux", contrainte: "aucune" }
        ]
      },
      {
        id: "scaption-o",
        nom: "Scaption (bras en Y, pouces vers le haut)",
        mode: "reps",
        series: 2,
        repsMin: 12,
        repsMax: 12,
        rpe: "Léger, contrôle total (2-4 kg)",
        reposSec: 30,
        variantes: [
          { id: "scaption-halt", rang: 1, nom: "Haltères légers", materiel: "Haltères 2-4 kg", contrainte: "faible" },
          { id: "scaption-elastique", rang: 2, nom: "Élastique sous les pieds", materiel: "Élastique", contrainte: "faible" }
        ]
      }
    ],
    cardio: undefined
  }
];

// ============================================================
// ARCHIVE — programme v4 (août-septembre 2026)
// Plus proposées à l'accueil, mais conservées pour que l'historique,
// les charges de référence et la sauvegarde GitHub restent lisibles.
// ============================================================

export const SEANCES_ARCHIVE: Seance[] = [
  // ============================ A — PUSH ============================
  {
    id: "A",
    lettre: "A",
    nom: "Push (ancien programme)",
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

  // ============================ C — PULL ============================
  {
    id: "C",
    lettre: "C",
    nom: "Pull (ancien programme)",
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

  // ============ E — OPTIONNELLE : COMPLÉMENT & PRÉVENTION ============
  {
    id: "E",
    lettre: "E",
    nom: "Optionnelle (ancien programme)",
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

// ============================================================
// MODE MAISON — vacances sans salle
// Matériel : une power band 15 kg · piscine · poids du corps
// Charge faible → le stimulus vient de l'effort : 15-25 reps,
// dernière série à l'échec. Aucun champ de charge (sansCharge).
// ============================================================

export const SEANCES_MAISON: Seance[] = [
  {
    id: "M1",
    lettre: "M1",
    nom: "Élastiques A — Poussée & jambes",
    dominante: "Pectoraux, épaules, quadriceps, mollets · ~25 min",
    objectif:
      "Maintenir, pas progresser. Charge faible : va près de l'échec, 15-25 reps. Pour durcir avec une seule bande : écarte les pieds (pré-tension), double la bande, travaille à un bras ou une jambe, ralentis la descente à 3 secondes.",
    piscine: {
      consigne:
        "Compté en allers-retours, jamais en minutes. Progression sur la semaine : 6 → 8 → 10 → 12 → 14. À partir du 3e jour, alterne 1 A/R rapide et 1 A/R lent : plus court, moins ennuyeux, et l'intensité agit mieux sur la graisse viscérale. Jours 4 et 6 : ajoute 10 sauts verticaux dans l'eau (l'immersion décharge la cheville droite).",
      reglesEpaule: [
        "2 allers-retours de crawl MAXIMUM au premier jour",
        "La moindre gêne, pendant ou le lendemain → brasse uniquement pour toute la semaine",
        "Tu n'as pas renagé depuis ta blessure : le crawl est le mouvement le plus exigeant pour une coiffe"
      ]
    },
    signauxArret: ["Douleur d'épaule sur le développé → stop, passe aux exercices de tirage"],
    exercices: [
      {
        id: "m-pompes",
        nom: "Pompes (descente en 3 s)",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 25,
        rpe: "Jusqu'à l'échec",
        reposSec: 60,
        sansCharge: true,
        progression: "Trop facile → pieds surélevés. Trop dur → mains surélevées.",
        variantes: [
          { id: "m-pompes-std", rang: 1, nom: "Pompes au sol, coudes à 45°", contrainte: "faible" },
          { id: "m-pompes-haut", rang: 2, nom: "Mains surélevées (table, muret)", contrainte: "faible" },
          { id: "m-pompes-pieds", rang: 3, nom: "Pieds surélevés", contrainte: "modérée" }
        ]
      },
      {
        id: "m-fentes",
        nom: "Fentes arrière",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        sansCharge: true,
        parCote: true,
        progression: "Tempo lent et pause d'1 s en bas plutôt que d'ajouter de la charge.",
        variantes: [
          { id: "m-fentes-std", rang: 1, nom: "Fentes arrière alternées", contrainte: "aucune" },
          { id: "m-fentes-bulg", rang: 2, nom: "Fentes bulgares (pied arrière surélevé)", contrainte: "aucune" }
        ]
      },
      {
        id: "m-dev-epaules",
        nom: "Développé épaules élastique (devant)",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        sansCharge: true,
        adaptations: "Jamais derrière la tête. Écarte les pieds pour durcir.",
        variantes: [
          { id: "m-dev-band", rang: 1, nom: "Bande sous les pieds, poussée verticale devant", materiel: "Power band 15 kg", contrainte: "modérée" }
        ]
      },
      {
        id: "m-squat-saute",
        nom: "Squats sautés (puissance)",
        mode: "reps",
        series: 3,
        repsMin: 8,
        repsMax: 8,
        rpe: "Explosif, jamais à l'échec",
        reposSec: 90,
        sansCharge: true,
        adaptations: "Réception amortie et silencieuse. Douleur cheville → supprimer.",
        variantes: [
          { id: "m-squat-saute-std", rang: 1, nom: "Squat sauté, réception amortie", contrainte: "aucune" }
        ]
      },
      {
        id: "m-elev-lat",
        nom: "Élévations latérales élastique",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Échec autorisé",
        reposSec: 60,
        sansCharge: true,
        variantes: [
          { id: "m-elev-band", rang: 1, nom: "Bande sous un pied, un bras à la fois", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-triceps",
        nom: "Triceps kickback élastique",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Échec autorisé",
        reposSec: 60,
        sansCharge: true,
        parCote: true,
        variantes: [
          { id: "m-kickback", rang: 1, nom: "Buste penché, coude fixe", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-mollets",
        nom: "Mollets unilatéral",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Échec autorisé",
        reposSec: 45,
        sansCharge: true,
        parCote: true,
        variantes: [
          { id: "m-mollets-std", rang: 1, nom: "Sur une jambe, amplitude complète (marche si possible)", contrainte: "aucune" }
        ]
      }
    ]
  },

  {
    id: "M2",
    lettre: "M2",
    nom: "Élastiques B — Tirage & chaîne postérieure",
    dominante: "Dos, ischios, fessiers, épaules · ~25 min",
    objectif:
      "Tirage et chaîne postérieure. Double la bande si 15 kg devient trop léger sur le rowing. Le band pull-apart est l'exercice le plus utile de la semaine pour ton épaule.",
    piscine: {
      consigne:
        "Compté en allers-retours, jamais en minutes. Progression sur la semaine : 6 → 8 → 10 → 12 → 14. À partir du 3e jour, alterne 1 A/R rapide et 1 A/R lent : plus court, moins ennuyeux, et l'intensité agit mieux sur la graisse viscérale. Jours 4 et 6 : ajoute 10 sauts verticaux dans l'eau (l'immersion décharge la cheville droite).",
      reglesEpaule: [
        "2 allers-retours de crawl MAXIMUM au premier jour",
        "La moindre gêne, pendant ou le lendemain → brasse uniquement pour toute la semaine",
        "Tu n'as pas renagé depuis ta blessure : le crawl est le mouvement le plus exigeant pour une coiffe"
      ]
    },
    signauxArret: ["Douleur lombaire sur le soulevé unilatéral → réduire l'amplitude"],
    exercices: [
      {
        id: "m-rowing",
        nom: "Rowing assis élastique",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        sansCharge: true,
        progression: "Trop léger → double la bande.",
        variantes: [
          { id: "m-rowing-sol", rang: 1, nom: "Assis au sol, bande autour des pieds", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-rdl-uni",
        nom: "Soulevé de terre roumain unilatéral",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "2-3 reps en réserve",
        reposSec: 60,
        sansCharge: true,
        parCote: true,
        adaptations: "Dos plat, charnière de hanche. La charge élastique est trop faible pour être risquée.",
        variantes: [
          { id: "m-rdl-band", rang: 1, nom: "Bande sous le pied d'appui, jambe libre tendue en arrière", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-tirage",
        nom: "Tirage vertical élastique",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 20,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        sansCharge: true,
        variantes: [
          {
            id: "m-tirage-ancrage",
            rang: 1,
            nom: "Bande fixée en hauteur, à genoux",
            materiel: "Power band + point d'ancrage",
            contrainte: "faible",
            note: "Nécessite un ancrage (porte, rambarde, branche)."
          },
          {
            id: "m-pullover-sol",
            rang: 2,
            nom: "Pull-over au sol (SANS ancrage)",
            materiel: "Power band 15 kg",
            contrainte: "faible",
            note: "Allongé, bande sous les fesses, bras semi-tendus qui montent au-dessus de la tête."
          }
        ]
      },
      {
        id: "m-pull-apart",
        nom: "Band pull-apart",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "1-2 reps en réserve",
        reposSec: 45,
        sansCharge: true,
        variantes: [
          {
            id: "m-pull-apart-std",
            rang: 1,
            nom: "Bras tendus devant, écartement contrôlé",
            materiel: "Power band 15 kg",
            contrainte: "faible",
            note: "L'exercice le plus utile de la semaine pour ton épaule droite."
          }
        ]
      },
      {
        id: "m-curl",
        nom: "Curl élastique",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Échec autorisé",
        reposSec: 60,
        sansCharge: true,
        variantes: [
          { id: "m-curl-band", rang: 1, nom: "Bande sous les pieds (un bras à la fois pour durcir)", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-pont-fessier",
        nom: "Pont fessier unilatéral",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
        reposSec: 60,
        sansCharge: true,
        parCote: true,
        variantes: [
          { id: "m-pont-uni", rang: 1, nom: "Un pied au sol, l'autre jambe tendue vers le haut", contrainte: "aucune" }
        ]
      },
      {
        id: "m-abduction",
        nom: "Abduction hanche élastique",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "1-2 reps en réserve",
        reposSec: 45,
        sansCharge: true,
        parCote: true,
        variantes: [
          { id: "m-abduction-band", rang: 1, nom: "Bande aux chevilles, debout", materiel: "Power band 15 kg", contrainte: "aucune" }
        ]
      }
    ]
  },

  {
    id: "M3",
    lettre: "M3",
    nom: "Mobilité & prévention",
    dominante: "Épaule, cheville, doigts, gainage · ~20 min",
    objectif:
      "La séance la plus utile de la semaine : c'est exactement la routine que tu sautes systématiquement en fin de séance à la salle. Ici elle a vingt minutes pour elle seule.",
    piscine: {
      consigne:
        "Compté en allers-retours, jamais en minutes. Progression sur la semaine : 6 → 8 → 10 → 12 → 14. À partir du 3e jour, alterne 1 A/R rapide et 1 A/R lent : plus court, moins ennuyeux, et l'intensité agit mieux sur la graisse viscérale. Jours 4 et 6 : ajoute 10 sauts verticaux dans l'eau (l'immersion décharge la cheville droite).",
      reglesEpaule: [
        "2 allers-retours de crawl MAXIMUM au premier jour",
        "La moindre gêne, pendant ou le lendemain → brasse uniquement pour toute la semaine",
        "Tu n'as pas renagé depuis ta blessure : le crawl est le mouvement le plus exigeant pour une coiffe"
      ]
    },
    signauxArret: ["Tout doit rester léger et indolore — aucun exercice ici ne se force"],
    exercices: [
      {
        id: "m-rot-ext",
        nom: "Rotations externes coude au corps",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "Léger",
        reposSec: 30,
        sansCharge: true,
        parCote: true,
        variantes: [
          { id: "m-rot-band", rang: 1, nom: "Bande tenue à deux mains, coude collé au corps", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-pull-apart-3",
        nom: "Band pull-apart",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Léger",
        reposSec: 30,
        sansCharge: true,
        variantes: [
          { id: "m-pull-apart-3-std", rang: 1, nom: "Bras tendus devant", materiel: "Power band 15 kg", contrainte: "faible" }
        ]
      },
      {
        id: "m-scaption",
        nom: "Scaption (bras en Y, pouces vers le haut)",
        mode: "reps",
        series: 3,
        repsMin: 12,
        repsMax: 12,
        rpe: "Léger, contrôle total",
        reposSec: 30,
        sansCharge: true,
        variantes: [
          { id: "m-scaption-std", rang: 1, nom: "Poids du corps ou bande très légère", contrainte: "faible" }
        ]
      },
      {
        id: "m-equilibre",
        nom: "Équilibre unipodal droit, yeux fermés",
        mode: "duree",
        series: 3,
        dureeCibleSec: 45,
        rpe: "—",
        reposSec: 30,
        sansCharge: true,
        progression: "Yeux ouverts d'abord si c'est trop instable.",
        variantes: [
          { id: "m-equilibre-std", rang: 1, nom: "Sur la jambe droite", contrainte: "aucune" }
        ]
      },
      {
        id: "m-sautillements",
        nom: "Sautillements bas puis latéraux",
        mode: "reps",
        series: 3,
        repsMin: 15,
        repsMax: 15,
        rpe: "Réceptions silencieuses",
        reposSec: 45,
        sansCharge: true,
        variantes: [
          { id: "m-sautillements-std", rang: 1, nom: "Sur place, puis d'un côté à l'autre", contrainte: "aucune" }
        ]
      },
      {
        id: "m-extenseurs",
        nom: "Extension des doigts contre élastique",
        mode: "reps",
        series: 3,
        repsMin: 20,
        repsMax: 20,
        rpe: "Léger",
        reposSec: 30,
        sansCharge: true,
        variantes: [
          {
            id: "m-extenseurs-std",
            rang: 1,
            nom: "Ouverture de la main contre résistance",
            materiel: "Petit élastique",
            contrainte: "aucune",
            note: "Prévention de l'épitrochléite avant la reprise de l'escalade."
          }
        ]
      },
      {
        id: "m-planche",
        nom: "Planche + planche latérale",
        mode: "duree",
        series: 3,
        dureeCibleSec: 45,
        rpe: "—",
        reposSec: 45,
        sansCharge: true,
        progression: "Puis 30 s de planche latérale de chaque côté.",
        variantes: [
          { id: "m-planche-std", rang: 1, nom: "Gainage ventral puis latéral", contrainte: "aucune" }
        ]
      }
    ]
  },

];

/** Toutes les séances confondues — pour les recherches par id (historique, charges). */
export const SEANCES: Seance[] = [...SEANCES_SALLE, ...SEANCES_MAISON, ...SEANCES_ARCHIVE];

export function getSeances(mode: Mode): Seance[] {
  return mode === "maison" ? SEANCES_MAISON : SEANCES_SALLE;
}

/** Une séance appartient-elle au mode Maison ? (les ids maison commencent par M) */
export function estMaison(type: string): boolean {
  return type.startsWith("M");
}

export const ORDRE_MAISON: ReadonlyArray<string> = ["M1", "M2", "M3"];

export function getOrdre(mode: Mode): ReadonlyArray<string> {
  return mode === "maison" ? ORDRE_MAISON : ORDRE_SUGGESTION;
}

export const TESTS: TestDef[] = [
  { id: "test-presse", nom: "Presse à cuisses", protocole: "Charge fixe, max de reps propres (RPE 9)", unite: "reps", chargeFixe: true },
  { id: "test-tirage", nom: "Tirage vertical prise neutre", protocole: "Charge fixe, max de reps (RPE 9)", unite: "reps", chargeFixe: true },
  { id: "test-developpe", nom: "Développé machine", protocole: "Charge fixe, max de reps (RPE 9)", unite: "reps", chargeFixe: true },
  { id: "test-deadhang", nom: "Dead hang", protocole: "Temps max, prise pleine main", unite: "sec", chargeFixe: false },
  { id: "test-farmer", nom: "Farmer hold", protocole: "Temps max, charge fixe", unite: "sec", chargeFixe: true },
  { id: "test-cmj", nom: "CMJ (saut vertical)", protocole: "Meilleur de 3 sauts, marque au mur", unite: "cm", chargeFixe: false }
];

// Rotation : Haut du corps → Bras → Jambes. L'optionnelle reste hors rotation.
export const ORDRE_SUGGESTION: ReadonlyArray<string> = ["H", "D", "B"];

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
