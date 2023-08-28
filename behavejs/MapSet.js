var onmap = {};
export function SetMap(lk){
    fetch(lk)
    .then(response => response.json())
    .then(json => {
        onmap.down = json.down;
        onmap.up = json.up;
        onmap.npcs = json.npcs;
        onmap.banaries = json.banaries;
    });
    console.log(onmap);
    return onmap;
}