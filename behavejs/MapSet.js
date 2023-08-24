var onmap = [];
export function SetMap(lk){
    fetch(lk)
    .then(response => response.json())
    .then(json => writemap(json));

    return onmap;
}

function writemap(json){
    let Arr = json.banaries;
    //console.log(Arr);
    for(let i = 0; i < Arr.length; i++){
        let box = {};
        box.x = Arr[i].x;
        box.y = Arr[i].y;
        box.height = Arr[i].height;
        box.width = Arr[i].width;
        box.collideH = Arr[i].collideH;
        box.hitbox = {};
        onmap.push(box);
    }
}