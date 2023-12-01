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

    notify(row, column, pieceId) { //nick password game move
        const move = JSON.parse('{"row": ' + row + ', "column": ' + column + '}');
        
        fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({ nick: this.nick, password: this.password, game: this.game, move: move})
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('notify: ups');
            }
        })
        .then((data) => {
            console.log(data);
        })
    }

    update() { //nick game
        const url = 'http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=' + encodeURIComponent(this.nick) + '&game=' + encodeURIComponent(this.game);
        const eventSource = new EventSource(url);
        var started = true;
        var piece = 1;
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            
            if('board' in data) { //game starts
                
                if(started) { //when game is finded

                    for (let names in data.players) {
                        if (names != this.nick)
                            this.oponnent = names;        
                    }

                    if(data.players[this.nick] == 'black') {
                        if(data.turn == this.nick)
                            game.turnOn(1, 1);
                        else
                            game.turnOn(1,2);
                    }
                    if(data.players[this.nick] == 'white') {
                        if(data.turn == this.nick)
                            game.turnOn(2, 2);
                        else
                            game.turnOn(2, 1);
                    }
                    started = false;

                } else { //every time we make a move
                    console.log(game.gameState.turn);
                    for (let i=0; i<this.board.length; i++) {
                        for (let j=0; j<this.board[0].length; j++) {
                            if (data.board[i][j] != this.board[i][j]) {
                                const peça = document.getElementById('j1' + piece).id;
                                if(game.gameState.turn == 'j1')
                                    document.getElementById('b' + (i + 1) + (j + 1)).appendChild(document.getElementById('j1' + piece));
                                else    
                                    document.getElementById('b' + (i + 1) + (j + 1)).appendChild(document.getElementById('j2' + piece));
                                piece++;
                            }
                        }
                    }
                }
                this.board = data.board;
                
            
            } else if ('winner' in data) { //end of game

                if (data.winner == this.nick) {
                    fim_mensagem('Você ganhou!');
                    openEnd();                   
                } else if (data.winner == this.oponnent && this.oponnent != null) {
                    fim_mensagem(this.oponnent + ' ganhou!');
                    openEnd();
                } else { //not joinned
                    disableButtons(true,true,false,false);
                    game.restore();
                }
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

