import { CrossTheBoader, HitTest, getHitBox, getPartHitBox } from "./collision.js";
import { keyboard } from './keyboard.js';
import { SetMap } from "./MapSet.js";

//创建app对象，把预览加入DOM,app对象建议开全局
//修改画布 使得人物与背景大小匹配 1000*600 => 960*576
var app = new PIXI.Application({ width: 960, height: 576, antialias: true });
document.getElementById("GameWindow").appendChild(app.view);

app.stage.sortableChildren = true;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    // loaded = true;
    return bgms;
}
let bgmStarted = false, bgmNum = 0;
let currentBGM = 0;
const startPlayBGM = () => {
    if (bgmStarted) {
        return true;
    }
    console.log("start!");
    bgms[0].volume = 0.2;
    bgms[1].volume = 0.2;
    bgms[2].volume = 0.2;
    bgmStarted = true;
    bgms[0].play();
    document.removeEventListener('click', startPlayBGM);
    document.removeEventListener('keydown', startPlayBGM);
    return false;
};
function changeBGM(num) {
    bgms.forEach((audio, index) => {
        if (num === index) {
            console.log("change");
            bgms[num].volume = 0.2;
            audio.play();
            currentBGM = num;
        }
        if (num !== index) {
            audio.volume = 0;
        }
    });
};

document.body.addEventListener('click', startPlayBGM);
document.body.addEventListener('keydown', startPlayBGM);

//音量控件

let volume_sele = document.querySelector(".volume");
volume_sele.oninput = function () {
    bgms[currentBGM].volume = this.value;
    console.log("设置的音量大小为：", bgms[currentBGM].volume);
}

// async function initButton(){
//     let texture = await PIXI.Assets.load("../icon/MenuButton.json");
//     const volButton = PIXI.Sprite.from("MenuButtons8.png");
//     volButton.width = 32;
//     volButton.height = 32;
//     volButton.x = volButton.width / 2;
//     volButton.y = volButton.height / 2;
//     app.stage.addChild(volButton);
// }
// initButton();



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//background sprite
const background = PIXI.Sprite.from('../image_temp/TestGameBackground2.png');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);
//加载地图障碍
var BanariesPool = [];
BanariesPool = SetMap("../scene/testscene.json");
console.log(BanariesPool);
// async function init() {/////////////////////////尝试把贴图捆成bundles，这样比较方便调用（？而且这b还能后台运行，可以提高运行效率
//     const alltex = {
//         Bundles: [{
//             name: 'static_sprites',
//             assets: [
//                 {
//                     name: 'static_neko',
//                     src: '../sprite/players/Character_test.png',
//                 }
//             ]
//         },{
//             name: 'animation_texture',
//             assets : [
//                 {
//                     name : 'animation_neko',
//                     src: '../sprite/players/testTexture.json'
//                 }
//             ]
//         }
//         ],
//     };
//     await PIXI.Assets.init({manifest: alltex});
//     AfterLoad();
// }
//neko sprite1
async function AfterLoad() {
    const sheet = await PIXI.Assets.load('../sprite/players/testTexture.json');
    // console.log("in_gamew7indow");
    let neko = new PIXI.AnimatedSprite(sheet.animations['Character_test']);
    neko.width = 48;
    neko.height = 48;
    neko.hitbox = getHitBox(12, 24, 24, 24);
    // console.log("in_gamewind5ow");
    neko.x = app.screen.width / 2;
    neko.y = app.screen.height / 2;
    neko.vx = 0; neko.vy = 0;
    app.stage.addChild(neko);
    neko.animationSpeed = 0.1;
    // console.log("in_gamewind4ow");
    //生成随机整数
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    //box sprite2
    const box_test = PIXI.Sprite.from('../image_temp/barrier.png');
    box_test.width = 48;
    box_test.height = 48;
    box_test.hitbox = getPartHitBox(box_test, 0.6);
    box_test.x = getRandomInt(19)*48;
    box_test.y = getRandomInt(11)*48;//在窗口随机位置生成
    app.stage.addChild(box_test);

    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");
    // console.log("in_gamewindo3w");
    //水平和垂直速度
    let hori, vertical;
    hori = 1.5; vertical = 1.0;
    //Left
    left.press = () => {
        neko.vx = -hori;
    };

    left.release = () => {
        //八向移动，只有在反方向按键未按下时松开此键才会停止
        if (!right.isDown) {
            neko.vx = 0;
        }
    };

    //Up
    up.press = () => {
        neko.vy = -vertical;
    };
    up.release = () => {
        if (!down.isDown) {
            neko.vy = 0;
        }
    };

    //Right
    right.press = () => {
        neko.vx = hori;
    };
    right.release = () => {
        if (!left.isDown) {
            neko.vx = 0;
        }
    };

    //Down
    down.press = () => {
        neko.vy = vertical;
    };
    down.release = () => {
        if (!up.isDown) {
            neko.vy = 0;
        }
    };



    //对象预排序
    for (let i = 1; i < app.stage.children.length; i++) {
        app.stage.children[i].zIndex = app.stage.children[i].y + app.stage.children[i].height;
    }
    app.stage.sortChildren();
    app.ticker.add((delta) => gameloop(delta));
    function gameloop(delta) {//游戏循环
        play(delta);
    }
    function play(delta) {
        if (neko.vx != 0 || neko.vy != 0) {
            if (!neko.playing) neko.play();
        } else {
            neko.gotoAndStop(0);
        }
        neko.x += neko.vx;
        if (neko.zIndex != neko.y + neko.height) {//改变高度时排序
            neko.zIndex = neko.y + neko.height;
            app.stage.sortChildren();
        }
        if (CrossTheBoader(neko) || HitTest(neko, box_test) || HitMap(neko)) {
            neko.x -= neko.vx;
        }
        neko.y += neko.vy;
        if (CrossTheBoader(neko) || HitTest(neko, box_test) || HitMap(neko)) {
            neko.y -= neko.vy;
        }
    }
}

function HitMap(r) {
    for (let i = 0; i < BanariesPool.length; i++) {
        BanariesPool[i].hitbox = getPartHitBox(BanariesPool[i], BanariesPool[i].collideH);
        if (HitTest(r, BanariesPool[i])) {
            return true;
        }
    }

    return false;
}

AfterLoad();