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
        npc.name = Arr[i].name;
        npc.x = Arr[i].x;
        npc.y = Arr[i].y;
        npc.height = Arr[i].height;
        npc.width = Arr[i].width;
        npc.collideH = Arr[i].collideH;
        npc.hitbox = {};
        npc.type = Arr[i].type;
        npc.behave = Arr[i].behave;
        npc.nextmap = Arr[i].nextmap;
        npc.text = Arr[i].text;
        
        onmap.push(npc);
    }
}