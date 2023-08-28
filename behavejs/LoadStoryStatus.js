//不清楚那个存档是怎么弄的，总之这个是需要从存档里面读每一个剧情的完成情况

var sto = [];
export function LoadStories(url){
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            for(let i = 0; i < json.story.length; i++){
                sto[i] = json.story[i];
            }
        })

    return sto;
}