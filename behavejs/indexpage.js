
function startgame() {
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("maingameframe").style.visibility = 'visible';
}

function checksaves() {
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("savelistframe").style.visibility = 'visible';
}

if (document.getElementById('startgamebutton'))
    document.getElementById('startgamebutton').onclick = startgame;
if (document.getElementById('loadsavebutton'))
    document.getElementById('loadsavebutton').onclick = checksaves;
