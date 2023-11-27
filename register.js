function register(nick, password) {
    if (typeof nick === 'string' && typeof password === 'string' && nick.trim() != "" && password.trim() != "") { //checks if nick and password are non empty strings
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://twserver.alunos.dcc.fc.up.pt:8008/register', true)
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) { //success
                console.log(JSON.parse(xhr.responseText));
                document.getElementById('form_zone').style.display = 'none';
                document.getElementById('logged').innerHTML = 'Logged: <br>' + nick;  
                disableButtons(true,true,true,false,false);
                logged = true;
            }
            if(xhr.readyState == 4 && xhr.status != 200) //state != 200
                console.log(JSON.stringify({error: "User registered with a different password"}));
        }
        xhr.send(JSON.stringify({nick: nick, password: password}));
    }
    else
        return console.log(JSON.stringify({error: 'Nick and Password should be Strings'}));
}
