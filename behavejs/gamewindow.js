import { CrossTheBoader, HitTest, getHitBox, getPartHitBox } from "./collision.js";
import { keyboard } from './keyboard.js';
import { LoadItems } from "./Load_items.js";
//创建app对象，把预览加入DOM,app对象建议开全局
//修改画布 使得人物与背景大小匹配 1000*600 => 960*576

const appwidth = 960, appheight = 576;//for camara

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

status
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
let wait_event = { type: "null" };
var story_status = [];
var npc_pool = [];//npc池，这里的npc指一切的可交互对象
var npc_raw_data = [];//也是npc池，但这里读入的并不是npc对象，而是npc的基本数据，需要将其转换为npc
var BanariesPool = [];//banaries池
var currentSave = {//玩家状态
    playerName: 'tav',
    saveDate: '2077-8-20-23-55',
    password: '123',
    map: "../scene/shutong-home.json",
    time: 0,
    nekox: 336,
    nekoy: 312
};
let nowmap = {};
let neko = {};
let sheet;
var loaded = true;

//background sprite
const background = PIXI.Sprite.from('../backgrounds/TestGameBackground2.png');
background.width = appwidth * 0.5;
background.height = appheight * 0.5;
app.stage.addChild(background);

story_status[0] = 1;
for (let i = 1; i <= 2000; i++) {
    story_status.push(0);
}
//加载地图障碍

//初始化背包
let item_list = await LoadItems("../items/items.json");

if (typeof (currentSave.savepackage) == "undefined") {
    let pkg = [1];
    for (let i = 0; i < item_list.length; i++) {
        pkg[i] = 1;
    }
    currentSave.savepackage = pkg;
}


//进游戏！
AfterLoad();
async function AfterLoad() {
    sheet = await PIXI.Assets.load('sprite/players/neko.json');
    loadhero('neko_down', 336, 312);
    loadmap("../scene/shutong-home.json");

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let left = keyboard("ArrowLeft", "a"),
        up = keyboard("ArrowUp", "w"),
        right = keyboard("ArrowRight", "d"),
        down = keyboard("ArrowDown", "s");
    let keyf = keyboard("f", ""),
        keyp = keyboard("p", "e");
    //水平和垂直速度
    let hori, vertical;
    hori = 1.8; vertical = 1.4;
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
        console.log("f pressed!");
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
                            }
                        }
                    } else if (npc.type === "door") {
                        wait_event.type = "door";
                        wait_event.nextmap = npc.nextmap;
                        wait_event.door = npc;
                    }
                }
            });
        }

    }
    keyp.press = () => {
        showPackageBar();
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
        neko.vx *= delta; neko.vy *= delta;
        play(delta);
        neko.vx /= delta; neko.vy /= delta;
    }
}
app.stage.scale.set(2);

var vx = 0, vy = 0;
var nowframe = 0;
var count = 0;
function play(delta) {//基本所有的事件结算都在这里写

    //console.log("vx",neko.vx);
    // console.log(nowframe);

    //console.log(nowframe);
    if (loaded === false) {
        neko.vx = neko.vy = 0;
    }
    if (wait_event.type !== "null") {
        neko.vx = neko.vy = 0;
    }
    if (checkSaveUpdata()) {
        app.stage.removeChild(neko);
        loadhero('neko_down', currentSave.nekox, currentSave.nekoy);
        console.log(neko);
        loaded = false;
        loadmap(currentSave.map);
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
        loadhero('neko_down', wait_event.door.nextx, wait_event.door.nexty);
        console.log(neko);
        loaded = false;
        loadmap(wait_event.nextmap);

        wait_event.type = "null";
        wait_event.nextmap = null;
    }
    if (neko.vx !== vx || neko.vy !== vy) {

        if (neko.vx !== 0) {
            if (neko.vx > 0) { hero_face_to("right"); }
            if (neko.vx < 0) { hero_face_to("left"); }
        } else if (neko.vy < 0) {
            hero_face_to("up");
        } else if (neko.vy > 0) {
            hero_face_to("down");
        }
        vy = neko.vy; vx = neko.vx;
    }
    if (neko.vx !== 0 || neko.vy !== 0) {
        count++;
        if (count > 10) {
            nowframe = (nowframe + 1) % neko.totalFrames;
            count = 0;
        }
        neko.gotoAndPlay(nowframe);
    } else {
        neko.gotoAndStop(0);
        count = nowframe = 0;
    }
    if (neko.zIndex != neko.y + neko.height) {//改变高度时排序
        neko.zIndex = neko.y + neko.height;
        app.stage.sortChildren();
    }
    neko.x += neko.vx;
    if (CrossTheBoader(neko) || HitMap(neko)) {
        neko.x -= neko.vx;
    }
    neko.y += neko.vy;
    if (CrossTheBoader(neko) || HitMap(neko)) {
        neko.y -= neko.vy;
    }
    //console.log(neko.x,neko.y);
    app.stage.pivot.x = neko.x - appwidth * 0.25;
    app.stage.pivot.y = neko.y - appheight * 0.25;
    background.x = app.stage.pivot.x;
    background.y = app.stage.pivot.y;
    currentSave.nekox = neko.x, currentSave.nekoy = neko.y;

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


async function loadmap(url) {
    console.log("loading map:" + url);
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
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            console.log("in 1");
            nowmap = result;
            return result;
        }).then((result) => {
            console.log("in 2");
            npc_raw_data = result.npcs;
            return result;
        }).then((result) => {
            console.log("return");
            return result;
        }).then((result) => {
            var temp_npc_pool = [];
            console.log("set completed");
            console.log(result);
            app.stage.addChild(neko);
            console.log("add neko completed!");
            console.log(neko.x);
            console.log(neko.y);
            BanariesPool = result.banaries;
            nowmap.down = PIXI.Sprite.from(result.down);
            nowmap.down.name = "down";
            nowmap.up = PIXI.Sprite.from(result.up);
            nowmap.up.name = "up";
            app.stage.addChild(result.down);
            app.stage.addChild(result.up);
            console.log(result.npcs);
            for (let i = 0; i < result.npcs.length; i++) {
                console.log("loading npc...");
                let npc = PIXI.Sprite.from(result.npcs[i].img);
                console.log("success!");
                npc.hitbox = getHitBox(-10, -10, result.npcs[i].width + 20, result.npcs[i].height + 20);
                npc.behave = result.npcs[i].behave;
                npc.text = result.npcs[i].text;
                npc.name = result.npcs[i].name;
                npc.type = result.npcs[i].type;
                npc.x = result.npcs[i].x;
                npc.y = result.npcs[i].y;
                npc.height = result.npcs[i].height;
                npc.width = result.npcs[i].width;
                npc.nextmap = result.npcs[i].nextmap;
                console.log(npc.x);
                if (npc.type === "door") {
                    npc.nextx = result.npcs[i].nextx;
                    npc.nexty = result.npcs[i].nexty;
                }
                temp_npc_pool.push(npc);
            }
            for (let i = 0; i < temp_npc_pool.length; i++) {
                console.log("aaaa", temp_npc_pool.npcs);
                if (temp_npc_pool[i].type === "npc") solve_npc_behave(temp_npc_pool[i]);
                else if (temp_npc_pool[i].type === "door") {
                    app.stage.addChild(temp_npc_pool[i]);
                }
            }
            for (let i = 1; i < app.stage.children.length; i++) {
                app.stage.children[i].zIndex = app.stage.children[i].y + app.stage.children[i].height;
            }
            app.stage.getChildByName("up").zIndex = 10086;
            app.stage.getChildByName("down").zIndex = 0;
            app.stage.sortChildren();
            console.log("sort end");
            console.log(BanariesPool);
            loaded = true;
            npc_pool = temp_npc_pool;
            
        });
    currentSave.map = url;
    uploadSave();
}

/*commands
attribute|attr,name,change,xx     修改属性为xx
attribute|attr,name,delta,xx      属性增加xx
package|pkg,add|remove,id,num     增添背包物品
story_finish|sf,id                标记故事完成
show_avator|sav,url               显示头像图片
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
                if (strs[2] == "delta") {
                    currentSave[strs[1]] += num;
                    console.log(strs[1], "delta", num);
                }

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
            if (strs[1] != "add" && strs[1] != "remove") {
                console.log(`command "${str}" cannot be invoked."${strs[1]}" is not an option!`);
                break;
            }
            if (typeof currentSave[strs[2]] == "number") {
                console.log(`command "${str}" cannot be invoked."${strs[2]}" is not an number!`);
                break;
            }
            if (typeof currentSave[strs[3]] == "number") {
                console.log(`command "${str}" cannot be invoked."${strs[3]}" is not an number!`);
                break;
            }
            let itemid = Number(strs[2]);
            let itemnum = Number(strs[3]);
            if (itemid < 0 || itemid >= item_list.length) {
                console.log(`command "${str}" cannot be invoked."${strs[3]}" is not an item id!`);
                break;
            }
            if (strs[1] == 'add')
                currentSave.savepackage[itemid] += itemnum;
            else {
                if (itemnum > currentSave.savepackage[itemid]) currentSave.savepackage[itemid] = 0;
                else currentSave.savepackage[itemid] -= itemnum;
            }
            break;
        case 'sf':
        case 'story_finish':
            let num = Number(strs[1]);
            if (num == "NaN") {
                console.log(`command "${str}" cannot be invoked."${strs[1]}" is not a number!`);
                break;
            }
            if (typeof (story_status[num]) == "undefined") {
                console.log(`command "${str}" cannot be invoked.story "${strs[1]}" is not exist!`);
                break;
            }
            console.log("strike story:" + num);
            story_status[num] = 1;
            break;
        case 'sav':
        case 'show_avator':
            console.log('111' + strs[1]);
            window.parent.changeAvator(strs[1]);
            break;
        default:
            console.log(`command "${str}" cannot be invoked."${strs[0]}" cannot be recognized!`);
    }
}
function solve_npc_behave(npc) {//约定npc只有简单的行为，如出现，消失，（先不考虑实现->固定速率行走，循环行走等更多行为）
    let fin = false;

    if (typeof (npc.behave) == "undefined") {
        app.stage.addChild(npc);
        return;
    }
    let Arr = npc.behave;
    for (let i = 0; i < Arr.length; i++) {
        console.log("check behave...");
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
function CheckPrelist(pre) {//event no_event，//multi_item//item, attribute_value //random
    console.log(pre);
    if (typeof (pre) == "undefined") return true;
    for (let i = 0; i < pre.length; i++) {

        if (pre[i].type === "event") {
            let num = pre[i].num;
            for (let k = 0; k < pre[i].list.length; k++) {
                if (story_status[pre[i].list[k]] === 1) num--;
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
        } else if (pre[i].type === "no_event") {
            for (let k = 0; k < pre[i].list.length; k++)
                if (story_status[pre[i].list[k]] === 1) return false;
        } else if (pre[i].type === "random") {
            let num = pre[i].possibility;
            if (Math.random() < num) return true;
        } else if (pre[i].type === "attribute") {
            let num = pre[i].num;
            for (let k = 0; k < pre[i].list.length; k++) {

                switch (pre[i].list[k].type) {
                    case "equal":
                        if (currentSave[pre[i].list[k].attrid] === pre[i].list[k].value) {
                            num--;
                        }
                        break;
                    case "less than":
                        if (currentSave[pre[i].list[k].attrid] <= pre[i].list[k].value) {
                            num--;
                        }
                        break;
                    case "more than":
                        if (currentSave[pre[i].list[k].attrid] >= pre[i].list[k].value) {
                            num--;
                        }
                        break;
                }
            }
            if (num > 0) {
                return false;
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
    wait_event.times++;
    if (typeof (text.strike_event) != "undefined" && text.strike_event.length > 0)
        for (let i = 0; i < text.strike_event.length; i++)
            command(text.strike_event[i]);
    if (wait_event.times == 1) {
        window.parent.showDialog(wait_event.text);
        wait_event.times = 1;
        return;
    }
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

// function oprate_pakage(id, num, type) {
//     let len = currentSave.savepackage.length;
//     if (len <= id) {
//         return false;
//     }
//     if (type === "add") {
//         currentSave.savepackage[id] += num;
//     }

//     if (type === "remove") {
//         currentSave.savepackage[id] -= num;
//     }
//     return true;
// }
// function use_item(id, num) {
//     if (currentSave.savepackage[id] < num) {
//         return false;
//     } else {
//         currentSave.savepackage[id] -= num;
//         for (let i = 0; i < num; i++) {
//             if (item_list[id].type === "change_Attribute") {
//                 for (let k = 0; k < item_list[id].effects.length; k++) {
//                     command(item_list[id].effects[k]);
//                 }
//             }
//         }
//     }
// }
//控制游戏窗口自动缩放
function bodyScale() {
    let devicewidth = document.documentElement.clientwidth;
    let deviceheight = document.documentElement.clientHeight;
    var scalex = devicewidth / 1100;
    var scaley = deviceheight / 660;
    scalex <= scaley ? document.body.style.zoom = scalex : document.body.style.zoom = scaley;
}
bodyScale();
function hero_face_to(dir) {
    let rec = neko;
    app.stage.removeChild(neko);
    if (dir === "left") {
        neko = new PIXI.AnimatedSprite(sheet.animations["neko_left"]);
    } else if (dir === "right") {
        neko = new PIXI.AnimatedSprite(sheet.animations["neko_right"]);
    } else if (dir === "up") {
        neko = new PIXI.AnimatedSprite(sheet.animations["neko_up"]);
    } else if (dir === "down") {
        neko = new PIXI.AnimatedSprite(sheet.animations["neko_down"]);
    }
    neko.name = "hero";
    neko.width = 24;
    neko.height = 24;
    neko.hitbox = rec.hitbox;
    neko.x = rec.x;
    neko.y = rec.y;
    neko.vx = rec.vx; neko.vy = rec.vy;
    neko.animationSpeed = 0.1;
    //console.log(neko);
    app.stage.addChild(neko);
}

//显示背包
function showPackageBar() {
    let pkg = [];
    /*console.log(currentSave.savepackage);
    for (let i = 0; i < item_list.length; i++) {
        if (typeof (currentSave.savepackage[i]) == 'undefined' || currentSave.savepackage[i] == 0) continue;
        pkg.push({ id: i, num: currentSave.savepackage[i] });
    }*/
    pkg = [{ id: 1, num: 1 }, { id: 3, num: 3 }]
    window.parent.showPackageBar(pkg, item_list);
}

function uploadSave() {
    window.top.currentSave.data = currentSave;
    window.top.currentSave.events = story_status;
}

function checkSaveUpdata() {
    if (!window.top.saveChanged) return false;
    currentSave = window.top.currentSave.data;
    story_status = window.top.currentSave.events;
    window.top.saveChanged = false;
    console.log(window.top.currentSave);
    return true;
}