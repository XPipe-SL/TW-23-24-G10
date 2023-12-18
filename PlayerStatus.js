// Stores server url
const server = "http://localhost:8007"

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
            xhr.open('POST', server+'/register', true)
            xhr.onreadystatechange = function() {

                if(xhr.readyState == 4 && xhr.status == 200) { //success
                    //console.log(JSON.parse(xhr.responseText));
                    document.getElementById('form_zone').style.display = 'none';
                    document.getElementById('logged').style.display = 'flex';
                    document.getElementById('logged_inner').innerHTML = 'Logged: <br>' + nick;  
                    
                    disableButtons(true,false,false,false);
                    this.logged = true;
                }

                if(xhr.readyState == 4 && xhr.status != 200) //nick and password dont match
                    console.log(JSON.parse(xhr.responseText));

            }
            xhr.send(JSON.stringify({nick: nick, password: password}));
        }
        else
            return console.log(JSON.stringify({error: 'Nick and Password should be Strings'}));
        this.ranking(6,5);
    }

    logout() {
        
        if(game.againstAI) {
            game.restore();
        } else {
            console.log("Abandonando");
            this.leave();
            console.log("fin");
        }

        console.log("yay");
        
        game.timer.stop();
        document.getElementById("timer").innerHTML = '02:00'; 

        this.nick = undefined;
        this.password = undefined;
        document.getElementById('form_zone').style.display = 'block';
        document.getElementById('logged').style.display = 'none';
        document.getElementById('nick').value = '';
        document.getElementById('password').value = '';

        disableButtons(true,false,false,true);
        this.logged = false;
        closeEnd();
    }
    
    join(linhas, colunas) { //group nick password size
        this.size = JSON.parse('{"rows":' + linhas + ', "columns": ' + colunas + '}');
    
        fetch(server+'/join', {
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
        var revert = false;

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            
            if('board' in data) { //game starts

                if(searching) { //when game is found

                    for (let name in data.players) {
                        if (name != this.nick)
                            this.oponnent = name;        
                    }

                    if (data.turn == this.nick)
                        game.turnOn(3,1);
                    else
                        game.turnOn(3,2);

                    searching = false;
                    mensagem('Jogo encontrado! Está a jogar contra ' + this.oponnent + '.');

                } else { //every time we make a move
                    if((data.phase == 'drop') || (data.phase == 'move' && game.gameState.fase == 1)) { //phase 1

                        let row = data.move.row + 1;
                        let column = data.move.column + 1;
                        let block = document.getElementById('b' + row + column);

                        if (!block.hasChildNodes()) {
                            game.gameState.tabuleiro[row][column] = game.gameState.turn;
                            block.appendChild(document.getElementById(game.gameState.turn + piece));

                            piece++;
                            game.gameState.switchTurn();
                        }

                        // Phase change handling
                        if (data.phase == 'move') {
                            game.mudança();
                        }

                    } else if (data.phase == 'move') { //phase 2

                        if (pieceMoved) { //in from or take phase

                            let torow = data.move.row+1;
                            let tocolumn = data.move.column+1;

                            game.gameState.tabuleiro[fromrow][fromcolumn] = undefined;
                            game.gameState.tabuleiro[torow][tocolumn] = 'j2';

                            let toblocoId = 'b'+torow+tocolumn;
                            let fromblocoId = 'b'+fromrow+fromcolumn;

                            let peça = document.getElementById(fromblocoId).firstChild;
                            changeBlockColor(toblocoId, 'green');
                            document.getElementById(toblocoId).appendChild(peça);

                            mensagem(this.oponnent + " moveu a peça do bloco amarelo para o verde.");

                            pieceMoved = false;
                            
                            
                        }

                        if (data.turn == this.nick) {
                            if (data.step == 'from') {
                                
                                if (pieceRemoved) { // If the other player removed our piece

                                    let removeRow = data.move.row+1;
                                    let removeColumn = data.move.column+1;
                                    let removeblocoId = 'b'+removeRow+removeColumn;
                                    let peça = document.getElementById(removeblocoId).firstChild;
                                    changeBlockColor(removeblocoId, 'red');
                                    document.getElementById( "fora2" ).appendChild( peça );
                                    
                                    mensagem(this.oponnent + " removeu uma peça sua.");

                                    game.gameState.tabuleiro[removeRow][removeColumn] = undefined;
                                    game.gameState.peças_j1--;
                                    pieceRemoved = false;
                                    game.gameState.switchTurn();

                                } else if (game.gameState.tabuleiro[data.move.row+1][data.move.column+1] != 'j1') { //if not revert situation
                                    game.gameState.switchTurn();
                                }

                                revert = false;
                            }   

                            if (data.step = 'to') { 
                                fromrow = data.move.row+1;
                                fromcolumn = data.move.column+1;
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
                                revert = true;
                            }

                            // The other player has moved, and has taken our piece
                            if (data.step == 'take') {
                                mensagem(this.oponnent + " fez uma linha, movendo do bloco amarelo para o verde.");
                                pieceRemoved = true;
                            }

                            if (data.step == 'from' && revert) {
                                changeBlockColor('b' + fromrow + fromcolumn , 'dimgray');
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
                    disableButtons(true,false,false,false);
                    game.restore();
                }
                this.ranking(6, 5);
                eventSource.close();
            } else if ('error' in data) {
                console.log;
            }
        }
    }

    leave() {
        fetch(server+'/leave', {
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

    ranking(linhas, colunas) {
        fetch('http://twserver.alunos.dcc.fc.up.pt:8008/ranking', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({group: 10, size: {rows: linhas, columns: colunas}})
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        })
        .then((data) => {
            game.update_classifications(data);
            console.log(data);
        })
    }
    

}
