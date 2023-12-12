class Game {
    constructor() {
        this.j1;
        this.j2;
        this.timer = new Timer();
        this.restore(this.j1,this.j2);
    }

    restore (j1, j2) {
        if (j1 === undefined) {
			this.j1 = "black";
            this.j2 = "white";
        } else if (j1 === 'Preto') {
            this.j1 = "black";
            this.j2 = "white";
        } else if (j1 === 'Branco') {
            this.j1 = "white";
            this.j2 = "black";
        }
        
        this.colunas = parseInt(document.getElementById('comprimento').value);
        this.linhas = parseInt(document.getElementById('altura').value);

        this.gameState = new GameState(this.linhas, this.colunas, (new Tabuleiro(this.linhas, this.colunas)).tabuleiro1);

        this.fora_j1 = new Fora(true);
        this.fora_j2 = new Fora(false);

        var r = document.querySelector(':root');
        r.style.setProperty('--j1', this.j1);
        r.style.setProperty('--j2', this.j2);

        this.againstAI = document.getElementById("ia").checked;

        this.difficulty = 0;
        let diff = document.getElementById("nivel").value;
        if (diff == "Amador"){
            this.difficulty = 1;
        }else if (diff == "Profissional"){
            this.difficulty = 2;
        }
    }

    submitChanges() {
        this.restore(document.getElementById('cor').value);
        closeEnd();
        disableButtons(false,false,false,true);
        if(this.againstAI) { //we turn on the game
            this.turnOn(3);  
            this.gameState.turn = 'j1';
        }   
        else //we sent info to server
            this.login.join(parseInt(document.getElementById('altura').value), parseInt(document.getElementById('comprimento').value));
    }

    turnOn(player, turn) {
        if(!document.getElementById("ia").checked) {
            if(turn == 1) this.gameState.turn = 'j1';
            else this.gameState.turn = 'j2';
        }
        if(player == 1 || player == 3) 
            this.fora_j1.dragPieces('j1');
        if(player == 2 || player == 3) 
            this.fora_j2.dragPieces('j2');
        this.timer.stop();
        this.timer.start();
    }

    playerStatus(nick, password) {
        this.login = new PlayerStatus(nick, password);
    }

    mudança() { //changes the atributes to phase 2
        for(var i=0; i<num_peças; i++) { 
            const peça1 = document.getElementById("j1" + (i + 1));
            const peça2 = document.getElementById("j2" + (i + 1));
            peça1.removeAttribute('ondragstart');
            peça1.removeAttribute('draggable');
            peça1.setAttribute("onclick", "select(event)");
            peça2.removeAttribute('ondragstart');
            peça2.removeAttribute('draggable');
            peça2.setAttribute("onclick", "select(event)");
        }

        for(var linha = 1; linha<=this.linhas; linha++) {
			for(var coluna = 1; coluna<=this.colunas; coluna++) {
				const bloco = document.getElementById("b"+linha+coluna);
				bloco.removeAttribute("ondrop"); 
                bloco.removeAttribute("ondragover");
			}
		}
    }

    game_finished(finished, time){
        if (finished === undefined)
            var finished = this.gameState.game_finished();
        
        if (finished == 1){
            setTimeout(() =>{
                if (!this.againstAI) {
                    mensagem(this.login.oponnent + " ganhou!");
                    fim_mensagem(this.login.oponnent + " ganhou!");
                } else {
                    mensagem("A máquina ganhou! Para jogar de novo reinicie o jogo.");
                    fim_mensagem("A máquina ganhou!");
                }
                this.timer.stop();
                openEnd();
                return true;
            }, time);
        }
    
        if (finished == 2){
            setTimeout(() => {
                mensagem("Parabéns, ganhaste! Para jogar de novo reinicie o jogo.")
                fim_mensagem("Parabéns, ganhaste!")
                this.timer.stop();
                openEnd();
                return true;
            }, time);
        }
        return false;
    }

    desistir() {
        this.timer.stop();
        if(this.againstAI) {
            mensagem("Você desistiu! Para jogar de novo submeta de novo");
            fim_mensagem("Você desistiu! \n" + "A máquina ganhou!");
            openEnd();
        } else {
            this.login.leave();
        }  
    }   


    update_classifications(data) {
        var table = document.getElementById("tab_clas");
        var rows = table.rows;
        var ranking = data.ranking;

        for(let i=rows.length - 1; i>0; i--) {
            table.deleteRow(i);
        }

        for(let i=0; i<ranking.length; i++) {
            var new_row = table.insertRow(1);
            var cell1 = new_row.insertCell(0);
            var cell2 = new_row.insertCell(1);
            var cell3 = new_row.insertCell(2);
            var cell4 = new_row.insertCell(3);
            var cell5 = new_row.insertCell(4);

            cell1.innerHTML = "0";
            cell2.innerHTML = ranking[i].nick;
            cell3.innerHTML = ranking[i].games;
            cell4.innerHTML = ranking[i].victories;
            var ratio = ranking[i].victories / ranking[i].games * 100
            cell5.innerHTML = Math.floor(ratio);//ratio win/games
        }

        var n = rows.length;
        for (let i = 1; i < n; i++) {
            for (let j = 1; j < n - i ; j++) {
                var x = parseFloat(rows[j].cells[4].innerHTML);
                var y = parseFloat(rows[j + 1].cells[4].innerHTML);
                var xx = parseFloat(rows[j].cells[2].innerHTML);
                var yy = parseFloat(rows[j + 1].cells[2].innerHTML);

                if (y > x || (y == x && yy > xx)) {
                    rows[j].cells[0].innerHTML = j + 1;
                    rows[j + 1].cells[0].innerHTML = j;
                    rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
                } else {
                    rows[j].cells[0].innerHTML = j;
                    rows[j + 1].cells[0].innerHTML = j + 1;
                }
            }
        }
    }

    AInextStep(){
        // Movement
        // [0]: 0: fase 1, 1: fase 2, 2: removal
        // [1]: block id
        // [2]: piece id (case 0) or last block id of piece
        // [3]: removed piece block id
        let movement = new Array(4);

        switch ( this.difficulty ) {
            
            case 1:
                movement = miniMaxNextStep( this.gameState, 1);
                break;

            case 2:
                movement = miniMaxNextStep( this.gameState, 3);
                break;

            default:
            case 0:
                movement = randomNextStep( this.gameState );
                break;
        }

        // Phase 1
        if (movement[0]==0) {
            mensagem("A AI colocou a peça na linha " + movement[1].substring(1,2) + " e na coluna " + movement[1].substring(2,3) + ".");
            document.getElementById( movement[1] ).appendChild( document.getElementById( movement[2] ) );
        
        // Phase 2
        } else {            
            document.getElementById( movement[1] ).appendChild( document.getElementById( movement[2] ).firstChild );
            // No piece was removed
            if (movement[0]==1) {
                changeBlockColor(movement[2], 'yellow');
                changeBlockColor(movement[1], 'green');
                mensagem("A AI moveu a peça do bloco amarelo para o verde.")
            
            // A piece was removed
            } else {
                // blocks player pieces to wait for ai play
                blockPieceMovement(1);
                setTimeout(function() {enablePieceMovement(1)}, 1800);
                changeBlockColor(movement[2], 'yellow', 1500);
                changeBlockColor(movement[1], 'green', 1500);
                mensagem("A AI fez uma linha, movendo do bloco amarelo para o verde.");
                setTimeout(() => {
                    document.getElementById( "fora2" ).appendChild( document.getElementById(movement[3]).firstChild );
                    changeBlockColor(movement[3], 'red');
                    mensagem('A AI removeu uma peça sua.');
                    this.timer.stop();
                    this.timer.start();
                }, 1500);
                //mensagem("A AI fez linha movendo a peça da posição (" + movement[2].substring(1,2) + "," + movement[2].substring(2,3) + ") para ("+ movement[1].substring(1,2) + "," +  movement[1].substring(2,3) + ") e removeu uma peça da posição (" + movement[3].substring(1,2) + "," +  movement[3].substring(2,3) + ").");
            }

        }
    }

}