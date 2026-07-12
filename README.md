# Godzilla : Maître des Tables — README

## 🔴 Mise à jour du 12/07/2026 (session 2) — transmission propre

### Ce qui a été fait cette session
1. **Mode burning progressif ("maîtrise")** : un compteur persistant (`localStorage`, `masteryPoints`) augmente à chaque niveau rapide/propre. Plus il grandit, moins il faut de niveaux rapides d'affilée pour activer le burning (2 → 1 après 6 points) et plus sa durée s'allonge (+2s par tranche de 3 points, jusqu'à +10s). Voir `getBurningStreakNeeded()` / `getBurningDuration()` dans `game.js`.
2. **Adaptation tablette (iPad / Surface 10-11")** : le jeu est maintenant mis à l'échelle automatiquement via `fitGameToViewport()` (CSS `transform: scale()`), recalculé au redimensionnement et au changement d'orientation. Il ne dépasse jamais sa taille native (pas d'agrandissement flou) et tient toujours dans l'écran, portrait ou paysage.
3. **Chrono verrouillable** : petit bouton ⚙️ en haut à droite ouvre un réglage "Afficher le chrono" — **désactivé par défaut** (persisté en `localStorage`). Le chrono continue de tourner en interne (bonus de rapidité inchangé), seul l'affichage est masqué.
4. **Score total visible en temps réel** : nouvelle case "🏆 Points" dans la barre de stats, mise à jour immédiatement à chaque bonus (burning, fin de niveau), pour rendre les combos et le burning motivants visuellement.
5. **Apparition de l'ennemi + burning forcé à 3 calculs restants** : quand il ne reste plus que 3 calculs à trouver (courant inclus), le kaiju du niveau apparaît partiellement derrière des rochers (dessinés en code) en haut à droite de l'écran, et Godzilla passe automatiquement en mode burning jusqu'à la fin du niveau (voir `drawEnemyPeeking()` / `ENEMY_REVEAL_REMAINING`).
6. **Victoire "tête en bas" + phrase de capture Monarch** : le kaiju vaincu bascule maintenant à 180° (vraiment tête en bas) avant de s'effondrer, et le texte affiche d'abord "NOM EST VAINCU !" puis "Grâce à Godzilla, MONARCH a capturé NOM et le ramène en prison." (écran allongé à 2,8s pour laisser le temps de lire).
7. **Nom du kaiju masqué pendant le combat tant qu'il n'a jamais été vaincu** : la case "KAIJU" de la barre de stats affiche "???" au lieu du nom en cours de partie pour un niveau jamais gagné (avant, le nom était visible pendant le combat même si le tableau d'accueil le masquait). En rejouant un niveau déjà vaincu, une phrase d'intro apparaît avant la première question : "NOM s'est échappé de sa prison, aide Monarch à le recapturer !"
8. **Lore de départ** (Apex Cybernetics / pierres de résonance / Monarch) sur l'écran d'accueil, présenté en courtes lignes avec une icône par idée (pas de gros pavé de texte) pour rester facile à lire visuellement.
9. **"Parc des Kaiju de Monarch"** : nouvel écran accessible depuis le menu d'accueil (bouton "🏛️ Parc des Kaiju de Monarch"). Chaque kaiju vaincu apparaît dans une cellule de prison composée des 3 calques demandés : `decors_prison.jpg` (fond) → image du kaiju → `barreaux_prison.png` (barreaux, premier plan, détourés). Les kaijus jamais vaincus affichent une silhouette "?" derrière les mêmes barreaux.
10. **Fin de niveau : plus d'enchaînement automatique**. Un nouvel écran intermédiaire (`level-complete-screen`) propose 3 choix : ➡️ Niveau suivant / 🔁 Recommencer ce niveau / 🏠 Menu. (La victoire finale — tous les niveaux battus — garde son propre écran de fin de partie inchangé.)
11. **3 nouvelles images intégrées** : `godzdilla_presentation.png` → `assets/presentation.png` (utilisée comme fond de l'écran d'accueil, remplace l'ancien `decors_start.jpg` qui n'a jamais existé), `decors_MONARCH.jpg` → `assets/decors_prison.jpg`, `barreaux_prison.png` → `assets/barreaux_prison.png` (détourée comme les personnages, fond bleu retiré).

### Testé automatiquement cette session (Playwright headless)
- Chargement complet sans erreur JS (`pageerror`), sur viewport bureau (1112×834) et tablette portrait (834×1112).
- Écran d'accueil avec la nouvelle illustration de présentation.
- Écran "Parc des Kaiju de Monarch" avec cellules à 3 calques (décor + kaiju + barreaux), y compris avec un kaiju marqué comme vaincu de force pour vérifier l'affichage réel.
- Écran de fin de niveau (les 3 boutons apparaissent et sont bien reliés).
- Apparition de l'ennemi derrière les rochers + passage automatique en burning à 3 calculs restants (déclenché en forçant `factsPool` à 2 éléments).

### ⚠️ Ce qui manque encore côté images (bloquant partiellement, comme lors des sessions précédentes)
**Aucune image de kaiju (`assets/kaiju_*.png`) ni de décor de niveau (`assets/decors_*.jpg`) n'est présente dans ce dossier.** Le jeu reste jouable (silhouettes de secours dessinées en code + fond sombre uni), mais pour l'expérience complète il faut déposer dans `assets/` :
- `kaiju_rodan.png`, `kaiju_anguirus.png`, `kaiju_mechagodzilla.png`, `kaiju_gigan.png`, `kaiju_space_godzilla.png`, `kaiju_biollante.png`, `kaiju_destroyah.png`, `kaiju_ghidorah.png`, `kaiju_mothra.png` (fond bleu pur, détourage automatique)
- `decors_rodan.jpg`, `decors_anguirus.jpg`, `decors_mechagodzilla.jpg`, `decors_gigan.jpg`, `decors_space_godzilla.jpg`, `decors_biollante.jpg`, `decors_destroyah.jpg`, `decors_ghidorah.jpg` (images plates, pas de détourage)
- `rayon.png` (rayon normal hors mode burning — seul `rayon_burning.png` a été fourni jusqu'ici)

Rien à changer dans le code : dès que ces fichiers sont déposés avec ces noms exacts, ils sont chargés et utilisés automatiquement.

### Pistes pour une prochaine session (facultatif, pas bloquant)
- Réutiliser `decors_prison.jpg` + `barreaux_prison.png` aussi sur l'écran de capture en fin de niveau (actuellement le kaiju vaincu bascule sur le décor du niveau, pas sur un fond de prison) — cosmétique, pas indispensable.
- Si une image "Mothra" dédiée au combo est ajoutée, vérifier son détourage comme les autres.
- Ajuster finement le timing/l'équilibrage de la maîtrise progressive du burning (nombre de points nécessaires, paliers de durée) une fois testé en classe.

---

## Pour lancer / déployer
Dossier autonome : `index.html` + `style.css` + `game.js` + `assets/`.
- **Test local** : ouvre `index.html` dans un navigateur (double-clic) — tout fonctionne en local, pas de serveur requis.
- **Netlify / GitHub** : glisse tout le dossier tel quel (comme tes autres projets). Aucune dépendance externe à part la police Google Fonts (chargée via CDN, ne bloque pas si hors-ligne, juste une police de secours s'affiche).

## 🔴 Mise à jour du 12/07/2026 — ce qui a changé

### 1. Rayon recalé sur la bouche (corrigé)
Tes nouveaux `godzilla.png` / `godzilla_ouvert.png` font maintenant face à droite (vers l'arène), au lieu de faire face à gauche comme avant. `GODZILLA_MOUTH_REL` a été recalculé automatiquement (détection des pixels de l'intérieur de la bouche sur `godzilla_ouvert.png`) : `{ x: 0.788, y: 0.153 }` au lieu de `{ x: 0.175, y: 0.155 }`. Vérifié par un tir automatisé en rendu : le rayon part exactement de la bouche.

Les fichiers `godzilla_burning.png` et `godzilla_ouvert_burning.png` (renommé `godzilla_burning_ouvert.png` pour correspondre au nom attendu par le code) ont le même cadrage que les versions normales à 1-2px près : la même valeur de `GODZILLA_MOUTH_REL` sert donc pour les 4 variantes.

**⚠️ Un fichier manque encore** : tu n'as renvoyé que `rayon_burning.png` cette fois, pas `rayon.png` (le rayon normal, hors mode burning). J'ai gardé l'ancien `rayon.png` du projet tel quel — vérifie qu'il pointe bien dans le bon sens lui aussi, sinon renvoie-le comme les autres.

### 2. Bug corrigé : le jeu pouvait ne jamais démarrer en local (double-clic)
En testant, j'ai découvert que certains navigateurs (Chrome en particulier) bloquent la lecture des pixels d'une image chargée en `file://` (double-clic, sans serveur) une fois qu'on essaie d'exporter le canvas détouré — une erreur silencieuse qui n'était pas rattrapée, et qui bloquait le chargement indéfiniment (bouton "Affronter" qui restait grisé pour toujours). C'est corrigé : si ça arrive, le jeu retombe sur l'image d'origine (fond bleu visible autour du personnage) plutôt que de bloquer. En ligne (Netlify/GitHub), ce problème ne se produit normalement pas.

### 3. Mode burning : durée liée à l'écart de temps + bonus de score
- Le mode s'active comme avant (2 niveaux rapides et sans faute d'affilée, seuil `BURNING_TIME_THRESHOLD = 10s`), mais sa **durée** dépend maintenant de l'écart entre ton temps et ce seuil :
  - écart < 3s sous le seuil → **10 secondes** de mode burning
  - écart ≥ 3s sous le seuil → **20 secondes** de mode burning
  (valeurs choisies par mes soins puisque tu ne les avais pas précisées — modifiables via `BURNING_GAP_BIG`, `BURNING_DURATION_SHORT`, `BURNING_DURATION_LONG` en haut de `game.js`)
- C'est un vrai décompte en temps réel : le mode s'éteint tout seul à l'échéance, et chaque niveau rapide/propre supplémentaire pendant que le mode est actif **relance** le décompte. Un niveau raté casse la série (il faudra 2 niveaux rapides pour rallumer le mode) mais n'éteint plus le burning en cours brutalement — il continue jusqu'à son échéance naturelle.
- **Aucun chiffre de compte à rebours n'est affiché** pour ce mode (uniquement le badge "🔥 BURNING" allumé/éteint), pour ne jamais ajouter de pression chronométrée en plus du chrono de niveau déjà existant.
- **Bonus de score en burning** : chaque cristal correct rapporte +5 points immédiats (popup "+5 🔥" au point d'impact), et le bonus de rapidité de fin de niveau est multiplié par ×1.5.

### 4. Kaijus inconnus jusqu'à la première victoire (+ niveaux rejouables)
- Sur l'écran d'accueil, chaque niveau non encore vaincu affiche "❓" et "???" à la place du nom — le kaiju reste un mystère tant que tu ne l'as pas affronté.
- Dès qu'un kaiju est vaincu une première fois, son nom et une vignette de son image apparaissent définitivement sur l'écran d'accueil (sauvegardé dans le navigateur via `localStorage`, donc ça persiste après rechargement de la page).
- Les niveaux déjà vaincus sont **cliquables directement depuis l'écran d'accueil** pour les rejouer et améliorer le score, sans repasser par les niveaux précédents.
- Un nouveau bouton **🏠 Menu** est apparu sur l'écran de fin de partie (victoire ou défaite) pour revenir à l'accueil et choisir un niveau à rejouer, sans être obligé de tout relancer depuis le niveau 1.

## Ce qui manque encore (bloquant partiellement)
**`assets/kaiju_biollante.png` et `assets/kaiju_destroyah.png` n'existent pas** — les fichiers ont disparu de tes pièces jointes en cours de route. En attendant, les niveaux 6 (Biollante) et 7 (Destoroyah) affichent une silhouette de secours dessinée en code (forme sombre + yeux rouges) au lieu du vrai kaiju. Le jeu reste jouable, rien ne casse.

**Pour activer les vraies images** : dépose simplement les fichiers dans `assets/` en les nommant exactement `kaiju_biollante.png` et `kaiju_destroyah.png` (même fond bleu pur que les autres). Rien d'autre à changer dans le code — le détourage se fait automatiquement au chargement.

## Choix techniques (suite à tes réponses)
- **Godzilla** : un seul design (pas de 4 paliers visuels). Le rayon et le halo changent quand même de couleur selon le palier (blanc-bleu → bleu → bleu-violet → rouge-orangé) grâce à une teinte appliquée en code sur `rayon.png`, sans avoir besoin d'images supplémentaires.
- **Combo Mothra** : 3 bonnes réponses d'affilée en moins de 10 secondes retirent 1 faute au compteur du niveau en cours (testé et validé, actif à tous les niveaux, pas seulement celui de Mothra).
- **Décors** : `decors_1.jpg` sert à la fois à l'écran de démarrage et au niveau 1 (Mothra) comme tu l'as précisé. `decors_1_bis.jpg` sert de secours si une image de décor venait à manquer ou ne pas charger.
- **`space_godzilla.png`** n'a pas été utilisé (il n'était pas dans le tableau des 8 niveaux du plan) — dis-moi si tu veux l'intégrer quelque part (bonus niveau 9 ? easter egg ?).

## Si le rayon ne part pas exactement de la bouche
La position de sortie du rayon est réglée par une estimation visuelle dans `game.js` :
```js
const GODZILLA_MOUTH_REL = { x: 0.788, y: 0.153 };
```
Ce sont des fractions (largeur, hauteur) de l'image affichée. Si le rayon part un peu à côté de la bouche, ajuste ces deux valeurs (par petits pas de 0.01-0.02) et recharge la page — pas besoin de toucher au reste.

## Ce qui a été testé automatiquement (Playwright/Chromium headless)
- Génération des faits + leurres : les 8 tables × 10 facteurs ont chacun exactement 1 bonne réponse et 3 leurres uniques positifs — 0 anomalie.
- Chargement complet en `file://` (double-clic) sans blocage, avec les nouveaux fichiers Godzilla/rayon — bug de blocage détecté et corrigé (voir point 2 ci-dessus).
- Tir simulé avec capture d'écran : le rayon part bien du point exact de la bouche sur les nouvelles images.
- Mode burning forcé en test : badge "🔥 BURNING" affiché correctement, rayon et Godzilla incandescents affichés, popup "+5 🔥" au point d'impact.
- Écran d'accueil : les 8 niveaux affichent "❓ / ???" au premier chargement ; après avoir marqué un niveau comme vaincu, son nom + vignette apparaissent, et cet état survit à un rechargement de page (localStorage).
- Clic sur un niveau vaincu depuis l'accueil : lance directement ce niveau (vérifié via `currentLevelIndex`).
- Bouton "Affronter le niveau X" : reflète bien le prochain niveau non vaincu (testé avant/après reload).

## Non testé (à faire de ton côté)
- Le déroulé complet d'une partie jusqu'à la victoire finale (niveau 8) n'a pas pu être rejoué cette fois-ci car les images des kaijus/décors ne faisaient pas partie de tes pièces jointes de cette mise à jour (silhouettes de secours utilisées à la place, comportement normal).
- Le ressenti exact du timing d'entrée/sortie du mode burning (10s vs 20s) et l'équilibrage du bonus +5/×1.5 sont à valider en jouant vraiment — dis-moi si tu veux ajuster ces chiffres.
- Un passage manuel de ta part sur quelques niveaux, avec de vraies souris/tactile, reste recommandé avant utilisation en classe.

