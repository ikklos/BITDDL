
import './collision.js'

//创建app对象，把预览加入DOM,app对象建议开全局
let app = new PIXI.Application({ width: 1000, height: 600, antialias: true });
//neko sprite1
let neko = PIXI.Sprite.from('../sprite/players/Character_test.png');
console.log(neko);
neko.width = 48;
neko.height = 48;
neko.x = app.screen.width / 2;
neko.y = app.screen.height / 2;
neko.vx = 0; neko.vy = 0;
document.getElementById("GameWindow").appendChild(app.view);
app.stage.addChild(neko);
//box sprite2

//键盘监听
function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}
//
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
    if (CrossTheBoader(neko)) {
        neko.x -= neko.vx;
    }
    neko.y += neko.vy;
    if (CrossTheBoader(neko)) {
        neko.y -= neko.vy;
    }
}