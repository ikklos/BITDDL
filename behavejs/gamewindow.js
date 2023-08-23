
//创建app对象，把预览加入DOM,app对象建议开全局
let app = new PIXI.Application({ width: 800, height: 480, antialias: true });
//neko sprite1
let neko = PIXI.Sprite.from("../sprite/players/neko.jpg");
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
let hori,vertical;
hori = 1.5;vertical = 1.0;
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
    if(CrossTheBoader(neko)){
        neko.x -= neko.vx;
    }
    neko.y += neko.vy;
    if(CrossTheBoader(neko)){
        neko.y -= neko.vy;
    }
}

//矩形碰撞箱检测
function HitTest(r1, r2){
    let hit,combineWidth,combineHeight,vx,vy;
    hit = false;
    r1.CenterX = r1.x + r1.width / 2;
    r1.CenterY = r1.y + r1.height / 2;
    r2.CenterX = r2.x + r2.width / 2;
    r2.CenterY = r2.y + r2.height / 2;
    
    r1.halfwidth = r1.width / 2;
    r1.halfheight = r1.height / 2;
    r2.halfwidth = r2.width / 2;
    r2.halfheight = r2.height / 2;

    vx = Math.abs(r1.CenterX - r2.CenterX);
    vy = Math.abs(r1.CenterY - r2.CenterY);

    combineWidth = r1.halfwidth + r2.halfwidth;
    combineHeight = r1.halfheight + r2.halfheight;

    if(vx < combineWidth && vy < combineHeight){
        hit = true;
    }

    return hit;
}

//检测控制角色是否要超出地图边界
function CrossTheBoader(r){
    let over,leftboader,rightboader,upboader,downboader;
    over = true;
    let win = document.getElementById("GameWindow");
    leftboader = 0;
    upboader = 0;
    rightboader = win.clientWidth;
    downboader = win.clientHeight;
    //对于一个矩形碰撞箱，取第一个点为左上角，第二个点为右下角
    r.firstnodeX = r.x;
    r.firstnodeY = r.y;
    r.secondnodeX = r.x + r.width;
    r.secondnodeY = r.y + r.height;
    //alert(r.firstnodeX);
    if(r.firstnodeX <= rightboader && r.firstnodeX >= leftboader
        &&r.firstnodeY >= upboader && r.firstnodeY <= downboader
        &&r.secondnodeX <= rightboader && r.secondnodeX >= leftboader
        &&r.secondnodeY >= upboader && r.secondnodeY <= downboader){
            over = false;
    }
    return over;
}