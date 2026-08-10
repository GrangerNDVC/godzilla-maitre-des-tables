# Godzilla : Protocole Titan — README (v2)

## ⚠️ Cette version remplace TOUT ce que tu avais avant
`index.html` + `style.css` + `game.js` doivent venir ensemble, de ce livrable, tous les trois. Si un fichier "traîne" d'un envoi précédent dans ton dossier, remplace-le — c'est exactement ce qui a causé le bug de la grosse image Godzilla toute seule : le premier `index.html` que je t'avais envoyé référençait des éléments (accueil à 2 colonnes, écran de chapitre à 3 boutons, Dossiers Monarch...) qu'un `style.css` plus ancien ne connaissait pas encore. Désolée pour la confusion — c'est corrigé, les 3 fichiers ci-dessus sont cohérents entre eux et testés ensemble.

## Pour lancer / déployer
Dossier autonome : `index.html` + `style.css` + `game.js` + `assets/`.
- **Test local** : double-clic sur `index.html`, aucun serveur requis.
- **Netlify / GitHub** : glisse tout le dossier tel quel.

## Assets nécessaires
Toujours aucune nouvelle image *obligatoire* : `godzilla.png`, `godzilla_ouvert.png`, `rayon.png`, `kaiju_mothra.png`, `kaiju_rodan.png`, `kaiju_gigan.png`, `kaiju_mechagodzilla.png`, `decors_1.jpg`, `decors_2.jpg`, `decors_4.jpg`, `decors_5.jpg`, `decors_1_bis.jpg` — les mêmes que ta v1.

Trois fichiers sont **optionnels**, avec repli automatique si absents :
| Fichier optionnel | Si absent |
|---|---|
| `assets/presentation.png` | L'écran d'accueil retombe sur un fond uni (le cadre reste vide, rien ne casse) |
| `assets/godzilla_burning.png`, `assets/godzilla_burning_ouvert.png` | Filtre rose/magenta appliqué en code sur `godzilla.png` / `godzilla_ouvert.png` |
| `assets/rayon_burning.png` | `rayon.png` teinté en rose/magenta en code |

Rien à changer dans le code pour activer ces 3 fichiers : dépose-les avec ces noms exacts dans `assets/`, ils prennent le relais automatiquement.

## Ce que j'ai porté depuis ta v2 du jeu de tables, et comment je l'ai adapté

**Maîtrise progressive du Burning** — portée quasi telle quelle, recalibrée pour 8 phrases/chapitre au lieu de 10 calculs : un chapitre est "rapide" sous 30s (au lieu de 10s), 2 chapitres rapides/propres d'affilée déclenchent le mode (1 seul après 6 points de maîtrise), pour une durée qui grandit avec la maîtrise — toujours persistée en `localStorage`, toujours indépendante d'une partie précise. Popup "+5🔥" à chaque cristal touché pendant le mode, ×1.5 sur le bonus de fin de chapitre.

**Couleur du mode Burning : rose/magenta, pas orange.** J'ai gardé mon choix initial (celui de "Godzilla Évolué" dans *Godzilla x Kong: The New Empire*, 2024) plutôt que ton filtre orange de secours — mais toute la mécanique (déclenchement, durée, bonus) vient bien de ta v2. Si tu fournis un jour `godzilla_burning.png`, il prendra le relais du filtre automatiquement, comme chez toi.

**Apparition du Titan avant la fin du chapitre** — porté avec le même principe (3 phrases restantes = le Titan apparaît derrière les rochers + Burning forcé), adapté à mes 8 phrases/chapitre.

**Séquence de victoire cinématique** (bascule + texte) — portée, avec un texte différent par Titan cohérent avec MON histoire : "MOTHRA EST LIBÉRÉE !" pour un Titan secouru, "GIGAN EST NEUTRALISÉ !" pour une vraie menace vaincue. Le flip fonctionne visuellement dans les deux cas (fin de combat), même quand le Titan n'est pas un méchant.

**Chrono masquable, tablette, Rangs de Godzilla (médailles)** — portés directement, ils ne dépendaient pas du contenu multiplication/grammaire.

## Ce que j'ai volontairement adapté (pas juste copié)

**"Parc des Kaijus" → "Dossiers Monarch", sans barreaux de prison.** Dans ton jeu, tous les kaijus sont des ennemis capturés : la prison a du sens. Dans le mien, Mothra et Rodan sont *libérés* (pas emprisonnés) — les montrer derrière des barreaux aurait contredit l'histoire qu'ils viennent de lire. J'ai gardé l'esprit (galerie des Titans rencontrés, verrouillée tant qu'on ne les a pas atteints) mais sous forme de dossiers d'enquête Monarch, avec un tampon "DOSSIER CLASSIFIÉ" dessiné en code pour les chapitres non atteints — aucune image supplémentaire requise.

**Pas d'écran de zoom séparé — et c'est volontaire (voir le bug ci-dessous).**

**Le nom du Titan n'est pas caché "???" pendant le combat.** Chez toi c'est un ressort de surprise (8 niveaux indépendants). Chez moi, l'histoire nomme Mothra/Rodan/Gigan/Mechagodzilla dans le texte narratif dès le début du chapitre — cacher le nom dans la barre de stats juste en dessous aurait été incohérent avec ce qu'on vient de lire. Le mystère reste entier pour les chapitres **pas encore atteints** (accueil et Dossiers Monarch affichent bien "???" pour ceux-là).

## Les 2 bugs que tu as signalés

**« Cliquer sur un kaiju pour le voir bloque le jeu, impossible de revenir en arrière »**
En repassant sur ton code, chaque écran gérait son propre `classList.add("hidden")` / `remove("hidden")`, bouton par bouton — un pattern qui devient vite fragile à mesure qu'on ajoute des écrans (facile d'oublier d'en cacher un). Deux corrections :
1. Une seule fonction `showScreen(id)` centralise tous les changements d'écran (elle cache TOUS les écrans puis affiche seulement celui demandé) — utilisée partout, sans exception, donc plus aucun écran ne peut rester coincé.
2. J'ai supprimé l'écran de zoom séparé ("cliquer pour agrandir") : les Dossiers Monarch affichent tout directement dans la grille. Une navigation en moins, c'est toute une classe de bugs de navigation en moins. Si tu veux récupérer le zoom plus tard, je peux le rajouter en le construisant sur `showScreen()` dès le départ.

**« En fin de partie, l'ennemi apparaît parfois alors qu'il ne devrait pas »**
Trouvé : `drawEnemyPeeking()` (mon `drawTitanLooming()`) n'était coupée nulle part pendant la séquence de victoire — qui affiche déjà le même kaiju en grand, en train de basculer. Les deux se dessinaient en même temps, d'où l'impression de doublon/de bug visuel juste à la fin d'un niveau. Corrigé : `drawTitanLooming()` ne s'exécute plus jamais tant que la séquence de victoire (`bossDefeat`) est active.

## Testé automatiquement
- `node --check` : syntaxe JS valide.
- Tous les `getElementById()` de `game.js` correspondent à un `id` du HTML (44/44), y compris les 6 écrans gérés via `showScreen()`.
- Toutes les classes CSS utilisées par le JS/HTML ont une règle de style définie.
- Les 4 niveaux / 32 phrases repassés dans le script de vérification structurelle (réponses valides, pas de double-espace, majuscule/ponctuation) + les nouveaux champs v2 (`defeatCaption`, `defeatDetail`, `statusLabel`) — 0 anomalie.
- Grep de contrôle : plus aucune trace de l'ancien écran de zoom, plus aucun écran caché/affiché en dehors de `showScreen()`.

## Non testé (toujours pas de navigateur disponible ici)
Comme la dernière fois, impossible d'installer Chromium dans cet environnement (le réseau est restreint) pour une vraie capture d'écran. Cette fois, croise les doigts avec moi et teste en premier avant de faire quoi que ce soit d'autre — en particulier :
- L'accueil à deux colonnes (lore à gauche, image + onglets à droite) sur ton écran.
- Le redimensionnement tablette (`fitGameToViewport`) si tu as un iPad sous la main.
- Le rythme du mode Burning (seuil 30s, palier long à -10s en dessous) — à ajuster si besoin, ce sont juste des constantes en haut de `game.js`.
- Un réglage "🗑️ Réinitialiser la progression" a été ajouté dans le panneau ⚙️ (utile entre deux classes qui utiliseraient le même navigateur) — vérifie qu'il fait bien ce qu'il annonce.
