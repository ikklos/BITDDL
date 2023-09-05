var dialogResult = -1;
var minigame_output = {};
function clearTextArea() {
    document.getElementById("maintextContainer").innerHTML = "";
    document.getElementById("optionsContainer").innerHTML = "";
    console.log("vistag1");
    document.getElementById("toolbar").style.visibility = "hidden";
}
function changeAvator(url) {
    document.getElementById('character_avator').src = url;
}
function showDialog(text) {

    let texta = document.getElementById("text_area");
    texta.focus();

    let text_br = document.createElement("br");
    let maintextContainer = document.getElementById("maintextContainer");
    let optionsContainer = document.getElementById("optionsContainer");
    maintextContainer.innerHTML = "";
    optionsContainer.innerHTML = "";

    if (text.content.length < 30) {
        // console.log("<<<");

        let maintextContainer_line1 = document.createElement("div");
        maintextContainer_line1.className = "maintextContainer_line1";
        maintextContainer.appendChild(maintextContainer_line1);
        let maintext_line1 = document.createElement("div");
        maintext_line1.innerHTML = text.content;
        maintextContainer_line1.appendChild(maintext_line1);
    }
    else {
        // console.log(">>>");
        let maintextContainer_line1 = document.createElement("div");
        let maintextContainer_line2 = document.createElement("div");

        maintextContainer_line1.className = "maintextContainer_line1";
        maintextContainer_line2.className = "maintextContainer_line2";

        maintextContainer.appendChild(maintextContainer_line1);
        maintextContainer.appendChild(maintextContainer_line2);

        let maintext_line1 = document.createElement("div");
        let maintext_line2 = document.createElement("div");

        maintext_line1.innerHTML = text.content.substr(0, 30);
        maintext_line2.innerHTML = text.content.substr(30, text.content.length - 30);

        maintextContainer_line1.appendChild(maintext_line1);
        maintextContainer_line2.appendChild(maintext_line2);
        setTimeout(() => {
            // 清除第一行光标
            maintext_line1.style.animation = "typing 0.8s steps(15,end) forwards";
        }, 850);
    }
    console.log("vistag2");
    document.getElementById("toolbar").style.visibility = "visible";

    if (typeof (text.options) != "undefined" && text.options.length > 0) {
        if (text.options.length > 0)
            for (let i = 0; i < text.options.length; i++) {
                let tmp = document.createElement("div");
                tmp.className = "option_text";
                tmp.innerHTML = text.options[i].name + ' ' + text.options[i].content;
                tmp.addEventListener("click", function () {
                    dialogResult = i;
                    console.log(dialogResult, "dialogResult");
                });
                optionsContainer.appendChild(tmp);
            }
    } else {
        console.log("结束");
        console.log(text);
        let tmp = document.createElement("div");
        tmp.className = "option_text";
        tmp.innerHTML = "*结束*";
        tmp.addEventListener("click", function () {
            dialogResult = 0;
            focusMainGame();
        });
        optionsContainer.appendChild(tmp);
    }

}
function focusMainGame() {
    document.getElementById("maingameframe").focus();
    console.log("focus!");
}

//package:[{id:xx,num:xx}]
function showPackageBar(package, itemlist) {
    console.log(package);
    let listelem = document.getElementById('packagelist');
    listelem.innerHTML = '';
    package.forEach(item => {
        let tmp = document.createElement('div');
        tmp.innerHTML = itemlist[item.id].name + ':' + item.num;
        tmp.addEventListener("click", function () {

            document.getElementById('item_img').src = '../items/img/backpack.png';
            document.getElementById('item_describe').innerHTML = itemlist[item.id].text;

            // 更改display属性 和边框长度
            item_styleChange(1);
        });
        listelem.appendChild(tmp);
    });
    if (document.getElementById('packagebar').style.opacity == 1)
        document.getElementById('packagebar').style.opacity = 0;
    else
        document.getElementById('packagebar').style.opacity = 1;
}
//about quest bar
function triggerQuestBar(quests) {
    console.log(quests);
    let qstlist = document.getElementById('diarybar');
    qstlist.innerHTML = '';
    for (let item in quests) {
        item = quests[item];
        console.log(item);
        let tmpdiv = document.createElement('div');
        let title = document.createElement('h1');
        title.innerHTML = item.name;
        tmpdiv.appendChild(title);
        for (let cmt in item.list) {
            cmt = item.list[cmt];
            if (cmt.type == 'title') {
                let tmp = document.createElement('h2');
                tmp.innerHTML = cmt.text;
                tmpdiv.appendChild(tmp);
            }
            else if (cmt.type == 'word') {
                let tmp = document.createElement('p');
                tmp.innerHTML = cmt.text;
                tmpdiv.appendChild(tmp);
            }
        }
        qstlist.appendChild(tmpdiv);
    }
    if (document.getElementById('diarybar').style.visibility == 'visible')
        document.getElementById('diarybar').style.visibility = 'hidden';
    else
        document.getElementById('diarybar').style.visibility = 'visible'
}

function item_styleChange(num) {
    // 更改display属性 和边框长度
    if (num == 1) {

        // document.getElementById("packagebar").style.transform = "translateX(-100%)"
        document.getElementById("packagebar").style.width = "450px"
        document.getElementsByClassName("item_button")[0].style.display = "none"
        document.getElementsByClassName("item_button")[1].style.display = "block"
        document.getElementById("maingameframe").focus();
        setTimeout(() => {
            document.getElementById('item_img').style.display = "block";
            document.getElementById('item_describe').style.display = "block";
        }, 500);
    }
    else {
        // document.getElementById("packagebar").style.transform = "translateX(-230%)"
        document.getElementById('item_img').style.display = "none";
        document.getElementById('item_describe').style.display = "none";
        document.getElementById("packagebar").style.width = "195px"
        document.getElementsByClassName("item_button")[0].style.display = "block"
        document.getElementsByClassName("item_button")[1].style.display = "none"
        document.getElementById("maingameframe").focus();
    }
}

//for slide
function hideAllComponents() {

    document.getElementById('packagebar').style.opacity = 0;
    document.getElementById('diarybar').style.visibility = 'hidden';
    document.getElementById("maingameframe").focus();
    clearTextArea();
}


