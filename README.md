# Godzilla : Protocole Titan — README

## Pour lancer / déployer
Dossier autonome : `index.html` + `style.css` + `game.js` + `assets/`.
- **Test local** : ouvre `index.html` dans un navigateur (double-clic) — tout fonctionne en local, pas de serveur requis.
- **Netlify / GitHub** : glisse tout le dossier tel quel.

## Assets nécessaires : AUCUNE nouvelle image
Cette version réutilise entièrement les assets déjà déposés pour la version « tables de multiplication ». Copie simplement le dossier `assets/` de ce projet-là (ou tes fichiers d'origine) à côté de ces 3 fichiers :

| Fichier attendu | Utilisé pour |
|---|---|
| `godzilla.png`, `godzilla_ouvert.png`, `rayon.png` | Godzilla + rayon (inchangés) |
| `kaiju_mothra.png` | Chapitre 1 |
| `kaiju_rodan.png` | Chapitre 2 |
| `kaiju_gigan.png` | Chapitre 3 |
| `kaiju_mechagodzilla.png` | Chapitre 4 (final) |
| `decors_1.jpg`, `decors_2.jpg`, `decors_4.jpg`, `decors_5.jpg` | Décors des 4 chapitres |
| `decors_1_bis.jpg` | Décor de secours |

`kaiju_anguirus.png`, `kaiju_biollante.png` (toujours absent), `kaiju_destroyah.png` (toujours absent), `kaiju_ghidorah.png` et `space_godzilla.png` ne sont pas utilisés dans cette version — voir « Pour la suite » plus bas.

## Pourquoi 4 chapitres et pas 8 ?
Le fascicule fourni (« Groupe de besoins 6ème ») donne, en combinant les leçons 1 et 3 comme demandé, exactement **4 duos d'homophones** : à/a, ou/où, son/sont, on/ont. C'est ce nombre qui fixe le nombre de chapitres — pas l'inverse. Ils sont rangés de la difficulté la plus simple à la plus complexe :

1. **à / a** (Mothra) — la distinction la plus intuitive (le test « avait » saute aux yeux).
2. **ou / où** (Rodan) — même mécanisme de test, mais l'alternative « lieu / question » demande un peu plus de recul.
3. **son / sont** (Gigan) — introduit l'accord sujet-verbe (déterminant vs verbe pluriel).
4. **on / ont** (+ la nuance *on n'*) (Mechagodzilla) — le plus piégeux : pronom vs verbe, avec en prime l'élision de la négation devant une voyelle (« on n'a pas vu »).

## Le récit (cohérent avec le Monsterverse)
Fil narratif : d'anciens ingénieurs d'Apex Cybernetics (et non la société elle-même, dissoute après le scandale de *Godzilla vs Kong*) relancent en sous-main le programme Mechagodzilla. Chaque chapitre est une phrase du combat, **dans l'ordre du récit** — les phrases ne sont jamais mélangées, sinon l'histoire perdrait son fil.

- **Ch.1 Mothra** — un Titan gardien manipulé malgré lui ; Godzilla ne le combat pas pour le tuer, il le libère.
- **Ch.2 Rodan** — la piste remonte à un fournisseur ; premiers indices d'« augmentation biomécanique ».
- **Ch.3 Gigan** — premier prototype cybernétique d'Apex ; découverte d'une taupe à l'intérieur de Monarch.
- **Ch.4 Mechagodzilla** — révélation finale, combat le plus dur, mode Burning.

Gigan et Mechagodzilla (version Toho classique) ne sont pas des Titans officiellement apparus dans les films Legendary — je les ai traités comme des Titans capturés puis augmentés par Apex, ce qui reste cohérent avec l'univers sans contredire aucun film. Si tu préfères t'en tenir strictement aux Titans déjà vus à l'écran, dis-le-moi.

## Mécaniques nouvelles
- **Cristaux-mots** : au lieu d'un nombre, chaque cristal affiche un mot (2 cristaux pour la plupart des duos, 3 pour on/ont/on n'). Taille de police recalculée automatiquement selon la longueur du mot.
- **Chrono** : bonus de rapidité recalibré pour la lecture de phrases (≤25s = 100 pts, ≤35s = 70, ≤50s = 45, ≤70s = 25, sinon 10), pénalité de -5 par faute — inchangé dans l'esprit, juste réajusté pour 8 phrases/chapitre au lieu de 10 calculs.
- **Mode Burning** : bascule automatiquement si la moyenne des 3 derniers temps de réponse CORRECTS passe sous 6 secondes (seuils réglables via `BURNING_WINDOW` / `BURNING_THRESHOLD_SEC` en haut de `game.js`). Rayon et halo passent en **rose/magenta** — la vraie couleur de Godzilla « Évolué » dans *Godzilla x Kong: The New Empire* (2024), pas le rouge classique. +5 points bonus par bonne réponse pendant le mode.
- **Écrans de chapitre** : un écran narratif s'affiche avant chaque combat (texte du fascicule-histoire) et un court texte de transition après chaque victoire, avant le chapitre suivant.
- **Échec + nouvelle tentative** : à 5 fautes, le Titan « s'échappe » — 2 variantes de texte par chapitre, qui alternent à chaque nouvel échec pour ne pas répéter le même texte.
- **Combo Mothra** : identique à la version précédente (3 bonnes réponses en moins de 10s retirent 1 faute), actif à tous les chapitres — j'ai justifié narrativement sa persistance après le chapitre 1 (Mothra libérée continue de veiller).

## Ce qui a été testé automatiquement
- Script Node : structure des 4 niveaux (8 phrases chacun, réponses valides, pas de double-espace, majuscule/ponctuation correctes) — **0 anomalie sur 32 phrases**.
- Vérification manuelle ligne par ligne : chaque phrase testée avec le test de substitution du fascicule (« avait », « ou bien », « étaient », « avaient ») contre la bonne réponse ET les distracteurs, pour confirmer qu'une seule réponse est grammaticalement possible.
- `node --check` : syntaxe JavaScript valide.
- Tous les `getElementById` de `game.js` correspondent à un `id` existant dans `index.html` (28/28).

## Non testé (impossible dans cet environnement)
Impossible d'installer un navigateur headless ici (le CDN de Playwright n'est pas accessible depuis ce sandbox), donc — comme pour la version précédente — **aucun test visuel réel n'a été fait**. À vérifier toi-même avant la classe :
- Calage du rayon sur la bouche de Godzilla (inchangé, mais à revérifier).
- Lisibilité des phrases longues dans le bandeau du haut (police réduite à 25px, sur 1-2 lignes).
- Ressenti du rythme du mode Burning (6s de moyenne sur 3 bonnes réponses — peut-être à assouplir si c'est trop dur à déclencher).
- Le fait que Gigan/Mechagodzilla ne soient pas des Titans « officiels » du Monsterverse — voir plus haut.

## Pour la suite
Les leçons 2, 4, 5, 6, 7, 8, 9 du fascicule ne sont pas exploitées ici (seulement 1 et 3, comme demandé). Anguirus, King Ghidorah et `space_godzilla.png` restent disponibles pour d'éventuels chapitres futurs — et un clin d'œil amusant : SpaceGodzilla vient d'être confirmé au casting du prochain film Monsterverse (*Godzilla x Kong: Supernova*, mars 2027), ce qui pourrait faire un joli teaser en épilogue si ça t'intéresse un jour.
