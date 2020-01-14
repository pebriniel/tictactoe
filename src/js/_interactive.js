
var Interactive = {


    //Si le joueur clique sur une case
    ClickOnCase: function(e){

        let variable = Interactive.ChangeCaseValue(this);

        if(variable == true){
            const currentPlayer = Game.currentPlayer();

            this.dataset.player = currentPlayer;
            this.classList.add(`case-${currentPlayer}`);

            Game.alternatePlayer();
            // showMessage(``);
            console.log('ok');
            // checkWin();

        }
        else{
            if(variable == -2)
            {
                console.log('plus disponible');
                // showMessage(`La case n'est plus disponible`);
            }
            else
            {
                console.log('pas disponible');
                // showMessage(`La case n'est pas disponible`);
            }
        }

    },

    //On change les valeurs de la case
    ChangeCaseValue: function(element){
        let format = Game.getFormat(Game.getLevel());

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
}
