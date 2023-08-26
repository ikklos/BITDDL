import { CrossTheBoader, HitTest, getHitBox, getPartHitBox } from "./collision.js";
import { keyboard } from './keyboard.js';
import { SetMap } from "./MapSet.js";
import { SetNPCs } from "./npcbehave.js";

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
let wait_event = { status: false ,story :null}//此时有没有待处理互动事件
var story_status = [{
    "story": "test",
    "status": "ready",//剧情完成情况，分为unmeet，ready，touched
    "next": 2//下一个剧情的编号
},{},{}];
var npc_pool = [];//npc池，这里的npc指一切的可交互对象
var npc_raw_data = [];//也是npc池，但这里读入的并不是npc对象，而是npc的基本数据，需要将其转换为npc
var BanariesPool = [];//banaries池
let ShowingText, ToRemoveText;//正在显示的对话，需要关闭的对话
//background sprite
const background = PIXI.Sprite.from('../image_temp/TestGameBackground2.png');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);
//加载地图障碍
loadmap("../scene/testscene.json");
//console.log(npc_pool);
//console.log(story_status);
//console.log(BanariesPool);
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
    // function getRandomInt(max) {
    //     return Math.floor(Math.random() * max);
    // }

    // //box sprite2
    // const box_test = PIXI.Sprite.from('../image_temp/barrier.png');
    // box_test.width = 48;
    // box_test.height = 48;
    // box_test.hitbox = getPartHitBox(box_test, 0.6);
    // box_test.x = getRandomInt(19)*48;
    // box_test.y = getRandomInt(11)*48;//在窗口随机位置生成
    // app.stage.addChild(box_test);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let left = keyboard("ArrowLeft", "a"),
        up = keyboard("ArrowUp", "w"),
        right = keyboard("ArrowRight", "d"),
        down = keyboard("ArrowDown", "s");
    let keyf = keyboard("f", ""),
        keyq = keyboard("q", "");
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
        if (right.isDown) {
            neko.vx = hori;
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
        if (down.isDown) {
            neko.vy = vertical;
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
        if (left.isDown) {
            neko.vx = -hori;
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
        if (up.isDown) {
            neko.vy = -vertical;
        }
    };
    keyf.press = () => {
        npc_pool.forEach(npc => {
            if (HitTest(neko, npc)) {
                console.log(npc.textpool);
                for (let i = 0; i < npc.textpool.length; i++) {
                    if (story_status[npc.textpool[i].fstory].status === "touched") {
                        wait_event.status = true;
                        wait_event.story = npc.textpool[i].fstory;
                        wait_event.npc = npc;
                        wait_event.text = npc.textpool[i];
                    }
                    if (story_status[npc.textpool[i].fstory].status === "ready") {
                        wait_event.status = true;//在此游戏循环中待触发，注意此事件将一定在此循环内play时被解决
                        wait_event.story = npc.textpool[i].fstory;
                        wait_event.npc = npc;
                        wait_event.text = npc.textpool[i];
                        break;
                    }
                }

            }
        });
    }
    keyq.press = () => {//按q可以关闭对话框
        ToRemoveText = ShowingText;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //对象预排序
    for (let i = 1; i < app.stage.children.length; i++) {
        app.stage.children[i].zIndex = app.stage.children[i].y + app.stage.children[i].height;
    }
    app.stage.sortChildren();
    app.ticker.add((delta) => gameloop(delta));
    function gameloop(delta) {//游戏循环
        play(delta);
    }
    function play(delta) {//基本所有的事件结算都在这里写
        if (wait_event.status === true) {//结算互动事件
            neko.vx = neko.vy = 0;
            
            app.stage.addChild(wait_event.text);
            ShowingText = wait_event.text;
            
            if (story_status[wait_event.story].status === "ready") {
                if (story_status[story_status[wait_event.story].next].status === "unmeet")
                    story_status[story_status[wait_event.story].next].status = "ready";
            }
            story_status[wait_event.story].status = "touched";
            wait_event.status = false;
            wait_event.text = null;
            wait_event.npc = null;
            wait_event.story = null;
        }
        if (ToRemoveText === ShowingText && ToRemoveText !== null) {//移除文字
            app.stage.removeChild(ShowingText);
            ToRemoveText = null;
            ShowingText = null;
        }
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
        if (CrossTheBoader(neko) || HitMap(neko)) {
            neko.x -= neko.vx;
        }
        neko.y += neko.vy;
        if (CrossTheBoader(neko) || HitMap(neko)) {
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

async function loadmap(url) {//可以用于实现切换场景，只需要改变url即可
    console.log("loading...");
    npc_pool = [];
    BanariesPool = [];
    npc_raw_data = [];
    BanariesPool = SetMap(url);
    npc_raw_data = SetNPCs(url);
    console.log("set completed");
    setTimeout(() => {
        console.log(npc_raw_data);
        for (let i = 0; i < npc_raw_data.length; i++) {
            console.log("loading...");
            let npc = PIXI.Sprite.from(npc_raw_data[i].img);
            console.log("success!");
            npc.HitBox = getPartHitBox(npc, npc_raw_data[i].collideH);
            npc.fstory = npc_raw_data[i].fstory;
            npc.textpool = loadtexts(npc_raw_data[i].text);
            npc.name = npc_raw_data[i].name;
            npc.npctype = npc_raw_data[i].type;
            npc.x = npc_raw_data[i].x;
            npc.y = npc_raw_data[i].y;
            npc.height = npc_raw_data[i].height;
            npc.width = npc_raw_data[i].width;
            npc.nextmap = npc_raw_data[i].nextmap;
            npc_pool.push(npc);
        }
        for (let i = 0; i < npc_pool.length; i++) {
            if (story_status[npc_pool[i].fstory].status !== "unmeet") { app.stage.addChild(npc_pool[i]); console.log("add!") }
        }
    }, 200);

}
function loadtexts(text_array) {//只被loadmap调用
    console.log(text_array.length);
    let texts = [];
    for (let i = 0; i < text_array.length; i++) {
        console.log("loading text");
        let text = new PIXI.Text(text_array[i].content);
        text.x = 50;
        text.y = 500;
        text.fstory = text_array[i].fstory;
        texts.push(text);
    }
    return texts;
}