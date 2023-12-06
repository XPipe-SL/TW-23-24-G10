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
                    mensagem("O jogador 2 ganhou! Para jogar de novo reinicie o jogo.");
                    fim_mensagem("Parabéns jogador 2, ganhaste!");
                } else {
                    mensagem("A máquina ganhou! Para jogar de novo reinicie o jogo.");
                    fim_mensagem("A máquina ganhou!");
                    this.update_classifications(this.j2);
                }
                this.timer.stop();
                openEnd();
                return true;
            }, time);
        }
    
        if (finished == 2){
            setTimeout(() => {
                mensagem("O jogador 1 ganhou! Para jogar de novo reinicie o jogo.")
                fim_mensagem("Parabéns jogador 1, ganhaste!")
                this.update_classifications(this.j1);
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

    update_classifications(name){
        var points = Math.abs(this.gameState.peças_j1-this.gameState.peças_j2);
        var table = document.getElementById("tab_clas");
        var rows = table.rows;
        var changed = false;
        /*go throug list and see if name is already in it*/
        for (var i = 1; i < (rows.length); i++) {
            var name_cell= rows[i].getElementsByTagName("TD")[1].innerHTML;
            if (name==name_cell) {
                changed = true;
                /*check if points are higher than before*/
                var old_points = rows[i].getElementsByTagName("TD")[2].innerHTML;
                if (points>old_points) {
                    /*change points*/
                    rows[i].getElementsByTagName("TD")[2].innerHTML = points;
                }
            }
        }
        if (!changed) { /*means, name wasnt in table jet*/
            /*add row to table (is inserted as the first row)*/
            var new_row = table.insertRow(1);
            var cell1 = new_row.insertCell(0);
            var cell2 = new_row.insertCell(1);
            var cell3 = new_row.insertCell(2);

            cell1.innerHTML = "0";
            cell2.innerHTML = name;
            cell3.innerHTML = points;
        }

        /*sort the table in decrecing order of points*/
        var switching = true;
        var shouldSwitch;
        while (switching) {
            switching = false;
            rows = table.rows;
            for (var i = 1; i < (rows.length - 1); i++) {
              shouldSwitch = false;
              /* Get the two elements you want to compare,
              one from current row and one from the next: */
              var x = rows[i].getElementsByTagName("TD")[2];
              var y = rows[i + 1].getElementsByTagName("TD")[2];
              // Check if the two rows should switch place:
              if (x.innerHTML < y.innerHTML) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
            if (shouldSwitch) {
              /* If a switch has been marked, make the switch
              and mark that a switch has been done: */
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
            }
          }

          /*make numeration right*/
          for (var i = 1; i < (rows.length - 1); i++) {
            rows[i].getElementsByTagName("TD")[0].innerHTML = i;
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