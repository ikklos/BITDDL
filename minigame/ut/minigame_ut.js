import { keyboard } from '../../behavejs/keyboard.js';
// 创建窗口
var app = new PIXI.Application({ 
    width: 480, 
    height: 480, 
    antialias: true,
    background: '#ffffff'
});
document.getElementById("minigame").appendChild(app.view);
// 加载资源
let neko,bullets,bullets_num;
PIXI.Assets.load([
    './img/bullet_square.png',
    './img/character_square.png'
]).then(() => {
    // const animations = PIXI.Assets.cache.get('./img/minigame_character.json').data.animations;
    // neko = PIXI.AnimatedSprite.fromFrames(animations["minigame_character_run"]);
    // neko.anchor.set(0.5);
    // neko.animationSpeed = 0.2;
    // neko.scale.set(2);
    // neko.x = (app.screen.width) / 2;
    // neko.y = app.screen.height / 2;
    // neko.vx = 0; neko.vy = 0;
    // neko.play();
    // app.stage.addChild(neko);


    // 方形主角
    neko = PIXI.Sprite.from("./img/character_square.png");
    neko.anchor.set(0.5);
    neko.x = app.screen.width / 2;
    neko.y = app.screen.height / 2;
    neko.vx = 0;
    neko.vy = 0;
    app.stage.addChild(neko);



    // 方形子弹 分组
    bullets = [];bullets_num = 1000;
    for (let index = 0; index < bullets_num; index++) {
        let bullet = PIXI.Sprite.from("./img/bullet_square.png");
        bullet.anchor.set(0.5);
        bullet.x = Math.random() * (app.screen.width);
        bullet.y = - Math.random() * (app.screen.height);
        bullet.scale.set(1);
        bullet.speed = 2 + Math.random() * 4;
        bullet.direction = 0 ;

        bullets.push(bullet);
        app.stage.addChild(bullet);
        
    }
    
}).then(()=>
{

// 操作
let left = keyboard("ArrowLeft", "a"),
    up = keyboard("ArrowUp", "w"),
    right = keyboard("ArrowRight", "d"),
    down = keyboard("ArrowDown", "s");
//水平和垂直速度
{
let hori, vertical;
hori = 3; vertical = 3;
left.press = () => {
    neko.vx = -hori;
    // neko.scale.x = -2;
};
left.release = () => {
    if (!right.isDown) {
        neko.vx = 0;
    }
    if (right.isDown) {
        neko.vx = hori;
        // neko.scale.x = 2;
    }
};
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
right.press = () => {
    neko.vx = hori;
    // neko.scale.x = 2;
};
right.release = () => {
    if (!left.isDown) {
        neko.vx = 0;
    }
    if (left.isDown) {
        neko.vx = -hori;
        // neko.scale.x = -2;
    }
};
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
}



app.ticker.minFPS = 120;
app.ticker.maxFPS = 90;
app.ticker.add((deltaTime) => gameloop(deltaTime));
});

function gameloop(delta) {//游戏循环looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooop
    // console.log(app.ticker.FPS);


    // 发射弹幕
    for (let index = 0; index < bullets_num; index++) {
        const bullet = bullets[index];
        bullet.x += Math.sin(bullet.direction) * bullet.speed;
        bullet.y += Math.cos(bullet.direction) * bullet.speed;
        
    }
    




    // 人物行走
    neko.vx *= delta;neko.vy *=delta;
    // console.log(neko.vx);
    neko.x += neko.vx;
    if (CrossTheBoader(neko)) {
        neko.x -= neko.vx;
    }
    neko.y += neko.vy;
    if (CrossTheBoader(neko)) {
        neko.y -= neko.vy;
    }
    neko.vx /= delta; neko.vy /= delta;
}



//地图边界碰撞检测
function CrossTheBoader(r) {
    let over, leftboader, rightboader, upboader, downboader;
    over = true;
    let win = document.getElementById("minigame");
    leftboader = 0;
    upboader = 0;
    rightboader = win.clientWidth;
    downboader = win.clientHeight;
    //对于一个矩形碰撞箱，取第一个点为左上角，第二个点为右下角
    // console.log(r.width,r.height);
    // console.log(r.x,r.y)
    r.firstnodeX = r.x - 18;
    r.firstnodeY = r.y - 18;
    r.secondnodeX = r.x + 18;
    r.secondnodeY = r.y + 24;
    //alert(r.firstnodeX);
    if (r.firstnodeX <= rightboader && r.firstnodeX >= leftboader
        && r.firstnodeY >= upboader && r.firstnodeY <= downboader
        && r.secondnodeX <= rightboader && r.secondnodeX >= leftboader
        && r.secondnodeY >= upboader && r.secondnodeY <= downboader) {
        over = false;
    }
    return over;
}


// //切换站立行为
// function change_to_stand() {
//     let tmp = neko;
//     app.stage.removeChild(neko);
//     neko = PIXI.Sprite.from("./img/character_stand.png");
//     neko.anchor.set(0.5);
//     neko.scale.set(2);
//     neko.x = tmp.x;
//     neko.y = tmp.y;
//     console.log(neko);
//     app.stage.addChild(neko);
// }
// function change_to_run() {
//     let tmp = neko;
//     app.stage.removeChild(neko);
//     const animations = PIXI.Assets.cache.get('./img/minigame_character.json').data.animations;
//     neko = PIXI.AnimatedSprite.fromFrames(animations["minigame_character_run"]);
//     neko.anchor.set(0.5);
//     neko.animationSpeed = 0.2;
//     neko.scale.set(2);
//     neko.x = tmp.x;
//     neko.y = tmp.y;
//     neko.vx = tmp.vx; neko.vy = tmp.vy;
//     neko.play();
//     app.stage.addChild(neko);
// }