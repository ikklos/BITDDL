import { CrossTheBoader, HitTest, getHitBox, getPartHitBox } from "./collision.js";
import { keyboard } from './keyboard.js';
import { SetMap } from "./MapSet.js";
import { SetNPCs } from "./npcbehave.js";
import { LoadStories } from "./LoadStoryStatus.js"
import { LoadItems } from "./Load_items.js";
//创建app对象，把预览加入DOM,app对象建议开全局
//修改画布 使得人物与背景大小匹配 1000*600 => 960*576
var app = new PIXI.Application({ width: 960, height: 576, antialias: true });
document.getElementById("GameWindow").appendChild(app.view);


app.stage.sortableChildren = true;
console.log(window.innerHeight, "cilentheights");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//音量控件

// let volume_sele = document.querySelector(".volume");
// volume_sele.oninput = function () {
//     bgms[currentBGM].volume = this.value;
//     console.log("设置的音量大小为：", bgms[currentBGM].volume);
// }

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
let wait_event = { type: "null" };
let event_change = false;
var story_status = [];
var npc_pool = [];//npc池，这里的npc指一切的可交互对象
var npc_raw_data = [];//也是npc池，但这里读入的并不是npc对象，而是npc的基本数据，需要将其转换为npc
var BanariesPool = [];//banaries池
var currentSave = {//玩家状态
    playerName: 'tav',
    saveDate: '2077-8-20-23-55',
    password: '123'
};
let nowmap = {};
let neko = {};
let item_list = LoadItems("../items/items.json");
let sheet;
//background sprite
const background = PIXI.Sprite.from('../image_temp/TestGameBackground2.png');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);
story_status = LoadStories("../story/story.json");
//加载地图障碍
loadmap("../scene/south-1.json");
if (typeof (currentSave.savepackage) === "undefined") {//初始化背包
    currentSave.savepackage = [];
    for (let i = 0; i < item_list.length; i++) {
        currentSave.savepackage[i] = 0;
    }
}
//进游戏！
AfterLoad();
async function AfterLoad() {
    sheet = await PIXI.Assets.load('../sprite/players/testTexture.json');
    loadhero('Character_test', app.stage.width / 2, app.stage.height / 2);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let left = keyboard("ArrowLeft", "a"),
        up = keyboard("ArrowUp", "w"),
        right = keyboard("ArrowRight", "d"),
        down = keyboard("ArrowDown", "s");
    let keyf = keyboard("f", "");
    //水平和垂直速度
    let hori, vertical;
    hori = 0.9; vertical = 0.7;
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
        if (wait_event.type === "null") {
            npc_pool.forEach(npc => {
                if (HitTest(neko, npc)) {
                    console.log("in keyf", npc);
                    if (npc.type === "npc") {
                        for (let i = 0; i < npc.text.length; i++) {
                            if (CheckPrelist(npc.text[i].pre_list)) {
                                wait_event.type = "npc";
                                wait_event.text = npc.text[i];
                                wait_event.times = 0;
                                event_change = true;
                            }
                        }
                    } else if (npc.type === "door") {
                        wait_event.type = "door";
                        wait_event.nextmap = npc.nextmap;
                        wait_event.door = npc;
                        event_change = true;
                    }
                }
            });
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //对象预排序
    console.log("before in loop");
    app.ticker.minFPS = 90;
    app.ticker.maxFPS = 120;
    app.ticker.add((deltaTime) => gameloop(deltaTime));
    function gameloop(delta) {//游戏循环
        //console.log(delta);
        play(delta);
    }
}

function play(delta) {//基本所有的事件结算都在这里写
    if (wait_event.type !== "null") {
        neko.vx = neko.vy = 0;
    }
    //console.log("1");
    // if (wait_event.status === true) {//结算互动事件
    //     neko.vx = neko.vy = 0;

    //     app.stage.addChild(wait_event.text);
    //     ShowingText = wait_event.text;

    //     if (story_status[wait_event.story].status === "ready") {
    //         if (story_status[story_status[wait_event.story].next].status === "unmeet")
    //             story_status[story_status[wait_event.story].next].status = "ready";
    //     }
    //     story_status[wait_event.story].status = "touched";
    //     wait_event.status = false;
    //     wait_event.text = null;
    //     wait_event.npc = null;
    //     wait_event.story = null;
    // }
    //console.log(window.parent.dialogResult);
    //console.log(wait_event);
    if (wait_event.type === "npc" && (wait_event.times === 0 || window.parent.dialogResult !== -1)) {//结算npc对话
        npc_speak(wait_event.text);
    }
    if (wait_event.type === "door") {
        app.stage.removeChild(neko);
        loadhero('Character_test', wait_event.door.nextx, wait_event.door.nexty);
        console.log(neko);

        loadmap(wait_event.nextmap);


        wait_event.type = "null";
        wait_event.nextmap = null;
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
    //console.log(neko.x,neko.y);
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



async function loadmap(url) {//可以用于实现切换场景，只需要改变url即可
    console.log("loading...");
    for (let i = 0; i < npc_pool.length; i++) {
        console.log("removed 1");
        app.stage.removeChild(npc_pool[i]);
    }
    npc_pool.length = 0;
    BanariesPool.length = 0;
    npc_raw_data.length = 0;
    if (typeof (nowmap.up) !== "undefined" && typeof (nowmap.down) !== "undefined") {
        app.stage.removeChild(nowmap.down);
        app.stage.removeChild(nowmap.up);
    }
    nowmap = SetMap(url);
    console.log(nowmap);


    console.log(nowmap.down);

    npc_raw_data = SetNPCs(url);


    //story_status = LoadStories(url);
    console.log("set completed");
    setTimeout(() => {
        console.log(nowmap);
        app.stage.addChild(neko);
        console.log("add neko completed!");
        console.log(neko.x);
        console.log(neko.y);
        BanariesPool = nowmap.banaries;
        nowmap.down = PIXI.Sprite.from(nowmap.down);
        nowmap.down.name = "down";
        nowmap.up = PIXI.Sprite.from(nowmap.up);
        nowmap.up.name = "up";
        app.stage.addChild(nowmap.down);
        app.stage.addChild(nowmap.up);
        console.log(npc_raw_data);
        for (let i = 0; i < npc_raw_data.length; i++) {
            console.log("loading...");
            let npc = PIXI.Sprite.from(npc_raw_data[i].img);
            console.log("success!");
            npc.hitbox = getPartHitBox(npc_raw_data[i], npc_raw_data[i].collideH);
            npc.behave = npc_raw_data[i].behave;
            npc.text = npc_raw_data[i].text;
            npc.name = npc_raw_data[i].name;
            npc.type = npc_raw_data[i].type;
            npc.x = npc_raw_data[i].x;
            npc.y = npc_raw_data[i].y;
            npc.height = npc_raw_data[i].height;
            npc.width = npc_raw_data[i].width;
            npc.nextmap = npc_raw_data[i].nextmap;
            console.log(npc.x);
            if (npc.type === "door") {
                npc.nextx = npc_raw_data[i].nextx;
                npc.nexty = npc_raw_data[i].nexty;
                npc.hitbox = getHitBox(-10, -10, npc_raw_data[i].width + 20, npc_raw_data[i].height + 20);
            }
            npc_pool.push(npc);
        }
        for (let i = 0; i < npc_pool.length; i++) {
            if (npc_pool[i].type === "npc") solve_npc_behave(npc_pool[i]);
            else if (npc_pool[i].type === "door") {
                app.stage.addChild(npc_pool[i]);
            }
        }
        for (let i = 1; i < app.stage.children.length; i++) {
            app.stage.children[i].zIndex = app.stage.children[i].y + app.stage.children[i].height;
        }
        console.log(app.stage.getChildByName(nowmap.down));
        app.stage.getChildByName("up").zIndex = 10086;
        app.stage.getChildByName("down").zIndex = 0;
        app.stage.sortChildren();
        console.log("sort end");
        console.log(BanariesPool);
    }, 1000);

}
/*commands
attribute|attr,name,change,xx     修改属性为xx
attribute|attr,name,delta,xx      属性增加xx
package|pkg,add|remove,id,num     增添背包物品
story_finish|sf,id                标记故事完成
 */
function command(str) {//不用额外判断，直接动行为就行，判断在别的地方
    let strs = str.split(',');
    switch (strs[0]) {
        case 'attr':
        case 'attribute':
            if (typeof currentSave[strs[1]] === undefined) {
                console.log(`command "${str}" cannot be invoked."${strs[1]}" is not an avaliable attribute!`);
                break;
            }
            if (strs[2] != "delta" && strs[2] != "change") {
                console.log(`command "${str}" cannot be invoked."${strs[2]}" is not an option!`);
                break;
            }
            if (typeof currentSave[strs[1]] == "number") {
                let num = Number(strs[3]);
                if (num == "NaN") {
                    console.log(`command "${str}" cannot be invoked."${strs[3]}" is not a number!`);
                    break;
                }
                if (strs[2] == "delta")
                    currentSave[strs[1]] += num;
                else
                    currentSave[strs[1]] = num;
            } else if (typeof currentSave[strs[1]] == "boolean") {
                if (strs[3] != "true" && strs[3] != "false") {
                    console.log(`command "${str}" cannot be invoked."${strs[3]}" is not a boolean value!`);
                    break;
                }
                currentSave[strs[1]] = strs[3] == "true";
            } else if (typeof currentSave[strs[1]] == "object") {
                try {
                    let obj = JSON.parse(strs[3]);
                    currentSave[strs[1]] = obj;
                } catch (e) {
                    console.log(`command "${str}" cannot be invoked."${strs[3]}" is not an object!`);
                }
            } else if (typeof currentSave[strs[1]] == "string") {
                currentSave[strs[1]] = strs[3];
            } else console.log(`command "${str}" cannot be invoked."${strs[1]}" has exceptional type!`);
            break;
        case 'pkg':
        case 'package':

            break;
        case 'sf':
        case 'story_finish':
            let num = Number(strs[1]);
            if (num == "NaN") {
                console.log(`command "${str}" cannot be invoked."${strs[1]}" is not a number!`);
                break;
            }
            console.log("strike story");
            console.log(num);
            story_status[num].status = 1;
            break;
        default:
            console.log(`command "${str}" cannot be invoked."${strs[0]}" cannot be recognized!`);
    }
}
function solve_npc_behave(npc) {//约定npc只有简单的行为，如出现，消失，（先不考虑实现->固定速率行走，循环行走等更多行为）
    let fin = false;
    let Arr = npc.behave;
    if (typeof (Arr) == "undefined") return;
    for (let i = 0; i < Arr.length; i++) {
        if (Arr[i].type === "appear") {//在json中写这项的时候如果一个npc要重复出现消失，一定要将拓扑序靠后的节点放后面
            if (CheckPrelist(Arr[i].pre_list)) {
                fin = true;
            }
        } else if (Arr[i].type === "disappear") {
            if (CheckPrelist(Arr[i].pre_list)) {
                fin = false;
            }
        }
    }
    if (fin) app.stage.addChild(npc);
    else app.stage.removeChild(npc);
}
function CheckPrelist(pre) {//event，//multi_item//item, attribute_value
    console.log(pre);
    if (typeof (pre) == "undefined") return true;
    for (let i = 0; i < pre.length; i++) {

        if (pre[i].type === "event") {
            let num = pre[i].num;
            for (let k = 0; k < pre[i].list.length; k++) {
                if (story_status[pre[i].list[k]].status === 1) num--;
            }
            console.log(num);

            if (num > 0) {
                return false;
            }
        }
        else if (pre[i].type === "item") {
            let num = pre[i].num;
            for (let k = 0; k < pre[i].list.length; k++) {
                if (currentSave.savepackage[pre[i].list[k]] > 1) num--;
            }
            if (num--) return false;
        } else if (pre[i].type === "multi_item") {
            let num = pre[i].num;
            for (let k = 0; k < pre[i].list.length; k++) {
                if (currentSave.savepackage[pre[i].list[k]] < num) {
                    return false;
                }
            }
        }
    }

    return true;
}
// function CheckStoryList(id) {
//     let condition = story_status[id].num;
//     if (story_status[id].status == 1) return 1;
//     else {
//         for (let i = 0; i < story_status[id].pre_list.length; i++) {
//             let f = story_status[id].pre_list[i];
//             if (story_status[f].status === 1) {
//                 condition--;
//             }
//         }
//     }
//     if (condition <= 0) {
//         story_status[id].status = 1;
//         return 1;
//     }
//     return 0;
// }
function npc_speak(text) {
    console.log(text);
    if (wait_event.times == 0) {
        window.parent.showDialog(wait_event.text);
        wait_event.times = 1;
        return;
    }
    wait_event.times++;
    if (typeof (text.strike_event) != "undefined" && text.strike_event.length > 0)
        for (let i = 0; i < text.strike_event.length; i++)
            command(text.strike_event[i]);
    if (window.parent.dialogResult != -1) {
        if (typeof (text.options) != 'undefined' && window.parent.dialogResult < text.options.length) {
            wait_event.type = "npc"
            wait_event.text = text.options[window.parent.dialogResult].next_text;
            window.parent.showDialog(wait_event.text);
        } else {
            wait_event.type = "null";
            wait_event.text = {};
            wait_event.times = 0;
            window.parent.clearTextArea();
        }
        window.parent.dialogResult = -1;
    }
}
function loadhero(url, x, y) {
    neko = new PIXI.AnimatedSprite(sheet.animations[url]);
    neko.name = "hero";
    neko.width = 24;
    neko.height = 24;
    neko.hitbox = getHitBox(6, 12, 12, 12);
    neko.x = x;
    neko.y = y;
    neko.vx = 0; neko.vy = 0;
    neko.animationSpeed = 0.1;
}

function oprate_pakage(id, num, type) {
    let len = currentSave.savepackage.length;
    if (len <= id) {
        return false;
    }
    if (type === "add") {
        currentSave.savepackage[id] += num;
    }

    if (type === "remove") {
        currentSave.savepackage[id] -= num;
    }
    return true;
}
function use_item(id, num) {
    if (currentSave.savepackage[id] < num) {
        return false;
    } else {
        currentSave.savepackage[id] -= num;
        for (let i = 0; i < num; i++) {
            if (item_list[id].type === "change_Attribute") {
                for (let k = 0; k < item_list[id].effects.length; k++) {
                    command(item_list[id].effects[k]);
                }
            }
        }
    }
}

