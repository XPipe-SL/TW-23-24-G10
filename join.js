function join(linhas, colunas) {

    const nick = document.getElementById('nick').value;
    const password = document.getElementById('password').value;
    const size = JSON.parse('{"rows":' + linhas + ', "columns": ' + colunas + '}');

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://twserver.alunos.dcc.fc.up.pt:8008/join', true);
    xhr.onreadystatechange =  function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
            update(nick, JSON.parse(xhr.responseText).game);
        }
    }
    xhr.send(JSON.stringify({group: 10, nick: nick, password: password, size: size}));
}