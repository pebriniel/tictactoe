# Tic Tac Toe

Tic Tac Toe is a Video Game write in JavaScript and playable in local
and online.

I have made this project for my practice and learning.

It's not perfect, but it runs !

(this is my first project with NodeJS ! I'm proud of myself ! :'D )

If you have a few comments, you can write a commit !

Read this in other languages : [Français](README.md), [English](README.en.md)

### Features

Playable in local with 3x3, 5x5 and 7x7 mode.

Playable online, with a game history and a mode replay for being better at the next game.

The online is reserved to connected users.

## Installation

You needed NodeJS and MySQL or MariaDB.

Move into server/ and execute :

```bash
npm install
```

log into your MySQL/MariaDB server and import database.sql in your new
database created.

Last step, create you environement file ! For that, copy and past .env.exemple and rename your copy in .env and change the placeholder by your identifiants.

Now, you can start your server and training you many months ! If you launch an e-sport competition, call me, i need see this.

You not need compile front folder, except if you change files.

For that, you need move into front/ and execute:

```bash
npm install
npm run gulp
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Upgrades

it lacks options, like the possibility of playing with 5x5 and 7x7 modes in multiplayer. The server already manages these game modes, but it is on the game search that the details are missing.

What it also misses, it is in the reading of the replay, to be able to read action by action rather than to see all being displayed in a blow as currently.
