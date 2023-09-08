import { keyboard } from '../../behavejs/keyboard.js';
import { HitTest, getFullHitBox, getHitBox } from '../../behavejs/collision.js';
// 创建窗口
var app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
    background: '#ffffff'
});
app.stage.sortableChildren = true;
document.getElementById("minigame").appendChild(app.view);
// 加载资源
let snake = [], index = 0, time_counter = 0;
let food = {};
let ticker, score;
let score_num = 0, snake_count = 1, bourdery_type = 1;
let leftboader = 0;
let upboader = 0;
let rightboader = 800;
let downboader = 600;
const speed = 6, size = 16;

let left = keyboard("ArrowLeft", "a"),
    up = keyboard("ArrowUp", "w"),
    right = keyboard("ArrowRight", "d"),
    down = keyboard("ArrowDown", "s");
let snake_1 = keyboard("1", ""),
    snake_2 = keyboard("2", ""),
    snake_3 = keyboard("3", ""),
    snake_4 = keyboard("4", "");

PIXI.Assets.load([
    './img/snake_1.png',
    './img/snake_1_head.png',
    './img/snake_2.png',
    './img/snake_2_head.png',
    './img/snake_3.png',
    './img/snake_3_head.png',
    './img/snake_4.png',
    './img/snake_4_head.png',
    './img/food.png'
]).then(() => {

    // 方形主角
    for (let i = 0; i < 4; i++) {
        snake[i] = PIXI.Sprite.from(`./img/snake_${i + 1}_head.png`);
        snake[i].x = getRandomNumWithPadding(app.screen.width, 100);
        snake[i].y = getRandomNumWithPadding(app.screen.height, 100);
        snake[i].width = size;
        snake[i].height = size;
        snake[i].zIndex = 5;
        if (snake[i].y < app.screen.height / 2)
            snake[i].mov_direction = 'down';
        else snake[i].mov_direction = 'up';
        snake[i].next_mov_direction = snake[i].mov_direction;
        snake[i].snake_id = i;
        snake[i].ishead = true;
        snake[i].hitbox = getHitBox(6, 6, 4, 4);
    }
    index = 0;

    food = PIXI.Sprite.from(`./img/food.png`);
    food.x = getRandomNumWithPadding(app.screen.width, 200);
    food.y = getRandomNumWithPadding(app.screen.height, 200);
    food.width = size * 4;
    food.height = size * 4;
    food.vx = 0;
    food.vy = 0;
    food.zIndex = Infinity;
    food.snake_id = 10;
    food.hitbox = getFullHitBox(food);

    score = new PIXI.Text('分数: 0', {
        fontFamily: 'Zpix',
        fontSize: 20,
        fill: 0xB8860B,
        align: 'right',
    });
    score.x = 340;
    score.y = 10;
    app.stage.addChild(score);

}).then(() => {

    snake_1.press = () => {
        snake[index].zIndex = 3;
        index = 0;
        snake[0].zIndex = 5;
    }
    snake_2.press = () => {
        snake[index].zIndex = 3;
        index = 1;
        snake[1].zIndex = 5;
    }
    snake_3.press = () => {
        snake[index].zIndex = 3;
        index = 2;
        snake[2].zIndex = 5;
    }
    snake_4.press = () => {
        snake[index].zIndex = 3;
        index = 3;
        snake[3].zIndex = 5;
    }

    //水平和垂直速度
    left.press = () => {
        if (snake[index].mov_direction == 'left' || snake[index].mov_direction == 'right') return;
        snake[index].next_mov_direction = 'left';
    };
    up.press = () => {
        if (snake[index].mov_direction == 'up' || snake[index].mov_direction == 'down') return;
        snake[index].next_mov_direction = 'up';
    };
    right.press = () => {
        if (snake[index].mov_direction == 'left' || snake[index].mov_direction == 'right') return;
        snake[index].next_mov_direction = 'right';
    };
    down.press = () => {
        if (snake[index].mov_direction == 'up' || snake[index].mov_direction == 'down') return;
        snake[index].next_mov_direction = 'down';
    };

    app.ticker.minFPS = 120;
    app.ticker.maxFPS = 180;
    // startgame();

    document.getElementById('start_button').addEventListener('click', () => {

        let selectElem = document.getElementById('snakes_num_select');
        snake_count = selectElem.options[selectElem.selectedIndex].value;
        selectElem = document.getElementById('bourdery_type_select');
        bourdery_type = selectElem.options[selectElem.selectedIndex].value;

        for (let i = 0; i < snake_count; i++)app.stage.addChild(snake[i]);
        app.stage.addChild(food);

        document.getElementById('ui_div').style.display = 'none';
        document.getElementById('minigame').style.display = 'block';
        startgame();
    })

});
async function startgame() {
    ticker = app.ticker.add(async (deltaTime) => gameloop(deltaTime))
}
let deltacount = 0
async function gameloop(delta) {//游戏循环
    deltacount += delta;
    if (deltacount < 3) return;
    deltacount = 0;
    score_num += Number(snake_count) * bourdery_type * 0.1;
    score.text = "当前选择：" + (index + 1) + "\n分数：" + Math.floor(score_num);

    app.stage.children.forEach(element => {
        if (element.snake_id == index && element.ishead == false) element.zIndex = 4;
        else if (element != score && element != food) element.zIndex = 2;
    });
    app.stage.sortChildren();

    for (let i = 0; i < snake_count; i++) {
        // 碰撞检测
        let bdycollision = CrossTheBoader(snake[i]);
        if (bdycollision > 0) {
            if (bourdery_type != 1) {
                console.log('game over because bourdery snake ' + (i + 1))
                gameover();
            } else {
                switch (bdycollision) {
                    case 1:
                        snake[i].x = rightboader - 10;
                        break;
                    case 2:
                        snake[i].y = downboader - 10;
                        break;
                    case 3:
                        snake[i].x = 10;
                        break;
                    case 4:
                        snake[i].y = 10;
                        break;
                }
                console.log(bdycollision);
            }
        }
        app.stage.children.forEach(element => {

            if (HitTest(snake[i], element)) {
                if (element.snake_id == 10) {
                    score_num += 10 * snake_count * bourdery_type * bourdery_type;
                    let newsnake = snake[i];
                    while (typeof (newsnake.next) != 'undefined') newsnake = newsnake.next;
                    newsnake.next = PIXI.Sprite.from(`./img/snake_${i + 1}.png`);
                    newsnake.next.x = newsnake.x;
                    newsnake.next.y = newsnake.y;
                    newsnake.next.width = size;
                    newsnake.next.height = size;
                    newsnake.next.snake_id = i;
                    newsnake.ishead = false;
                    newsnake.next.zIndex = 1;
                    newsnake.next.hitbox = getHitBox(6, 6, 4, 4);
                    app.stage.addChild(newsnake.next);
                    food.x = getRandomNumWithPadding(app.screen.width, 100);
                    food.y = getRandomNumWithPadding(app.screen.height, 100);
                }
            }
        });
        //移动
        snake_follow(snake[i]).then(() => {
            switch (snake[i].mov_direction) {
                case 'left':
                    snake[i].x -= speed;
                    break;
                case 'right':
                    snake[i].x += speed;
                    break;
                case 'up':
                    snake[i].y -= speed;
                    break;
                case 'down':
                    snake[i].y += speed;
                    break;
            }
            snake[i].mov_direction = snake[i].next_mov_direction;
            return;
        }).then(() => {
            app.stage.children.forEach(element => {
                if (HitTest(snake[i], element)) {
                    if (element.snake_id == i && element != snake[i]) {
                        console.log('game over because snake ate it self')
                        console.log(element);
                        console.log(snake[i]);
                        gameover();
                    }
                }
            });
        });
    }


    //时间
    time_counter += delta;
}

async function snake_follow(snake_node) {
    if (typeof (snake_node.next) == 'undefined') return;
    await snake_follow(snake_node.next).then(() => {
        snake_node.next.x = snake_node.x;
        snake_node.next.y = snake_node.y;
        return;
    })
}

function getRandomNumWithPadding(width, padding) {
    return Math.random() * (width - 2 * padding) + padding;
}

function gameover() {
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
            if (typeof (window.parent.minigame_result.play_count) != 'number') window.parent.minigame_result.play_count = 0;
            window.parent.minigame_result.play_count++;
            location.reload();
        } else if (result.isDismissed) {
            window.parent.minigame_result = {
                finished: true,
                score: score_num,
                strike_event: [
                    `st,{"content": "*你的四级成绩中有${Math.floor(score_num / 10)}分是星穹铁道成绩！*"}`
                ]
            };
            location.reload();
        }
    })
}

//地图边界碰撞检测
function CrossTheBoader(r) {
    //对于一个矩形碰撞箱，取第一个点为左上角，第二个点为右下角
    // console.log(r.width,r.height);
    // console.log(r.x,r.y)
    r.firstnodeX = r.x + r.hitbox.dx;
    r.firstnodeY = r.y + r.hitbox.dy;
    r.secondnodeX = r.x + r.hitbox.dx + r.hitbox.width;
    r.secondnodeY = r.y + r.hitbox.dx + r.hitbox.width;
    //alert(r.firstnodeX);
    console.log(r.secondnodeX, rightboader);

    if (r.firstnodeX <= leftboader) return 1;
    if (r.firstnodeY <= upboader) return 2;
    if (r.secondnodeX >= rightboader) return 3;
    if (r.secondnodeY >= downboader) return 4;
    return -1;
}