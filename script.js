const num_peças =12 ;
//https://www.youtube.com/watch?v=k1kC8b6t2kg

function disableButtons(restart, giveUp, seeScoreBoard, instruction, submit) { //set true in the button you want to disable
    document.getElementById('restart').disabled = restart;
    document.getElementById('give_up').disabled = giveUp;
    document.getElementById('see_scoreboard').disabled = seeScoreBoard;
    document.getElementById('open_instruction').disabled = instruction;
    document.getElementById('submit').disabled = submit;
}

function changeBlockColor(blocoId, color, time) {
    const bloco = document.getElementById(blocoId);

    bloco.style.backgroundColor = color;
    if(time !== undefined) {   
        setTimeout(function() {
            bloco.style.backgroundColor = 'dimgray';
        }, time);
    }
}

function blockPieceMovement(time) {
    for(var i=0; i<num_peças; i++) { 
        const peça1 = document.getElementById("j1" + (i + 1));
        const peça2 = document.getElementById("j2" + (i + 1));
        peça1.setAttribute("onclick", "");
        peça2.setAttribute("onclick", "");
    }

    setTimeout(function() {
        for(var i=0; i<num_peças; i++) { 
            const peça1 = document.getElementById("j1" + (i + 1));
            const peça2 = document.getElementById("j2" + (i + 1));
            peça1.setAttribute("onclick", "select(event)");
            peça2.setAttribute("onclick", "select(event)");
        }
    }, time);
}

function openInstruction() {
    var instruction = document.getElementById("instruções");
    document.getElementById('main').style.display = 'none';
    instruction.style.display = 'block';
}

function closeInstruction() {
    var instruction = document.getElementById("instruções");
    document.getElementById('main').style.display = 'flex';
    instruction.style.display = 'none';
}

function openEnd(){
    var fim = document.getElementById("fim");
    fim.style.width = (document.getElementById('tab_main').offsetWidth - 26) + 'px';
    fim.style.height = (document.getElementById('tab_main').offsetHeight - 26) + 'px';
    document.getElementById('tab_main').style.display = 'none';
    disableButtons(false,true,false,true,true);
    fim.style.display = 'flex';
}

function closeEnd(cor) {
    var fim = document.getElementById("fim");
    game.restore(cor);
    disableButtons(false,false,false,false,false);
    fim.style.display = 'none';
    mensagem("Jogo reiniciado.");
    document.getElementById('tab_main').style.display = 'flex';
}

function openClassificações(){
    var classificações = document.getElementById("classificações");
    classificações.style.display = "flex";
}

function closeClassificações(){
    var classificações = document.getElementById("classificações");
    classificações.style.display = "none";
}

function mensagem(text) {
    document.getElementById('mensagens').innerText = text;
}

function fim_mensagem(text) {
    document.getElementById('fim_inner').innerText = text;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);

}

function drop(ev) { //phase 1
    ev.preventDefault(); 
    var data = ev.dataTransfer.getData("text");
    var alvoId = ev.target.id;

    if (alvoId.substring(0,1) != "j" && game.gameState.colocar_peça(data, alvoId)){ 
        ev.target.appendChild(document.getElementById(data));
        const peça = document.getElementById(data);
        peça.draggable = false; //bloqueia a peça durnte a fase 1 após ser colocada no tabuleiro
        mensagem('Movimento efetuado com sucesso!');

    } else if (data.substring(0,2) != game.gameState.vez()) { //not is turn
        mensagem("Não pode mover uma peça do oponente!");

    } else if (!document.getElementById(data).draggable) { //can't move a piece already in the board
        mensagem('Não pode mover uma peça já posta no tabuleiro.');        

    } else { mensagem("Jogada inválida!");} //non valid play

    if (game.againstAI && game.gameState.vez() == "j2") //ai next step
        game.AInextStep();

    if(game.gameState.isNextFase())  //checks next fase
        game.mudança();
    
}

function select(event) { //phase 2
    resetBlocos();
    event.preventDefault();
    const peça = event.target;
    if(!game.gameState.piece_to_remove) { //no piece to remove

        if (peça.parentNode.id.substring(0,4) == 'fora'){ //if the piece is outside
            mensagem("Não pode mover uma peça já removida do tabuleiro.");

        } else if (peça.id.substring(0,2) != game.gameState.vez()) { //if not his turn
            mensagem("Não pode mover um peça do oponente!");

        } else { //if is possible
            const possibleMovs = game.gameState.getAvailableMovementsPiece(peça.id.substring(0,2), peça.parentNode.id); //possible moves for the selected piece
            console.log(peça.id, possibleMovs);
            for (let i=0; i<possibleMovs.length; i++) {
                const bloco = document.getElementById(possibleMovs[i]);
                changeBlockColor(bloco.id, 'green');
                bloco.setAttribute('onclick', 'move(event,"' + peça.id + '")');
            }
        }       
    } else { //remove a piece
        if (peça.id.substring(0,2) == 'j1') {var fora = document.getElementById('fora2');} else {var fora = document.getElementById('fora1');} 
        if (game.gameState.remover_peça(peça.parentNode.id)) { 
            fora.appendChild(peça);
            peça.setAttribute('onclick','');
            mensagem("Peça removida com sucesso!");
            proceedPhase2();
        } else {
            mensagem("Tem de retirar uma peça do adversário para o seu espaço.");
        }
    }
}

function move(event, peçaId) { //phase 2
    event.preventDefault();
    const blocoAlvo = event.target;
    const blocoOrigem = document.getElementById(peçaId).parentNode;
    if (game.gameState.mover_peça(blocoOrigem.id, blocoAlvo.id)) {
        blocoAlvo.appendChild(document.getElementById(peçaId));
        mensagem('Movimento efetuado com sucesso!');
        resetBlocos();
        if (game.gameState.piece_to_remove) { // if there is a piece to remove, waits until the piece is removed
            mensagem('Fez uma linha, tem de remover uma peça do adversário.');
        } else {
            proceedPhase2();
        }
    } else {
        mensagem("Movimento inválido!");
    }
}

function proceedPhase2() {
    
    if (game.againstAI && game.gameState.vez() == "j2") { //against ai  
        
        if(game.game_finished()) //checks if you won
            game.end_of_game();

        game.AInextStep(); //ai next play

        if(game.game_finished()) //checks if ai won
            game.end_of_game();
    }
}

function resetBlocos() { 
    linhas = game.linhas;
    colunas = game.colunas;
    for(let i=1; i<=linhas; i++) {
        for(let j=1; j<=colunas; j++) {
            const bloco = document.getElementById("b" + i + j);
            changeBlockColor(bloco.id, 'dimgray');
            bloco.setAttribute('onclick', '');
        }
    }
}

var game = new Game();