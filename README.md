# Tic Tac Toe

Tic Tac Toe est un jeu vidéo écrit en javascript et jouable en local et en multijoueur.

C'est un projet créer pour ma pratique et mon éducation.

Ce n'est pas parfait dans la structure et dans le code, mais ça fonctionne !

(C'est mon tout premier projet NodeJS « complet », je suis assez fier de moi, même si ce n'est pas parfait ! :'D' )

Si vous avez des commentaires ou des conseils, n'hésitez pas à en discuter dans les Tickets.

Read this in other languages : [Français](README.md), [English](README.en.md)

### Features

Le jeu est jouable en local dans les modes de jeu suivant : 3x3, 5x5, 7x7

Playable online, with a game history and a mode replay for being better at the next game.
Il est aussi jouable en multijoueur avec un historique de vos parties et un mode replay qui vous permettra de revoir vos actions et de devenir meilleurs pour vos prochaines parties !

Le mode multijoueur est réservé aux membres inscrits !

## Installation

Vous aurez besoin de NodeJS et d'un serveur MySQL ou Maria DB.

Tout d'abord, l'installation du serveur, déplacez-vous dans le dossier server/ et exécutez la commande suivante :

```bash
npm install
```

Créez une nouvelles bases de données et importez y le fichier database.sql qui se trouve dans le dossier server/

Dernière étape, créer votre fichier d'environnement. Copier/coller le fichier .env.exemple et remplacer les placeholders par vos identifiants de connexion.

Maintenant, vous pouvez démarrer le serveur et vous entrainez ! Si par hasard, vous utilisez ce projet pour lancer de l'e-sport autour de ce jeu, appelez moi, je veux voir ça ! ahah.

Il n'est pas nécessaire de compiler le front/ pour faire fonctionner le project, sauf si vous voulez y modifier le scss/js présent.

Pour ça, déplacez-vous dans le dossier front/ et exéctuez les commandes suivants :

```bash
npm install
npm run gulp
```

## Upgrades

Il manque des options, comme la possibilité de jouer avec les modes 5x5 et 7x7 en Multjoueur. La serveur gère déjà ces modes de jeu, mais c'est sur la recherche de partie qu'il manque des détails.

Ce qu'il manque aussi, c'est dans la lecture du replay, de pouvoir lire action par action plutôt que de tout voir s'afficher en un coup comme actuellement.
