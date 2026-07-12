# TRANSMISSION — Godzilla : Maître des Tables
**Date : 12 juillet 2026**
**Étape : 2 (réécriture du jeu à partir du plan `plan_godzilla_tables_multiplication.md`)**

---

## 1. Ce qui a été livré

Un dossier autonome `godzilla-maitre-des-tables/` (aussi fourni en `.zip`), déployable tel quel sur Netlify/GitHub :

```
godzilla-maitre-des-tables/
├── index.html          → structure de la page, écran start/end, appelle style.css + game.js
├── style.css            → thème visuel "alerte kaiju" (HUD, cartes, écrans)
├── game.js               → tout le moteur de jeu (voir détail plus bas)
├── README.md              → notes de déploiement + points ouverts
└── assets/
    ├── godzilla.png              → Godzilla, gueule fermée
    ├── godzilla_ouvert.png       → Godzilla, gueule ouverte (pose de tir)
    ├── rayon.png                  → le rayon seul, superposé en code
    ├── kaiju_mothra.png           → niveau 1 (table de 2)
    ├── kaiju_rodan.png            → niveau 2 (table de 3)
    ├── kaiju_anguirus.png         → niveau 3 (table de 4)
    ├── kaiju_mechagodzilla.png    → niveau 4 (table de 5)
    ├── kaiju_gigan.png            → niveau 5 (table de 6)
    ├── kaiju_ghidorah.png         → niveau 8 (table de 9)
    ├── decors_1.jpg                → écran de démarrage + niveau 1 (Mothra)
    ├── decors_1_bis.jpg            → décor de secours (si un fichier manque/rate)
    ├── decors_2.jpg → decors_8.jpg → niveaux 2 à 8, dans l'ordre
    └── (MANQUANT) kaiju_biollante.png   → niveau 6 (table de 7)
    └── (MANQUANT) kaiju_destroyah.png   → niveau 7 (table de 8)
```

**Pourquoi 2 images manquent** : `Destroyah.png` et `Biollante.png` étaient présentes dans ton tout premier message de cette conversation, mais elles ont disparu du dossier d'upload en cours d'échange (elles n'apparaissent plus quand je liste `/mnt/user-data/uploads`). Je n'ai pas pu les récupérer autrement. Le jeu tourne quand même : une silhouette de secours dessinée en code (forme sombre, yeux rouges) remplace le vrai visuel sur ces 2 niveaux, sans rien casser.

**Pour les réparer** : renomme tes deux images exactement `kaiju_biollante.png` et `kaiju_destroyah.png` (même fond bleu pur `#0000FF` que les 6 autres kaijus) et dépose-les dans `assets/`. Aucune ligne de code à toucher, le chargement + détourage est automatique.

---

## 2. Liste exacte des noms de fichiers attendus dans `assets/`

Si tu dois renommer tes images toi-même, voici la liste exacte que le code va chercher (respecter la casse et l'extension) :

| Nom de fichier attendu | Contenu | Format |
|---|---|---|
| `godzilla.png` | Godzilla gueule fermée | PNG, fond bleu pur |
| `godzilla_ouvert.png` | Godzilla gueule ouverte | PNG, fond bleu pur |
| `rayon.png` | Le rayon seul (tunnel électrique) | PNG, fond bleu pur |
| `kaiju_mothra.png` | Mothra | PNG, fond bleu pur |
| `kaiju_rodan.png` | Rodan | PNG, fond bleu pur |
| `kaiju_anguirus.png` | Anguirus | PNG, fond bleu pur |
| `kaiju_mechagodzilla.png` | Mechagodzilla | PNG, fond bleu pur |
| `kaiju_gigan.png` | Gigan | PNG, fond bleu pur |
| `kaiju_biollante.png` | Biollante *(à fournir)* | PNG, fond bleu pur |
| `kaiju_destroyah.png` | Destoroyah *(à fournir)* | PNG, fond bleu pur |
| `kaiju_ghidorah.png` | King Ghidorah | PNG, fond bleu pur |
| `decors_1.jpg` | Décor niveau 1 / écran démarrage (île, temple englouti) | JPG |
| `decors_2.jpg` | Décor niveau 2 (pics volcaniques) | JPG |
| `decors_3.jpg` | Décor niveau 3 (carrière rocheuse) | JPG |
| `decors_4.jpg` | Décor niveau 4 (base futuriste) | JPG |
| `decors_5.jpg` | Décor niveau 5 (métropole en ruines) | JPG |
| `decors_6.jpg` | Décor niveau 6 (marécage toxique) | JPG |
| `decors_7.jpg` | Décor niveau 7 (cratère) | JPG |
| `decors_8.jpg` | Décor niveau 8 (cosmos orageux) | JPG |
| `decors_1_bis.jpg` | Décor de secours générique | JPG |

Note : `space_godzilla.png` (une de tes images) n'est utilisée nulle part — il n'était pas dans le tableau des 8 niveaux du plan initial. Dis-moi si tu veux l'intégrer quelque part.

---

## 3. Ce qui a été construit (détail technique)

**Correspondance niveau / table / kaiju / décor / palier** (identique au plan) :
| Niveau | Table | Kaiju | Palier |
|---|---|---|---|
| 1 | ×2 | Mothra | 1 |
| 2 | ×3 | Rodan | 1 |
| 3 | ×4 | Anguirus | 2 |
| 4 | ×5 | Mechagodzilla | 2 |
| 5 | ×6 | Gigan | 3 |
| 6 | ×7 | Biollante | 3 |
| 7 | ×8 | Destoroyah | 4 |
| 8 | ×9 | King Ghidorah | 4 |

**Boucle de jeu** : pioche de 10 faits (facteurs 1 à 10) par niveau, mélangée. Chaque fait affiche 1 cristal correct + 3 leurres construits à partir d'erreurs classiques (table voisine, facteur ±1, erreur d'une ligne, erreur d'unité...). Bonne réponse → Godzilla tire (rayon superposé, animé sur ~0,25s) → le cristal se fissure → le kaiju apparaît teinté de rouge → explosion de particules → fait suivant. Mauvaise réponse → le cristal éclate à vide (poussière) → le fait retourne dans la pioche → carte "Leçon express" avec calcul corrigé + astuce de décomposition (ex: 6×7 = 6×5 + 6×2 = 30+12 = 42, ou astuces spéciales pour ×1, ×9, ×10, ×5).

**Décisions prises suite à tes réponses en cours de conversation** :
- Décors : `decors_1` sert à la fois à l'écran de démarrage et au niveau 1 (rencontre Mothra sans ennemi visible) ; `decors_1_bis` est le décor de secours si un fichier manque.
- Godzilla : un seul design (pas de 4 paliers visuels séparés). Le rayon et son halo changent quand même de teinte selon le palier (blanc-bleu → bleu → bleu-violet → rouge-orangé), appliquée en code sur `rayon.png`, donc l'esprit du plan est conservé sans besoin d'images supplémentaires.
- Combo Mothra : 3 bonnes réponses d'affilée en moins de 10 secondes retirent 1 faute au compteur du niveau en cours (`errors--`, jamais négatif). Actif à tous les niveaux, pas seulement celui de Mothra.
- 5 erreurs cumulées sur un niveau → écran "Attaque repoussée" avec 2 boutons : "Réessayer ce niveau" (reprend la même table à 0/10, 0 faute, sans repasser par les niveaux déjà validés) et "Repartir du niveau 1".
- Chrono + bonus de rapidité : seuils repris tels quels du jeu d'origine (≤8s=100pts, ≤12s=70, ≤18s=45, ≤25s=25, sinon 10, pénalité -5/faute) — à retester et ajuster si le rythme "calcul mental" est différent du rythme "orthographe" d'origine.

**Réglage à vérifier toi-même** : la position de sortie du rayon (bouche de Godzilla) est une estimation visuelle dans `game.js` :
```js
const GODZILLA_MOUTH_REL = { x: 0.175, y: 0.155 };
```
Si le rayon ne part pas exactement de la bouche à l'écran, ajuste ces deux valeurs par petits pas (0.01-0.02) et recharge — rien d'autre à toucher.

---

## 4. Tests effectués (Playwright/Chromium headless, dans mon environnement)

- **Logique pure** (Node, sans navigateur) : les 8 tables × 10 facteurs génèrent chacun exactement 1 bonne réponse + 3 leurres uniques et positifs, et une astuce non vide. 0 anomalie sur 80 combinaisons.
- **Playthrough complet automatisé** : du niveau 1 jusqu'à l'écran de victoire finale (niveau 8), sans erreur JS.
- **Game over** : 5 mauvaises réponses de suite → écran "Attaque repoussée" s'affiche → bouton "Réessayer ce niveau" fonctionne → reprend bien à 0 faute / 0 sur 10 sur la même table.
- **Combo Mothra** : 1 faute forcée + 3 bonnes réponses rapprochées → la faute est bien retirée (confirmé par script).
- **Bug trouvé et corrigé en cours de route** : après la victoire finale, une variable de niveau non protégée (`LEVELS[currentLevelIndex]`) provoquait une erreur JS silencieuse en boucle de rendu, car l'index dépasse la dernière table une fois le jeu terminé. Corrigé en bornant l'index (`Math.min(currentLevelIndex, LEVELS.length - 1)`) dans `drawGodzilla()`. Revalidé après correction.

**Non testé** : les tests automatisés cliquent via le code, pas une vraie souris humaine — je n'ai pas pu valider à l'œil humain le calage précis du rayon sur la bouche, ni le ressenti du timing des animations en conditions réelles. Un passage manuel de ta part sur quelques niveaux est recommandé avant utilisation en classe.

---

## 5. Prochaine étape suggérée

1. Renommer/déposer `kaiju_biollante.png` et `kaiju_destroyah.png` dans `assets/`.
2. Tester à la main dans un vrai navigateur (viser quelques cristaux, vérifier le calage du rayon, écouter les sons).
3. Ajuster `GODZILLA_MOUTH_REL` si besoin.
4. Éventuellement retoucher les seuils de bonus de rapidité après un essai avec de vrais élèves.
5. Déployer sur Netlify.
