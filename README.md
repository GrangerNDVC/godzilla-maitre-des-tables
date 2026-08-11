# Godzilla : Protocole Titan — README (v2.1)

## Les 4 points que tu as remontés

### 1. « Apex Cybernetics » mal inséré dans la phrase — corrigé
Bug CSS classique : la ligne de texte était en `display:flex`, et un `<b>` au milieu d'une phrase coupe alors le texte en plusieurs blocs indépendants (icône / texte avant / mot en gras / texte après) qui se mettent CHACUN à la ligne de leur côté, au lieu de former un seul paragraphe qui s'enroule normalement. C'est aussi ce qui explique l'anneau orange qui semblait "planté" dans le texte sur ta capture : c'est en fait le viseur en croix du jeu, qui n'aurait jamais dû s'afficher sur un écran de menu (voir point 4).

Corrigé en regroupant tout le texte de chaque ligne dans un seul `<span class="lore-text">` — plus aucun risque qu'un mot en gras casse la mise en page, ici ou ailleurs.

### 2. Seulement 4 chapitres sur 8 attendus — **c'est normal, pas un contenu qui débloquera plus tard**
Ta consigne de départ ("combine les leçons 1 et 3 afin d'avoir le bon nombre de niveaux") donne très exactement **4 duos d'homophones** dans ce fascicule : à/a, ou/où, son/sont, on/ont. Il n'y a pas de 5ᵉ, 6ᵉ, 7ᵉ ou 8ᵉ duo caché quelque part dans les leçons 1 et 3 — donc pas de "niveau verrouillé qui débloquera plus tard" : ces 4 chapitres sont le jeu complet pour ce périmètre.

**Si tu veux vraiment 8 chapitres** (pour matcher visuellement le jeu de tables), je peux ajouter 4 chapitres de plus en piochant dans les leçons 2, 4, 5, 6, 7, 8 ou 9 du même fascicule (ça/sa, dans/d'en, et/est, ce/se, ces/ses, c'est/s'est, la/là/l'a, leur/leurs, tout/tous, quel/qu'elle, peu/peut/peux, mais/mes/mets...) — j'ai déjà tout lu, je peux les intégrer avec SpaceGodzilla, Biollante, Destroyah et Ghidorah (les 4 Titans de ta liste que je n'utilise pas encore). Dis-moi juste lesquelles tu veux et dans quel ordre.

### 3. Le jeu ne se lançait pas
Je n'ai pas pu reproduire ça moi-même (toujours pas de navigateur disponible dans cet environnement), donc j'ai fait deux choses :
- **Élargi le filet de sécurité** : tout le traitement d'une image (pas seulement le détourage) est maintenant protégé par un seul `try/catch`, et surtout — nouveau — **si le chargement des images n'est pas terminé au bout de 8 secondes pour une raison quelconque, le jeu démarre quand même** plutôt que de laisser le bouton "Affronter" grisé indéfiniment. Ça ne peut plus rester bloqué pour de bon, même si je n'ai pas pu identifier la cause exacte.
- **Supprimé la requête `/favicon.ico`** (ajout d'une favicon vide) — mais attention, cette erreur-là est **sans rapport** avec le blocage : elle apparaît sur quasiment tous les sites/pages locales qui n'ont pas d'icône définie, et n'empêche jamais une page de fonctionner. Je l'ai quand même retirée pour que la console reste propre.

**Si ça bloque encore après ce correctif** : ouvre la console (F12 → Console) au moment où tu cliques sur "Affronter", et dis-moi s'il y a un message **autre** que celui du favicon — en particulier une ligne en rouge avec "Uncaught" ou "SecurityError". C'est ce qui me manque pour trouver la vraie cause si le filet de sécurité ne suffit pas.

### 4. L'ordre des Titans — corrigé, désolée pour l'oubli
J'avais relu ton fichier de référence mais j'étais passée à côté de cette note, en toutes lettres tout en haut de ton `game.js` :
> « Mothra n'est PAS un adversaire caché dans un cristal — elle reste la gardienne bienveillante, donc elle est sortie de cette liste. »

Corrigé : **Mothra n'est plus un chapitre**. Elle n'apparaît plus que comme gardienne (le combo "3 bonnes réponses d'affilée", avec un petit survol animé maintenant, comme un clin d'œil). Les 4 chapitres sont désormais :

| Chapitre | Duo | Titan |
|---|---|---|
| 1 | à / a | **Rodan** |
| 2 | ou / où | **Anguirus** |
| 3 | son / sont | Gigan |
| 4 | on / ont | Mechagodzilla |

J'ai réécrit les phrases des chapitres 1 et 2 en conséquence (cadre volcanique pour Rodan, carrière rocheuse pour Anguirus — plus aucune mention de l'île Infant ni de Mothra comme adversaire), revérifiées une à une avec le même test de substitution que la première fois. Gigan et Mechagodzilla ne changent pas.

## Autre correctif au passage : le viseur sur les menus
En creusant le bug n°1, j'ai remarqué que le viseur en croix du jeu (fait pour viser les cristaux) s'affichait aussi sur TOUS les écrans, y compris les menus — remplaçant purement et simplement le curseur normal même pour cliquer un bouton. Corrigé : il ne s'affiche plus que pendant un combat actif ; partout ailleurs (accueil, chapitre, Dossiers Monarch, règles, rangs, fin de partie), c'est le curseur normal.

## Assets — noms de fichiers mis à jour
Tes décors sont maintenant nommés par Titan (comme dans ta dernière version des tables), pas par numéro :

| Fichier attendu | Chapitre |
|---|---|
| `kaiju_rodan.png` + `decors_rodan.jpg` | 1 |
| `kaiju_anguirus.png` + `decors_anguirus.jpg` | 2 |
| `kaiju_gigan.png` + `decors_gigan.jpg` | 3 |
| `kaiju_mechagodzilla.png` + `decors_mechagodzilla.jpg` | 4 |
| `kaiju_mothra.png` | gardienne (jamais un niveau) |
| `godzilla.png`, `godzilla_ouvert.png`, `rayon.png` | inchangés |
| `decors_1_bis.jpg` | décor de secours |

Optionnels (repli automatique si absents) : `presentation.png`, `godzilla_burning.png`, `godzilla_burning_ouvert.png`, `rayon_burning.png`.

## Testé automatiquement
- `node --check` : syntaxe valide.
- 44 `getElementById()` → tous présents dans le HTML ; 33 classes CSS utilisées → toutes stylées.
- Script de contrôle dédié : plus aucun résidu de l'ancienne config (Mothra en niveau, décors numérotés).
- Les 16 phrases des chapitres 1 et 2 repassées une à une au test de substitution (bonne réponse ET distracteur affichés côte à côte) — 0 anomalie.
- Les 4 niveaux / 32 phrases repassés dans le script de vérification structurelle globale — 0 anomalie.

## Non testé
Toujours pas de navigateur disponible dans cet environnement pour un vrai test visuel. Le filet de sécurité à 8s devrait éviter tout blocage définitif, mais je n'ai pas pu confirmer à l'œil que l'accueil s'affiche maintenant correctement, ni que le viseur se comporte bien comme attendu. Merci de tester en premier, avant toute autre chose.
