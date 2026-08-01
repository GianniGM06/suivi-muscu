# Suivi Muscu 🏋️

PWA personnelle de suivi de musculation — Programme Août 2026 (séances A–E en rotation libre).
Mobile-first (iPhone), français, hors ligne, sans compte, sans backend. Sauvegarde manuelle vers GitHub.

**Confidentialité** : gênes, notes libres et toute donnée personnelle restent sur le téléphone.
Seuls séances, charges et tests (non sensibles) partent dans `data/suivi.json` du dépôt public,
après passage par un filtre vérifié par test unitaire (`tests/filter.test.ts`).

---

## 1. Installation locale

Prérequis : [Node.js](https://nodejs.org) ≥ 18.

```bash
cd suivi-muscu
npm install
npm run dev        # ouvre http://localhost:5173/suivi-muscu/
npm test           # vérifie notamment le filtre de confidentialité
npm run build      # build de production dans dist/
```

## 2. Création du dépôt GitHub

1. Sur github.com : **New repository** → nom : `suivi-muscu` → **Public** → sans README (le nôtre existe déjà).
2. Dans le dossier du projet :

```bash
git init
git add .
git commit -m "Suivi Muscu v1"
git branch -M main
git remote add origin https://github.com/GianniGM06/suivi-muscu.git
git push -u origin main
```

> Si tu choisis un autre nom de dépôt, change aussi `base` dans `vite.config.ts`
> (et `start_url`/`scope` du manifest, même fichier) : ils doivent être `/<nom-du-repo>/`.

## 3. Activer GitHub Pages

1. Sur le dépôt : **Settings → Pages**.
2. **Source** : sélectionne **GitHub Actions**.
3. Le workflow `.github/workflows/deploy.yml` se lance à chaque push sur `main` (il ignore les
   commits qui ne touchent que `data/` — les sauvegardes de l'app ne redéploient pas le site).
4. Après ~2 min, l'app est sur : `https://GianniGM06.github.io/suivi-muscu/`

## 4. Installer l'app sur l'iPhone

1. Ouvre l'URL dans **Safari**.
2. Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter**.
3. L'app se lance en plein écran et fonctionne hors ligne après le premier chargement.

## 5. Créer le token GitHub (droits minimaux)

1. GitHub → avatar → **Settings** → **Developer settings** → **Personal access tokens** →
   **Fine-grained tokens** → **Generate new token**.
2. **Token name** : `suivi-muscu-iphone` · **Expiration** : 90 jours (recommandé).
3. **Repository access** : **Only select repositories** → coche uniquement `suivi-muscu`.
4. **Permissions → Repository permissions** : **Contents : Read and write**. Rien d'autre.
5. **Generate token** et copie-le immédiatement (il ne sera plus affiché).

⚠️ Ce token ne doit jamais être collé ailleurs que dans les Réglages de l'app (ni dans le code,
ni dans un fichier du dépôt, ni dans une conversation).

## 6. Configurer l'app

Dans l'app : **Réglages → Sauvegarde GitHub** :

| Champ | Valeur |
|---|---|
| Identifiant GitHub | `GianniGM06` |
| Dépôt | `suivi-muscu` |
| Branche | `main` |
| Chemin du fichier | `data/suivi.json` |
| Token | colle le token (masqué après enregistrement) |

Le token est stocké uniquement dans le stockage local du téléphone.

## 7. Premier push de données

1. Termine une séance (ou va sur l'accueil) → **☁️ Sauvegarder sur GitHub**.
2. Vérifie sur GitHub que `data/suivi.json` est apparu, avec un commit du type
   `suivi: séance C — 2026-08-03 18:42`.
3. Ouvre le fichier et vérifie qu'il ne contient **ni gêne, ni note, ni token** (il ne peut pas :
   le filtre est testé, mais vérifier une fois soi-même est une bonne habitude).

## 8. Révoquer le token (si perte du téléphone ou doute)

GitHub → **Settings → Developer settings → Fine-grained tokens** → `suivi-muscu-iphone` →
**Revoke**. L'app affichera « token invalide ou expiré » à la prochaine sauvegarde ; il suffit
d'en régénérer un et de le recoller dans les Réglages.

## 9. Sauvegarde et restauration

- **Réglages → Export JSON complet** : toutes les données locales (SANS le token). À faire
  chaque mois — l'app te le rappelle. Stocke le fichier dans iCloud/Fichiers.
- **Réglages → Importer un JSON** : aperçu puis **Fusionner** (ajoute ce qui manque) ou
  **Remplacer** (écrase tout ; la config GitHub actuelle est conservée).
- **Export CSV** : séances + charges de référence, pour Excel.
- **Copier le bilan pour Claude** : résumé Markdown concis (gênes agrégées uniquement, jamais de
  détails médicaux) à coller dans la conversation avec ton coach.

---

## Checklist de test iPhone

Après déploiement, vérifier dans Safari puis dans l'app installée :

- [ ] L'app se charge à l'URL Pages, puis **en mode avion** après un premier chargement.
- [ ] Installation écran d'accueil : icône correcte, lancement plein écran (standalone).
- [ ] Accueil : les 5 séances s'affichent, la suggestion est cohérente, boutons ≥ 44 px au pouce.
- [ ] Démarrer une séance C : la routine épaule apparaît en premier, chronos « ▶ » fonctionnent.
- [ ] Saisir une charge → cocher une série → le chrono de repos démarre seul avec la bonne durée.
- [ ] +15 s / +30 s / pause / reprise / remise à zéro fonctionnent.
- [ ] Verrouiller l'écran 1 min pendant un repos → au retour, le temps restant est correct
      (ou l'écran « Terminé » s'affiche). C'est le comportement attendu, pas de son ni vibration
      écran verrouillé (limite iOS).
- [ ] Bouton « Variantes » : liste triée par priorité, contrainte épaule colorée, interdits barrés
      et non sélectionnables ; choisir une variante la mémorise pour la prochaine séance.
- [ ] Gêne épaule à 4/10 → le message de sécurité s'affiche et demande confirmation.
- [ ] Quitter l'app en pleine séance → la reprendre depuis l'accueil (« Reprendre la séance »).
- [ ] Terminer la séance → récap correct → « Enregistrer comme nouvelle charge de référence ? »
      ne liste que les charges réellement modifiées.
- [ ] Sauvegarder sur GitHub → commit visible → contenu de `data/suivi.json` sans champ sensible.
- [ ] Couper le réseau → sauvegarder → message d'erreur réseau propre → réessayer avec réseau.
- [ ] Suivi : historique, charges de référence par variante, saisie d'un test dead hang.
- [ ] Réglages : export JSON complet téléchargé ; l'ouvrir et vérifier `"token": ""`.
- [ ] Mode sombre/clair suivent le réglage, contraste lisible en salle.

## Structure du projet

```
suivi-muscu/
├── .github/workflows/deploy.yml   # déploiement GitHub Pages
├── index.html
├── vite.config.ts                 # base /suivi-muscu/ + manifest PWA
├── public/icons/                  # icônes PWA + apple-touch-icon
├── src/
│   ├── data/program.ts            # LE PROGRAMME (fichier éditable, séparé de la logique)
│   ├── types.ts                   # modèle de données + type du payload public
│   ├── storage.ts                 # localStorage versionné (schemaVersion)
│   ├── sync/filter.ts             # filtre de confidentialité (testé)
│   ├── sync/github.ts             # API GitHub Contents : SHA, conflits, erreurs
│   ├── export/exports.ts          # JSON / CSV / bilan pour Claude
│   ├── hooks/useTimer.ts          # minuteries par horodatage (fiables après arrière-plan)
│   └── components/                # Home, SessionScreen, SummaryScreen, Suivi, Réglages…
└── tests/filter.test.ts           # garantie : rien de sensible ne part sur GitHub
```

## Limites connues (V1)

- Pas de vibration sur Safari iOS → signal de fin = flash visuel plein écran.
- Aucun signal de chrono pendant que l'écran est verrouillé (limite iOS sans notifications).
- Un seul appareil : en cas de conflit, on choisit une version, pas de fusion fine.
- Le dépôt étant public, `data/suivi.json` (séances, charges, tests) est public. Rien d'autre n'y part.

*Cette application ne fournit aucun diagnostic médical. En cas de douleur qui persiste ou augmente : professionnel de santé.*
