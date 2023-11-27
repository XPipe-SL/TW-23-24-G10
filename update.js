var data;

function update(nick, gameReference) {
    url = 'http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=' + encodeURIComponent(nick) + '&game=' + encodeURIComponent(gameReference);
    const eventSource = new EventSource(url);
    eventSource.onmessage = function(event) {
        data = JSON.parse(event.data);
        console.log(data);
        if(data.board) {
            game.turnOn();
            const nickColour = data.players.nick;
            game.setPlayerPiece(nickColour);
        }
        
    }

}

