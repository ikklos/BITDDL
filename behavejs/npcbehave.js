var onmap = [];
export function SetNPCs(lk){
    fetch(lk)
    .then(response => response.json())
    .then(json => putnpc(json));

    return onmap;
}

function putnpc(json){
    let Arr = json.npcs;
    console.log(Arr);
    for(let i = 0; i < Arr.length; i++){
        let npc = {};
        npc.img = Arr[i].img;
        npc.x = Arr[i].x;
        npc.y = Arr[i].y;
        npc.height = Arr[i].height;
        npc.width = Arr[i].width;
        npc.collideH = Arr[i].collideH;
        npc.hitbox = {};
        npc.fstory = Arr[i].fstory;
        npc.text = Arr[i].text;
        npc.name = Arr[i].name;
        npc.type = Arr[i].type;
        npc.nextmap = Arr[i].nextmap;
        onmap.push(npc);
    }
}