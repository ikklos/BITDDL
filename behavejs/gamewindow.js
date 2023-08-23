import { CrossTheBoader, HitTest } from "./collision.js";
import { keyboard } from './keyboard.js';
//创建app对象，把预览加入DOM,app对象建议开全局
//修改画布 使得人物与背景大小匹配 1000*600 => 960*576
let app = new PIXI.Application({ width: 960, height: 576, antialias: true });

//background sprite
const background = PIXI.Sprite.from('../image_temp/TestGameBackground2.png');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);

//neko sprite1
let neko = PIXI.Sprite.from("../sprite/players/Character_test.png");
neko.collideH = 0.5;
neko.width = 48;
neko.height = 48;
neko.x = app.screen.width / 2;
neko.y = app.screen.height / 2;
neko.vx = 0; neko.vy = 0;
document.getElementById("GameWindow").appendChild(app.view);
app.stage.addChild(neko);

//生成随机整数
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//box sprite2
const box_test = PIXI.Sprite.from('../image_temp/barrier.png');
box_test.collideH = 0.5;
box_test.width = 48;
box_test.height = 48;
box_test.x = getRandomInt(960 - 48);
box_test.y = getRandomInt(576 - 48);//在窗口随机位置生成
app.stage.addChild(box_test);

let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");
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

app.ticker.add((delta) => gameloop(delta));

function gameloop(delta) {//游戏循环
    play(delta);
}
function play(delta) {
    neko.x += neko.vx;
    if (CrossTheBoader(neko) || HitTest(neko, box_test)) {
        neko.x -= neko.vx;
    }
    neko.y += neko.vy;
    if (CrossTheBoader(neko) || HitTest(neko, box_test)) {
        neko.y -= neko.vy;
    }
}