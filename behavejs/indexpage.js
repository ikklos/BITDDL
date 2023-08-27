// import { readSaveString } from "./playerSaves.js";

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
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
            icon:'info',
            didClose: (toast) => {
                passwordCheck_log();
            }
        })
        return;
    }
    Array.from(document.getElementsByClassName("visible_mainmenu")).forEach(function (element) {
        element.style.visibility = 'hidden'
    })
    Array.from(document.getElementsByClassName("visible_gameframe")).forEach(function (element) {
        element.style.visibility = 'visible'
    })
    Array.from(document.getElementsByClassName("visible_saveframe")).forEach(function (element) {
        element.style.visibility = 'hidden'
    })
}

function checksaves() {
    if (userName == null) {
        Toast.fire({
            title: "请先登录！",
            icon:'info',
            didClose: (toast) => {
                passwordCheck_log();
            }
        })
        return;
    }
    
    Array.from(document.getElementsByClassName("visible_mainmenu")).forEach(function (element) {
        element.style.visibility = 'hidden'
    })
    Array.from(document.getElementsByClassName("visible_gameframe")).forEach(function (element) {
        element.style.visibility = 'hidden'
    })
    Array.from(document.getElementsByClassName("visible_saveframe")).forEach(function (element) {
        element.style.visibility = 'visible'
    })
}

function passwordCheck_log() {
    (async () => { const { value: userValues } = await Swal.fire({
        title: 'Login',
        html: 
        `<input type="text" id="login" class="swal2-input" placeholder="Username">
         <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        focusConfirm: false,
        showDenyButton: true,
        confirmButtonText: '登录',
        denyButtonText:'注册',
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
    if(userValues == 'flag_changepage'){
        return passwordCheck_reg();
    }
    else if(window.userName !== null){
        Swal.fire({
            title: "已经登录了！",
            icon:'info'
        })
    }
    else if (userValues[0] == '' || userValues[1] == '') {
        Swal.fire({
            title: "交卷的时候不能空题哦",
            icon:'info',
            didClose: () => {
                return passwordCheck_log();
            }
        })
        
    } 
    else if(localStorage.getItem(userValues[0]) == null){
        Swal.fire({
            title: "这个用户名还没有注册哦",
            icon:'info',
            didClose: () => {
                return passwordCheck_log();
            }
        })
    }
    else if(localStorage.getItem(userValues[0]) !== userValues[1]){
        Swal.fire({
            title: "密码输入错误！",
            icon:'info',
            didClose: () => {
                return passwordCheck_log();
            }
        })
    }
    else if(localStorage.getItem(userValues[0]) == userValues[1]){
        window.userName = userValues[0];
        document.getElementById("logbutton").style.visibility = 'hidden';
        document.getElementById("regbutton").style.visibility = 'hidden';
        document.getElementById("logged").style.visibility = 'visible';
        document.getElementById("logged").innerHTML = "已登录" + "<br><br>" + "用户名：" + userValues[0];
        Toast.fire({
            title: "登录成功！",
            icon:'info'
        })
    }
    else{
        console.log("error");
    }
    })()
}
function passwordCheck_reg(){
    // console.log("注册界面");
    (async () => { const { value: userValues } = await Swal.fire({
        title: 'Register',
        html: 
        `<input type="text" id="login" class="swal2-input" placeholder="Username">
         <input type="password" id="password" class="swal2-input" placeholder="Password">
         <input type="password" id="password_cfm" class="swal2-input" placeholder="Confirm Password">`,
        focusConfirm: false,
        showDenyButton: true,
        confirmButtonText: '注册',
        denyButtonText:'登录',
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
    if(userValues == 'flag_changepage'){
        return passwordCheck_log();
    }
    else if (userValues[0] == '' || userValues[1] == '' || userValues[2] == '') {
        Swal.fire({
            title: "交卷的时候不能空题哦",
            icon:'info',
            didClose: () => {
                return passwordCheck_reg();
            }
        })
    } 
    else if(userValues[1] !== userValues[2]){
        Swal.fire({
            title: "两次密码不一样哦",
            icon:'info',
            didClose: () => {
                return passwordCheck_reg();
            }
        })
    }
    else if(localStorage.getItem(userValues[0]) !== null){
        Swal.fire({
            title: "看来你已经注册过了",
            icon:'info',
            didClose: () => {
                return passwordCheck_log();
            }
        })
    }
    else if(userValues[1] === userValues[2]){
        localStorage.setItem(userValues[0], userValues[1]);
        console.log("saved!");
        Toast.fire({
            title: "注册成功！",
            icon:'info',
            didClose: () => {
                return passwordCheck_log();
            }
        })
    }
    else{
        console.log("error");
    }
    })()
}






//BGM播放和切换
var bgms = [];
fetch('../BGM/bgmdata.json')
    .then((response) => response.json())
    .then((json) => loadbgms(json));
    //加载bgm
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
    // loaded = true;
    return bgms;
}
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
    bgms[0].volume = 0.3;
    document.removeEventListener('click', startPlayBGM);
    document.removeEventListener('keydown', startPlayBGM);
    return false;
};
let intervalID = setInterval(
    function changeBGM() {
        bgms.forEach((audio, index) => {
            if (window.currentBGM === index) {
                console.log("try to change bgm");
                bgms[window.currentBGM].volume = 0.3;
            }
            if (window.currentBGM !== index) {
                audio.volume = 0;
            }
        });
    }
, 200)


document.body.addEventListener('click', startPlayBGM);
document.body.addEventListener('keydown', startPlayBGM);

if (document.getElementById("startgamebutton")) {
    document.getElementById("startgamebutton").onclick = startgame;
}
if (document.getElementById("loadsavebutton")) {
    document.getElementById("loadsavebutton").onclick = checksaves;
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
if (document.getElementById("home")) {
    document.getElementById("home").onclick = window.showMainMenu;
}

