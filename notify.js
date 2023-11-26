function notify() {


    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://twserver.alunos.dcc.fc.up.pt:8008/notify', true);
    xhr.onreadystatechange = function() {

    }
    xhr.send(JSON.stringify({nick: nick, password: password, game: data.game}));
}