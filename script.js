 const num_peças =12 ;
//https://www.youtube.com/watch?v=k1kC8b6t2kg

function disableButtons(restart, giveUp, seeScoreBoard, instruction, submit) { //set true in the button you want to disable
    document.getElementById('restart').disabled = restart;
    document.getElementById('give_up').disabled = giveUp;
    document.getElementById('see_scoreboard').disabled = seeScoreBoard;
    document.getElementById('open_instruction').disabled = instruction;
    document.getElementById('submit').disabled = submit;
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

function drop(ev) {
    ev.preventDefault(); 
    var data = ev.dataTransfer.getData("text");
    var alvoId = ev.target.id;

    if(game.gameState.jogadas < 2*num_peças) { //phase 1
        if (alvoId.substring(0,1) != "j" && game.gameState.colocar_peça(data, alvoId)){
            ev.target.appendChild(document.getElementById(data));
            const peça = document.getElementById(data);
            peça.draggable = false; //bloqueia a peça durnte a fase 1 após ser colocada no tabuleiro
            mensagem('Movimento efetuado com sucesso!');
        } else if (data.substring(0,2) != game.gameState.vez()) {
            mensagem("Espere pela sua vez!");
        } else if (!document.getElementById(data).draggable) {
            mensagem('Não pode mover uma peça já posta no tabuleiro.');             
        } else { mensagem("Jogada inválida!");}

    } else { //phase 2

        if (!game.gameState.piece_to_remove){

            if (alvoId.substring(0,1) == "b" && game.gameState.mover_peça(data, alvoId)) {
                ev.target.appendChild(document.getElementById(data));
                mensagem('Movimento efetuado com sucesso!');
                if (game.gameState.piece_to_remove) { // if there is a piece to remove, waits until the piece is removed
                    mensagem('Fez uma linha, tem de remover uma peça do adversário.');
                }
            } else if (data.substring(0,2) != game.gameState.vez()) {
                mensagem("Espere pela sua vez!");
            } else if( document.getElementById(data).parentNode.id.substring(0,4) == 'fora'){
                mensagem("Não pode mover uma peça já removida do tabuleiro.");
            } else {
                mensagem("Movimento inválido!");
            }

        } else {
            if (data.substring(0,2) == 'j1') {var fora = 'fora2';} else {var fora = 'fora1';} 
            if (alvoId.substring(0,5) == fora){ //sees if the piece was moved to the right place
                if (game.gameState.remover_peça(data)) { //sees if this piece can be removed
                    ev.target.appendChild(document.getElementById(data));
                    mensagem("Peça removida com sucesso!");
                }
            } else {
                mensagem("Tem de retirar uma peça do adversário para o seu espaço.");
            }
        }
    }

    if (game.againstAI && game.gameState.vez() == "j2"){
        // Check before the AI plays in case you beat it
        if(game.gameState.fase >= 2 && game.game_finished()){
            game.end_of_game();
        }

        game.AInextStep();
    }

    if( game.gameState.isNextFase() ) {
        game.mudança();
    }

    if(game.gameState.fase >= 2 && game.game_finished()){
        game.end_of_game();
    }

    // console.log(game.gameState.tabuleiro);
}

var game = new Game();