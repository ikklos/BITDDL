
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

function showMainMenu() {
    document.getElementById("startgamebutton").style.visibility = 'visible';
    document.getElementById("loadsavebutton").style.visibility = 'visible';
    document.getElementById("maingameframe").style.visibility = 'hidden';
    document.getElementById("savelistframe").style.visibility = 'hidden';
}
