// import { readSaveString } from "./playerSaves.js";

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 900,//(?)
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})



function startgame() {
    if (userName == null) {
        Toast.fire({
            title: "请先登录！",
            icon: 'info',
            didClose: (toast) => {
                passwordCheck_log();
            }
        })
        return;
    }
    window.showGameFrame();
}

function checksaves() {
    if (userName == null) {
        Toast.fire({
            title: "请先登录！",
            icon: 'info',
            didClose: (toast) => {
                passwordCheck_log();
            }
        })
        return;
    }
    window.showSaveFrame();
}
let tmp_regusr = "";
// 用于注册后自动填入登录信息
function passwordCheck_log() {
    let inner_html = "";
    if(tmp_regusr !== null){
        inner_html = '<input type="text" id="login" class="swal2-input" placeholder="Username" value="' +
        tmp_regusr +
        '"> <input type="password" id="password" class="swal2-input" placeholder="Password">'
    }
    else{
        inner_html = `<input type="text" id="login" class="swal2-input" placeholder="Username">
        <input type="password" id="password" class="swal2-input" placeholder="Password">`
    }
    
    (async () => {
        
        const { value: userValues } = await Swal.fire({
            title: 'Login',
            html: inner_html,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText: '登录',
            denyButtonText: '> 注册 <',
            showLoaderOnConfirm: true,
            preDeny: () => {
                return 'flag_changepage';
            },
            preConfirm: () => {
                return [
                    document.getElementById('login').value,
                    document.getElementById('password').value
                ]
            }
        })
        
        if (userValues == 'flag_changepage') {
            return passwordCheck_reg();
        }
        else if (window.userName !== null) {
            Swal.fire({
                title: "已经登录了！",
                icon: 'info'
            })
        }
        else if (userValues[0] == '' || userValues[1] == '') {
            Swal.fire({
                title: "交卷的时候不能空题哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })

        }
        else if (localStorage.getItem(userValues[0]) == null) {
            Swal.fire({
                title: "这个用户名还没有注册哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else if (localStorage.getItem(userValues[0]) !== userValues[1]) {
            Swal.fire({
                title: "密码输入错误！",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else if (localStorage.getItem(userValues[0]) == userValues[1]) {
            window.userName = userValues[0];
            document.getElementById("logbutton").style.visibility = 'hidden';
            document.getElementById("regbutton").style.visibility = 'hidden';
            document.getElementById("logged").style.visibility = 'visible';
            document.getElementById("logged").innerHTML = "已登录" + " " + "用户名：" + userValues[0];
            Toast.fire({
                title: "登录成功！",
                icon: 'info'
            })
        }
        else {
            console.log("error");
        }
    })()
}
function passwordCheck_reg() {
    // console.log("注册界面");
    tmp_regusr = "";
    (async () => {
        const { value: userValues } = await Swal.fire({
            title: 'Register',
            html:
                `<input type="text" id="login" class="swal2-input" placeholder="Username">
         <input type="password" id="password" class="swal2-input" placeholder="Password">
         <input type="password" id="password_cfm" class="swal2-input" placeholder="Confirm Password">`,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText: '注册',
            denyButtonText: '> 登录 <',
            showLoaderOnConfirm: true,
            preDeny: () => {
                return 'flag_changepage';
            },
            preConfirm: () => {
                return [
                    document.getElementById('login').value,
                    document.getElementById('password').value,
                    document.getElementById('password_cfm').value
                ]
            }
        })
        console.log(userValues[0]);
        console.log(userValues[1]);
        console.log(userValues[2]);
        if (userValues == 'flag_changepage') {
            return passwordCheck_log();
        }
        else if (userValues[0] == '' || userValues[1] == '' || userValues[2] == '') {
            Swal.fire({
                title: "交卷的时候不能空题哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_reg();
                }
            })
        }
        else if (userValues[1] !== userValues[2]) {
            Swal.fire({
                title: "两次密码不一样哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_reg();
                }
            })
        }
        else if (localStorage.getItem(userValues[0]) !== null) {
            Swal.fire({
                title: "看来你已经注册过了",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else if (userValues[1] === userValues[2]) {
            localStorage.setItem(userValues[0], userValues[1]);
            console.log("saved!");
            tmp_regusr = userValues[0];
            Toast.fire({
                title: "注册成功!",
                icon: 'info',
                didClose: () => {
                    Toast.fire({
                        title: "正在跳转到登录界面！",
                        icon: 'info',
                        didClose: () => {
                            return passwordCheck_log();
                        }
                    })
                }
            })
            
        }
        else {
            console.log("error");
        }
    })()
}
















//BGM播放和切换
var bgms = [];
let currentVolume = 0.3;
let currentBGM_played = 0;
let bgm_num = 0;

function loadbgms(bgmpack) {
    let Array = bgmpack.bgms;
    let len = Array.length;
    bgms = [len];
    bgm_num = len;
    for (let i = 0; i < len; i++) {
        bgms[i] = document.createElement("audio");
        bgms[i].setAttribute("loop", Array[i].loop);
        bgms[i].setAttribute("preload", Array[i].preload);
        bgms[i].setAttribute("type", Array[i].type);
        bgms[i].setAttribute("src", Array[i].src);
        bgms[i].name = Array[i].name;
        document.body.appendChild(bgms[i]);
    }
    // loaded = true;
    return bgms;
}

fetch('../BGM/bgmdata.json')
    .then((response) => response.json())
    .then((json) => loadbgms(json)).then(() =>{
    //加载bgm

let bgmStarted = false;
const startPlayBGM = () => {
    if (bgmStarted) {
        return true;
    }
    console.log("bgm start!");
    bgms.forEach(function(element){
        console.log("init volume");
        element.volume = 0;
        element.play();
    })
    bgmStarted = true;
    bgms[0].volume = currentVolume;
    document.removeEventListener('click', startPlayBGM);
    document.removeEventListener('keydown', startPlayBGM);
    return false;
};

setInterval(
    () =>  {
        
        // 切换bgm
        if (window.currentBGM !== currentBGM_played) {
            bgms.forEach((audio, index) => {
                // console.log(window.currentBGM);
                if (window.currentBGM === index) {
                    console.log("try to change bgm");
                    bgms[window.currentBGM].volume = currentVolume;
                    bgms[window.currentBGM].play();
                }
                if (window.currentBGM !== index) {
                    audio.volume = 0;
                }
            });
            currentBGM_played = window.currentBGM;
        }
        if(bgms[window.currentBGM].paused){
            document.getElementById("audio_pause").innerHTML = `<img src="./icon/symbolButton/buttonSymbols76.png">`
        }
        else{
            document.getElementById("audio_pause").innerHTML = `<img src="./icon/symbolButton/buttonSymbols81.png">`
        }
        // console.log(bgms[window.currentBGM].name);
        document.getElementById("audio_name").innerHTML = bgms[window.currentBGM].name;
    }
, 500)
document.body.addEventListener('click', startPlayBGM);
document.body.addEventListener('keydown', startPlayBGM);

let bgm_volume = document.querySelector(".audio_volume");
console.log("add");
console.log(bgm_num);
bgm_volume.addEventListener("input", changeVoice);
function changeVoice(e) {
    bgms[window.currentBGM].volume = e.srcElement.value;
    currentVolume = e.srcElement.value;
}
// 音量控件按钮
if (document.getElementById("audio_last")) {
    document.getElementById("audio_last").onclick = () => {
        if (window.currentBGM == 0) {
            window.currentBGM = bgm_num - 1;
        }
        else{
            window.currentBGM--;
        }
};}
if (document.getElementById("audio_pause")) {
    document.getElementById("audio_pause").onclick = async () => {
        if (bgms[window.currentBGM].paused) {
            await bgms[window.currentBGM].play();
        }
        else if(bgms[window.currentBGM].played){
            await bgms[window.currentBGM].pause();
        }
};}
if (document.getElementById("audio_next")) {
    document.getElementById("audio_next").onclick = () => {
        console.log(window.currentBGM);
        if (window.currentBGM == bgm_num - 1) {
            window.currentBGM = 0;
        }
        else{
            window.currentBGM++;
        }
    }
}
});




function bodyScale() {
    let devicewidth = document.documentElement.clientwidth;
    let deviceheight = document.documentElement.clientHeight;
    var scalex = devicewidth / 1200;
    var scaley = deviceheight / 880;
    scalex <= scaley ? document.body.style.zoom = scalex : document.body.style.zoom = scaley;

}
bodyScale();








if (document.getElementById("startgamebutton")) {
    document.getElementById("startgamebutton").onclick = startgame;
}
if (document.getElementById("tab_game")) {
    document.getElementById("tab_game").onclick = startgame;
}
if (document.getElementById("loadsavebutton")) {
    document.getElementById("loadsavebutton").onclick = checksaves;
}
if (document.getElementById("tab_loadsave")) {
    document.getElementById("tab_loadsave").onclick = checksaves;
}
if (document.getElementById("logbutton")) {
    document.getElementById("logbutton").onclick = passwordCheck_log;
}
if (document.getElementById("regbutton")) {
    document.getElementById("regbutton").onclick = passwordCheck_reg;
}
if (document.getElementById("aboutbutton")) {
    document.getElementById("aboutbutton").onclick = window.showAbout;
}
if (document.getElementById("tab_about")) {
    document.getElementById("tab_about").onclick = window.showAbout;
}
if (document.getElementById("tab_home")) {
    document.getElementById("tab_home").onclick = window.showMainMenu;
}


