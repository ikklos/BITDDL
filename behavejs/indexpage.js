
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
function iframeAutoFit(iframeObj){
    setTimeout(
        function(){if(!iframeObj) return;iframeObj.height=(iframeObj.Document?iframeObj.Document.body.scrollHeight:iframeObj.contentDocument.body.offsetHeight);}
    ,200)
}

window.onload = function () {
    iframeAutoFit(document.getElementById('maingameframe'));
    iframeAutoFit(document.getElementById('savelistframe'));
};