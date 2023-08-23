function startgame() {
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("maingameframe").style.visibility = 'visible';
}

//BGM播放和切换
let bgm = document.getElementById("bgm");
function playMusic() {
    bgm.play();
}
let bgmStarted = false;
const startPlayBGM = () => {
    if (bgmStarted||bgm.Readys){
        return;
    }
    bgm.volume = 0.2;
    bgmStarted = true;
    playMusic();
    document.removeEventListener('click', startPlayBGM);
    document.removeEventListener('keydown', startPlayBGM);
};
document.addEventListener('click', startPlayBGM);
document.addEventListener('keydown', startPlayBGM);


// const changeBGM = (num) => {

// }