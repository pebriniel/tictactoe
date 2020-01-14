
var ClickOnCase = function(e){

    let variable = ChangeCaseValue(this);

    if(variable == true){
        this.dataset.player = board.currentPlayer;
        this.classList.add(`case-${board.currentPlayer}`);

        switchJoueur();
        showMessage(``);
        checkWin();

    }
    else{
        if(variable == -2)
        {
            showMessage(`La case n'est plus disponible`);
        }
        else
        {
            showMessage(`La case n'est pas disponible`);
        }
    }

}

var ChangeCaseValue = function(element){
    let format = options.format[board.level];

    //Sélection
    let line = element.dataset.line;
    let column = element.dataset.column;

    if(line < format && column < format){
        if(element.dataset.player == null)
        {
            return true;
        }
        else{
            return -2;
        }
    }
    else{
        return false;
    }
}

var switchJoueur = function(){
    board.currentPlayer = (board.currentPlayer) ? 0 : 1;
}

var showMessage = function(message){
    boardsMessage.innerHTML = message;
}

var checkWin = function(){
    var lines = document.querySelectorAll('.line');
    var scores = {};
    var playerPrevious = 0;

    for(var line = 0; line < lines.length; line ++){

        var carrer = lines[line].querySelectorAll('.case');

        for(var column = 0; column < carrer.length; column ++){

            //Si la case est coché par un joueur
            if(carrer[column].dataset.player != null)
            {
                let joueur = carrer[column].dataset.player;

                InitScoreCheckWin(scores, joueur);

                // || scores[joueur]['scoreColumn'][column] == 0
                if(scores[joueur]['scoreColumn'][column] === undefined){
                    console.log(scores[joueur]['scoreColumn'][column]);
                    scores[joueur]['scoreColumn'][column] = 1;
                    console.log('if 1');
                    console.log(scores);
                }
                else{
                    console.log((column -1));
                    if((column -1 > 0 && scores[joueur]['scoreColumn'][column -1] >= 1) || scores[joueur]['scoreColumn'][column] >= 1){
                        scores[joueur]['scoreColumn'][column]  ++;
                        console.log('if 2');
                    }
                    else if((column -1) >= 0 || column == 0){
                        console.log('else 2');
                        scores[joueur]['scoreColumn'][column] = 0;
                    }
                }


                //Si l'ancien joueur est égal au joueur de la case, c'est que la ligne contient le même symbole.
                if(playerPrevious == joueur){

                    scores[joueur]['scoreLine'] ++;
                }

                // Sinon, on redéfinit le score à 1 et on redéfinit la valeur de playerPrevious
                else{
                    scores[joueur]['scoreLine'] = 1;
                    playerPrevious = joueur;
                }

                //Si le score est égal à 3 alors nous gagnons...
                if(scores[joueur]['scoreLine'] == 3)
                {
                    console.log('win');
                }

                if(scores[joueur]['scoreColumn'][column] == 3)
                {
                    console.log('win');
                }

            }

        }

        // scores = {};

    }


    // SI MA LIGNE > 3

}

var InitScoreCheckWin = function(scores, joueur){
    //si le score du joueur n'est pas définit...
    if(scores[joueur] === undefined){
        scores[joueur] = [];
        scores[joueur]['scoreLine'] = 0;
        scores[joueur]['scoreColumn'] = [];
    }

    return scores;
}
