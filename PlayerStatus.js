class PlayerStatus {
    constructor(nick, password) {
        this.nick = nick;
        this.password = password;
        this.logged = false;
        this.game;
        this.register(nick, password);
    }

    register(nick, password) { //nick password
        if (typeof nick === 'string' && typeof password === 'string' && nick.trim() != "" && password.trim() != "") { //checks if nick and password are non empty strings

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://twserver.alunos.dcc.fc.up.pt:8008/register', true)
            xhr.onreadystatechange = function() {

                if(xhr.readyState == 4 && xhr.status == 200) { //success
                    console.log(JSON.parse(xhr.responseText));
                    document.getElementById('form_zone').style.display = 'none';
                    document.getElementById('logged').innerHTML = 'Logged: <br>' + nick;  
                    disableButtons(true,true,false,false);
                    this.logged = true;
                }

                if(xhr.readyState == 4 && xhr.status != 200) //nick and password dont match
                    console.log(JSON.parse(xhr.responseText));

            }
            xhr.send(JSON.stringify({nick: nick, password: password}));
        }
        else
            return console.log(JSON.stringify({error: 'Nick and Password should be Strings'}));
    }
    
    join(linhas, colunas) { //group nick password size
        this.size = JSON.parse('{"rows":' + linhas + ', "columns": ' + colunas + '}');
    
        fetch('http://twserver.alunos.dcc.fc.up.pt:8008/join', {
            method: 'POST',
            headers: {'Content-type': 'application/json'}, 
            body: JSON.stringify({ group: 10, nick: this.nick, password: this.password, size: this.size })
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('join: ups');
            }
        })
        .then((data) => {
            console.log(data);
            this.game = JSON.parse(data).game;
            disableButtons(false, false, false, true);
            this.update();
        });
    }

    notify(row, column) { //nick password game move
        const move = JSON.parse('{"row": ' + row + ', "column": ' + column + '}');
        
        fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ nick: this.nick, password: this.password, game: this.game, move: move})
        })
        .then((response) => {
            if (response.ok) {
                return response.json().then(data => {
                    console.log(data);
                })
            } else {
                return response.json().then(data => {
                    console.log('error:', data);
                })
            }
        })
        .then((data) => {
            console.log(data);
        })
    }

    update() { //nick game
        const url = 'http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=' + encodeURIComponent(this.nick) + '&game=' + encodeURIComponent(this.game);
        const eventSource = new EventSource(url);
        var searching = true;
        var piece = 1;
        var fromrow;
        var fromcolumn;
        var pieceMoved=false;
        var pieceRemoved=false;

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            
            if('board' in data) { //game starts
                
                if(searching) { //when game is found

                    for (let names in data.players) {
                        if (names != this.nick)
                            this.oponnent = names;        
                    }

                    if (data.turn == this.nick)
                        game.turnOn(3,1);
                    else
                        game.turnOn(3,2);

                    searching = false;

                } else { //every time we make a move
                    if((data.phase == 'drop') || (data.phase == 'move' && game.gameState.fase == 1)) { //phase 1

                        let row = data.move.row + 1;
                        let column = data.move.column + 1;

                        if (!document.getElementById('b' + row + column).hasChildNodes()) {
                            game.gameState.tabuleiro[row][column] = game.gameState.turn;
                            document.getElementById('b' + row + column).appendChild(document.getElementById(game.gameState.turn + piece));
                            piece++;
                            game.gameState.switchTurn();
                        }

                        // Phase change handling
                        if (data.phase == 'move') {
                            game.mudança();
                        }

                    } else if (data.phase == 'move') { //phase 2
                        if (pieceMoved) {
                            // Update data
                            let torow = data.move.row+1;
                            let tocolumn = data.move.column+1;

                            game.gameState.tabuleiro[fromrow][fromcolumn] = undefined;
                            game.gameState.tabuleiro[torow][tocolumn] = 'j2';

                            let toblocoId = 'b'+torow+tocolumn;
                            let fromblocoId = 'b'+fromrow+fromcolumn;
                            let peça = document.getElementById(fromblocoId).firstChild;
                            changeBlockColor(toblocoId, 'green');
                            mensagem(this.oponnent + " moveu a peça do bloco amarelo para o verde.");

                            document.getElementById(toblocoId).appendChild(peça);
                            pieceMoved = false;
                        }

                        if (data.turn == this.nick) {
                            if (data.step == 'from') {
                                // If the other player removed our piece
                                if (pieceRemoved) {
                                    let removeRow = data.move.row+1;
                                    let removeColumn = data.move.column+1;
                                    let removeblocoId = 'b'+removeRow+removeColumn;
                                    let peça = document.getElementById(removeblocoId).firstChild;
                                    changeBlockColor(removeblocoId, 'red');
                                    mensagem(this.oponnent + " removeu uma peça sua.");

                                    document.getElementById( "fora2" ).appendChild( peça );
                                    game.gameState.tabuleiro[removeRow][removeColumn] = undefined;
                                    game.gameState.peças_j1--;
                                    pieceRemoved = false;
                                }

                                game.gameState.switchTurn();
                            }
                        }

                        if (data.turn == this.oponnent) {

                            // The other player is selecting
                            if (data.step == 'to') {
                                fromrow = data.move.row+1;
                                fromcolumn = data.move.column+1;
                                let blocoId = 'b'+fromrow+fromcolumn;
                                changeBlockColor(blocoId, 'yellow');
                                mensagem(this.oponnent + " selecionou a peça do bloco amarelo.");
                                pieceMoved = true; 
                            }

                            // The other player has moved, and has taken our piece
                            if (data.step == 'take') {
                                mensagem(this.oponnent + " fez uma linha, movendo do bloco amarelo para o verde.");
                                pieceRemoved = true;
                            }
                        }
                    }
                }

                this.board = data.board;
                
            } else if ('winner' in data) { //end of game

                if (data.winner == this.nick) {
                    fim_mensagem('Você ganhou!');
                    game.timer.stop();
                    openEnd();                   
                } else if (data.winner == this.oponnent && this.oponnent != null) {
                    fim_mensagem(this.oponnent + ' ganhou!');
                    game.timer.stop();
                    openEnd();
                } else { //not joinned
                    disableButtons(true,true,false,false);
                    game.restore();
                }
                eventSource.close();
            } else if ('error' in data) {
                console.log;
            }
        }
    }

    leave() {
        fetch('http://twserver.alunos.dcc.fc.up.pt:8008/leave', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({nick: this.nick, password: this.password, game: this.game})
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('leave: ups');
            }
        })
        .then((data) => {
            console.log('leave: ' + data);
        })
    }

}

