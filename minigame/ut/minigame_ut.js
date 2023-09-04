import { keyboard } from '../../behavejs/keyboard.js';
import { HitTest, getHitBox, getPartHitBox } from '../../behavejs/collision.js';
// 创建窗口
var app = new PIXI.Application({
    width: 480,
    height: 480,
    antialias: true,
    background: '#ffffff'
});
document.getElementById("minigame").appendChild(app.view);
// 加载资源
let neko, bullets, bullets_num, time_counter = 0;
let current_bullets_num = 0;
let ticker, level = 120;
let score, button, button_text;
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
    neko.hitbox = getHitBox(neko.width / 2 - 2, neko.height / 2 - 2, 4, 4);
    app.stage.addChild(neko);



    // 方形子弹 分组
    bullets = []; bullets_num = 10000;
    for (let index = 0; index < bullets_num; index++) {
        let bullet = PIXI.Sprite.from("./img/bullet_square.png");
        bullet.anchor.set(0.5);
        let random_way = Math.floor(Math.random() * 2);//随机在四版中的一版上生成 制作者迫于压力 改成两边 再编辑：改成两边之后反而打不过了悲
        // console.log(random_way);
        if (random_way == 0) {
            bullet.x = Math.random() * (app.screen.width);
            bullet.y = - app.screen.height / 3;
        }
        else if (random_way == 1) {
            bullet.x = Math.random() * (app.screen.width);
            bullet.y = app.screen.height + app.screen.height / 3;
        }
        // else if (random_way == 2){
        //     bullet.x = app.screen.width;
        //     bullet.y = Math.random() * (app.screen.height);
        // }
        // else{
        //     bullet.x = app.screen.width + app.screen.width / 3;
        //     bullet.y = Math.random() * (app.screen.height);
        // }

        bullet.scale.set(1);
        bullet.speed = 2 + Math.random();
        bullet.direction = 0;
        bullet.hitbox = getHitBox(0, 0, bullet.width, bullet.height);
        bullets.push(bullet);
    }

    score = new PIXI.Text('分数: 0', {
        fontFamily: 'Zpix',
        fontSize: 20,
        fill: 0xB8860B,
        align: 'right',
    });
    score.x = 340;
    score.y = 10;
    app.stage.addChild(score);

    button = new PIXI.Graphics();
    button.beginFill(0xB8860B);
    button.lineStyle(2, 0xa9a9a9, 1);
    button.drawRect(0, 0, 150, 60);
    button.x = app.screen.width / 2 - 75;
    button.y = app.screen.height / 2 - 30;
    button.eventMode = 'static';
    button.buttonMode = true;
    app.stage.addChild(button);

    button_text = new PIXI.Text('开始', {
        fontFamily: 'Zpix',
        fontSize: 20,
        fill: 0xffffff,
        align: 'center',
    });
    button_text.x = app.screen.width / 2 - 20;
    button_text.y = app.screen.height / 2 - 10;
    app.stage.addChild(button_text);

}).then(() => {

    // 操作
    let left = keyboard("ArrowLeft", "a"),
        up = keyboard("ArrowUp", "w"),
        right = keyboard("ArrowRight", "d"),
        down = keyboard("ArrowDown", "s");
    //水平和垂直速度
    {
        let hori, vertical;
        hori = 3.5; vertical = 3.5;
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



    app.ticker.minFPS = 90;
    app.ticker.maxFPS = 120;
    // startgame();
    button.on('pointerdown', startgame)

})
var density_index = 0;
let gameover = false;
async function startgame() {
    app.stage.removeChild(button);
    app.stage.removeChild(button_text);
    ticker = app.ticker.add(async (deltaTime) => gameloop(deltaTime))

}
async function gameloop(delta) {//游戏循环looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooop
    // console.log(time_counter);
    // console.log(density_index);
    if (time_counter > density_index / 2 * 100 && density_index < 60) {
        density_index += 2;
    }
    // 分数
    score.text = "分数：" + Math.floor(time_counter / 10);

    // 发射弹幕

    if (time_counter % (80 - density_index) === 0) {
        // 初始化子弹参数
        let bullet = bullets[current_bullets_num];
        let tan = (bullet.x - neko.x) / (bullet.y - neko.y);
        console.log(bullet);
        if (bullet.y > neko.y) {
            if (bullet.x < neko.x) {
                bullet.direction = Math.atan(tan) + Math.PI;
            }
            else {
                bullet.direction = -Math.atan(-tan) + Math.PI;
            }
        }
        else {
            if (bullet.x < neko.x) {
                bullet.direction = Math.atan(tan);
            }
            else {
                bullet.direction = -Math.atan(-tan);
            }
        }
        console.log("add");
        app.stage.addChild(bullet);
        current_bullets_num++;
    }
    for (let index = 0; index < current_bullets_num; index++) {
        const bullet = bullets[index];

        // 碰撞检测
        if (HitTest(neko, bullet)) {
            ticker.stop();
            Swal.fire({
                title: '游戏结束！',
                text: "是否重新开始？",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '再玩一会',
                cancelButtonText: '关掉游戏',
                allowEscapeKey: false,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                } else if (result.isDismissed) {
                    window.parent.minigame_result = {
                        finished: true,
                        score: Math.floor(time_counter / 10),
                        strike_event: [
                            `st,{"content": "*你获得了${Math.floor(time_counter / 10)}分*"}`
                        ]
                    };
                    location.reload();
                }
            })

        }


        bullet.x += Math.sin(bullet.direction) * bullet.speed;
        bullet.y += Math.cos(bullet.direction) * bullet.speed;

    }





    // 人物行走
    neko.vx *= delta; neko.vy *= delta;
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

    //时间
    time_counter++;
    // console.log(time_counter);


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
// setTimeout(() => {
    console.log(window.parent.zoom_formini,"hikudaiuhodahiu");
    document.body.style.zoom = window.parent.zoom_formini * 0.9;
// }, 0);
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