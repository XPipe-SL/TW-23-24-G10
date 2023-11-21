class Game {
    constructor(j1, j2) {
        this.restore(j1,j2);
    }

    restore (j1, j2) {
        if (j1 === undefined && j2 === undefined) {
			j1 = "black";
            j2 = "white";
        }

        if (j1 === 'Preto') {
            j1 = "black";
            j2 = "white";
        } else if (j1 === 'Branco') {
            j1 = "white";
            j2 = "black";
        }

		let colunas = parseInt(document.getElementById('comprimento').value);
		let linhas = parseInt(document.getElementById('altura').value);

        this.colunas = colunas;
        this.linhas = linhas;

        this.gameState = new GameState(linhas, colunas, (new Tabuleiro(linhas, colunas)).tabuleiro1);

        // this.tabuleiro_desenho = new Tabuleiro(this.linhas, this.colunas);
        this.fora_j1 = new Fora(true);
        this.fora_j2 = new Fora(false);
        //this.peças_j1 = num_peças;
        //this.peças_j2 = num_peças;

        var r = document.querySelector(':root');
        r.style.setProperty('--j1', j1);
        r.style.setProperty('--j2', j2);
		
        // this.tabuleiro = this.tabuleiro_desenho.tabuleiro1;
        /*this.jogadas = 0;
        this.fase = 1;
        this.piece_to_remove = false;
        this.last_posj1 = new Array(2);
        this.last_posj2 = new Array(2);*/

        if (document.getElementById("ia").checked){
            this.againstAI = true;
            this.GameAI = new gameAI();
        }
        else { this.againstAI = false; }

        this.difficulty = 0;
        let diff = document.getElementById("nivel").value;
        if (diff == "Amador"){
            this.difficulty = 1;
        }else if (diff == "Profissional"){
            this.difficulty = 2;
        }
    }

    //non-main

    /*vez() { //checks how has to play
        if (this.jogadas % 2 == 0) {return 'j1';}
        else {return 'j2';}
    }*/

    mudança() { //detects the end of phase 1
        for(var i=0; i<num_peças; i++){
            const peçaj1 = document.getElementById("j1" + (i + 1));
            const peçaj2 = document.getElementById("j2" + (i + 1));
            const fora1 = document.getElementById('fora1');
            const fora2 = document.getElementById('fora2');
            peçaj1.setAttribute("draggable", "true");
            peçaj2.setAttribute("draggable", "true");
        }
        const fora1 = document.getElementById('fora1');
        const fora2 = document.getElementById('fora2');
        fora1.setAttribute("ondrop", "drop(event)"); 
        fora1.setAttribute("ondragover", "allowDrop(event)");
        fora2.setAttribute("ondrop", "drop(event)"); 
        fora2.setAttribute("ondragover", "allowDrop(event)");
        //console.log('fase 2');
        this.gameState.fase++;
    }

    game_finished(){
        let finished = this.gameState.game_finished();

        if (finished == 1){
            
            if (!this.againstAI) {
                mensagem("O jogador 2 ganhou! Para jogar de novo reinicie o jogo.");
                fim_mensagem("Parabéns jogador 2, ganhaste!")
            } else {
                mensagem("A máquina ganhou! Para jogar de novo reinicie o jogo.");
                fim_mensagem("A máquina ganhou!");
                this.update_classifications(this.j2);
            }
            openEnd();
            return true;
            
        }

        if (finished == 2){
            mensagem("O jogador 1 ganhou! Para jogar de novo reinicie o jogo.")
            fim_mensagem("Parabéns jogador 1, ganhaste!")
            this.update_classifications(this.j1);
            openEnd();
            return true;
        }

        return false;
    }

    desistir() { 
        if(this.gameState.vez() == 'j1') {
            mensagem("O jogador 1 desistiu! Se quiser jogar reinicie o jogo!");
            fim_mensagem("O jogador 1 desistiu! \n" + "Parabéns jogador 2, ganhaste!");
        } else {
            mensagem('O jogador 2 desistiu! Se quiser jogar reinicie o jogo!');
            fim_mensagem("O jogador 2 desistiu! \n " + "Parabéns jogador 1, ganhaste!");
        }
        for(var i=0; i<num_peças; i++){
            const peçaj1 = document.getElementById("j1" + (i + 1));
            const peçaj2 = document.getElementById("j2" + (i + 1));
            peçaj1.setAttribute("draggable", "false");
            peçaj2.setAttribute("draggable", "false");
        }
        openEnd();
    }

    end_of_game(){
        for(var i=0; i<num_peças; i++){
            const peçaj1 = document.getElementById("j1" + (i + 1));
            const peçaj2 = document.getElementById("j2" + (i + 1));
            peçaj1.setAttribute("draggable", "false");
            peçaj2.setAttribute("draggable", "false");
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
        // [2]: piece id
        // [3]: removed piece id (if it applies)
        let movement = new Array(4);

        switch ( this.difficulty ) {
            
            case 1:
                movement = miniMaxNextStep( this.gameState, 5);
                break;

            case 2:
                movement = miniMaxNextStep( this.gameState, 7);
                break;

            default:
            case 0:
                movement = randomNextStep( this.gameState );
                break;
        }

        // Phase 1
        if (movement[0]==0) {
            mensagem("A AI colocou a peça na linha " + movement[1].substring(1,2) + " e na coluna " + movement[1].substring(2,3) + ".");
        
        // Phase 2
        } else {
            let lastline = document.getElementById(movement[2]).parentNode.id.substring(1,2);
            let lastcolumn = document.getElementById(movement[2]).parentNode.id.substring(2,3);

            // No piece was removed
            if (movement[0]==1) {
                mensagem("A AI moveu a peça da posição (" + lastline + "," + lastcolumn + ") para ("+ movement[1].substring(1,2) + "," +  movement[1].substring(2,3) + ").")
            
            // A piece was removed
            } else {
                mensagem("A AI fez linha movendo a peça da posição (" + lastline + "," + lastcolumn + ") para ("+ movement[1].substring(1,2) + "," +  movement[1].substring(2,3) + ") e removeu uma peça da posição (" + document.getElementById( movement[3] ).parentNode.id.substring(1,2) + "," +  document.getElementById( movement[3] ).parentNode.id.substring(2,3) + ").");
                document.getElementById( "fora2" ).appendChild( document.getElementById(movement[3]) );
            }

            document.getElementById( movement[1] ).appendChild( document.getElementById(movement[2]) );
        }

        document.getElementById( movement[1] ).appendChild( document.getElementById(movement[2]) );
    }

}