const Board = require('./board.js');
const Player = require('./player.js');
const Interactive = require('./interactive.js');

// variables = [[1,1,0],[0,1,1],[0,1,1]];
//
// lastPlayer = null, score = 0;
// for(i = 0; i < 3; i ++){
//     score = 1;
//     for(line of variables){
//         console.log(line[i]);
//         if(line[i] != lastPlayer){
//             score = 1;
//             lastPlayer = line[i];
//             console.log('init joueur');
//         }
//         else{
//             console.log('addscore');
//             score ++;
//         }
//
//         if(score == 3){
//             console.log('victoire'+score+' '+i);
//             break;
//             // return true;
//         }
//     }
//     console.log(score);
// }
// //test ligne par ligne
// for(line of variables){
// let valeur = null;
// result = line.every( (val, i, arr) => {
//     if(val === arr[0]){
//         valeur = val;
//         return val + 1;
//     }
//     else{
//         return false;
//     }
//
// });
// if(result){
//     console.log(valeur);
//     break;
// }
// }

const Game = class {

    constructor() {
        this._joueurs = [];
        this._currentPlayer = 0;
        this._level = 0;

        this._format = {
            0: 3, // 3x3
            1: 5 // 5x5
        };
    }

    init(){
        this._board = new Board();
        this._board.generateBoard(this.getLevel(), this.getFormat(this.getLevel()));

        this._interactive = Interactive;
        this._interactive.init(this);
    }

    addPlayer(username = 'player'){
        const player = new Player();

        player.setUsername(username);

        this._joueurs.push(player);
    }

    // Si player est égal à false, on renvoie la valeur brute de la variables
    // sinon, on renvoie les données du joueurs
    currentPlayer(player = false){
        if(player){
            return this._joueurs[this._currentPlayer];
        }

        return this._currentPlayer;
    }

    alternatePlayer(){
        this._currentPlayer = (this._currentPlayer) ? 0 : 1;
    }

    getLevel(){
        return this._level;
    }

    getBoard(){
        return this._board;
    }

    getFormat(val = 0){
        if(this._format[val] != undefined){
            return this._format[val];
        }
        return 0;
    }

    getFormats(){
        return this._format;
    }

    getInteractive(){
        return this._interactive;
    }
}

module.exports = Game;
