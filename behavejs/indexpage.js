
//BGM播放和切换
var bgms = [];
fetch('../BGM/bgmdata.json')
    .then((response) => response.json())
    .then((json) => loadbgms(json));

function loadbgms(bgmpack) {

    let Array = bgmpack.bgms;
    let len = Array.length;
    bgms = [len];
    for (let i = 0; i < len; i++) {
        bgms[i] = document.createElement("audio");
        bgms[i].setAttribute("loop", Array[i].loop);
        bgms[i].setAttribute("preload", Array[i].preload);
        bgms[i].setAttribute("type", Array[i].type);
        bgms[i].setAttribute("src", Array[i].src);
        document.body.appendChild(bgms[i]);
    }
    return bgms;
}
let bgmStarted = false, bgmNum = 0;
const startPlayBGM = () => {
    if (bgmStarted) {
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
function changeBGM(num, bgms) {
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
export { bgms, changeBGM };