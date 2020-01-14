

//Génération du board

let widthCase = boards.offsetWidth/options.format[board.level];

for(let line = 0; line < options.format[board.level]; line ++){
    let dline = document.createElement("div");

    dline.classList.add('line');

    for(let column = 0; column < options.format[board.level]; column ++){
        var dcase = document.createElement("div");

        dcase.classList.add('case');

        dcase.dataset.line = line;
        dcase.dataset.column = column;

        dcase.style = 'width:calc('+widthCase+'px - 1.1rem); height:calc('+widthCase+'px - 1.1rem); margin: 0.2rem';
        dcase.addEventListener('click', ClickOnCase);

        dline.appendChild(dcase);
    }
    boards.appendChild(dline);
}

// setInterval(checkWin, 800)
