# Godzilla : Maître des Tables — README

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

