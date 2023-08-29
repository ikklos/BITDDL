let item_list = [];
export function LoadItems(url){
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
        for(let i = 0; i < json.itemlist.length; i++){
            item_list[i] = json.itemlist[i];
        }
    })

    return item_list;
}