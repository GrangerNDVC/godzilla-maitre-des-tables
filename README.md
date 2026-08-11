# Godzilla : Protocole Titan — README (v2.2)

## Dernier correctif : l'écran de chapitre restait affiché au lancement
Le bouton « ⚔️ Affronter [Titan] » démarrait bien la partie derrière (chrono lancé, phrase chargée), mais **oubliait de cacher l'écran de texte** — d'où l'impression que rien ne se passait, alors que le jeu tournait déjà en dessous. Une vraie régression introduite en réorganisant l'écran de chapitre en 3 boutons (Continuer / Recommencer / Menu) : le chemin "Continuer depuis l'intro" n'appelait jamais la fonction qui masque l'écran. Corrigé, et vérifié qu'aucun autre bouton n'a le même oubli (les 3 autres passaient déjà tous par la fonction centralisée qui gère l'affichage).

## 4 chapitres au total, mais oui, ils se débloquent bien un par un
Pour être bien claire cette fois — deux choses différentes :
- **Le total est fixé à 4** (à/a, ou/où, son/sont, on/ont) et ne grandira pas tout seul : c'est tout le contenu des leçons 1 et 3 du fascicule, comme tu l'avais demandé au départ. Il n'y a pas de 5ᵉ chapitre caché qui apparaîtra un jour.
- **Mais à l'intérieur de ces 4**, oui : ton intuition est correcte. Le chapitre 2 (Anguirus) reste verrouillé (🔒 sur l'accueil) tant que tu n'as pas fini le chapitre 1 (Rodan), le chapitre 3 tant que le 2 n'est pas fini, etc. Une fois un chapitre gagné, il reste débloqué pour toujours et rejouable à volonté (accueil ou Dossiers Monarch).

Si tu veux que le total grandisse vraiment (jusqu'à 8, avec d'autres leçons du fascicule), dis-le-moi — je détaille comment dans le README précédent, ça reste disponible si tu veux qu'on s'y mette.

## Testé
- `node --check` : syntaxe valide.
- Script de contrôle : 44 `getElementById()` tous présents, 33 classes toutes stylées, structure des 4 niveaux/32 phrases sans anomalie.
- Relecture manuelle de chaque transition d'écran (accueil → intro → combat → victoire → chapitre suivant / fin de partie → menu) pour confirmer qu'aucune autre ne laisse un écran affiché par erreur.

## Non testé
Toujours pas de navigateur disponible ici pour un vrai test visuel — merci de re-tester le lancement du chapitre 1 en premier.
