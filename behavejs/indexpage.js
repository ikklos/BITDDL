function startgame() {
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("maingameframe").style.visibility = 'visible';
}

//BGM播放和切换
bgms = [document.createElement("audio"), document.createElement("audio"), document.createElement("audio")]
bgms[0].setAttribute("loop", "");
bgms[1].setAttribute("loop", "");
bgms[2].setAttribute("loop", "");
bgms[0].setAttribute("preload", "auto");
bgms[1].setAttribute("preload", "auto");
bgms[2].setAttribute("preload", "auto");
bgms[0].setAttribute("type", "audio/mpeg");
bgms[1].setAttribute("type", "audio/mpeg");
bgms[2].setAttribute("type", "audio/mpeg");
bgms[0].setAttribute("src", "/BGM/駛向水平線的彼方.mp3");
bgms[1].setAttribute("src", "/BGM/Mapleisland.mp3");
bgms[2].setAttribute("src", "/BGM/メインテーマ.mp3");
document.body.appendChild(bgms[0]);
document.body.appendChild(bgms[1]);
document.body.appendChild(bgms[2]);

let bgmStarted = false, bgmNum = 0;
const startPlayBGM = () => {
    if (bgmStarted){
        return true;
    }
    bgms[0].volume = 0.2;
    bgms[1].volume = 0.2;
    bgms[2].volume = 0.2;
    bgmStarted = true;
    bgms[0].play();
    document.removeEventListener('click', startPlayBGM);
    document.removeEventListener('keydown', startPlayBGM);
    return false;
};
function changeBGM (num) {
    bgms.forEach((audio, index) => {
        if (num === index) { 
            bgms[num].volume = 0.2;
            audio.play();
        } 
        if (num !== index) {
            audio.volume = 0;
        }
    });
};

document.body.addEventListener('click', startPlayBGM);
document.body.addEventListener('keydown', startPlayBGM);


