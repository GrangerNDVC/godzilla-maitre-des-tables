# Godzilla : Maître des Tables — README

## Pour lancer / déployer
Dossier autonome : `index.html` + `style.css` + `game.js` + `assets/`.
- **Test local** : ouvre `index.html` dans un navigateur (double-clic) — tout fonctionne en local, pas de serveur requis.
- **Netlify / GitHub** : glisse tout le dossier tel quel (comme tes autres projets). Aucune dépendance externe à part la police Google Fonts (chargée via CDN, ne bloque pas si hors-ligne, juste une police de secours s'affiche).

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
const GODZILLA_MOUTH_REL = { x: 0.175, y: 0.155 };
```
Ce sont des fractions (largeur, hauteur) de l'image affichée. Si le rayon part un peu à côté de la bouche, ajuste ces deux valeurs (par petits pas de 0.01-0.02) et recharge la page — pas besoin de toucher au reste.

## Ce qui a été testé automatiquement (Playwright/Chromium headless)
- Génération des faits + leurres : les 8 tables × 10 facteurs ont chacun exactement 1 bonne réponse et 3 leurres uniques positifs — 0 anomalie.
- Déroulé complet d'une partie du niveau 1 à la victoire finale (niveau 8) : fonctionne sans erreur JS.
- 5 mauvaises réponses de suite → écran "Attaque repoussée" → bouton "Réessayer ce niveau" → reprend bien à 0 faute / 0 sur 10 sur la même table (pas de retour aux niveaux déjà validés).
- Combo Mothra (1 faute forcée + 3 bonnes réponses rapprochées) → la faute est bien retirée.
- Un bug a été trouvé et corrigé pendant les tests : après la victoire finale, une variable de niveau non protégée provoquait une erreur JS silencieuse en boucle de rendu (corrigé, revalidé).

## Non testé (à faire de ton côté)
Les tests automatisés simulent les clics via le code, pas une vraie souris humaine — je n'ai pas pu vérifier à l'œil le calage visuel exact du rayon sur la bouche, ni le ressenti du timing des animations. Un passage manuel de ta part sur quelques niveaux est recommandé avant utilisation en classe.
