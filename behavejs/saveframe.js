function exitFrame() {
    console.log(window.parent);
    window.parent.showMainMenu();
}
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  

Array.from(document.getElementsByClassName('load')).forEach(function(element, index) {
    // console.log("index = ",index);
    element.addEventListener("click", function(index) {
        // console.log("element = ",element);
        
        Swal.fire({
            title: "确认要读取这个存档吗？",
            icon:"info"
        }).then((result) => {
            if(result.isConfirmed) {
                if(localStorage.getItem(window.parent.userName + "_"+ element.id.replace('loadbutton','save_')) == null){
                    Toast.fire( {
                        title:"这个地方还没有存档哦，快去存一个吧",
                        icon:"error"
                    })
                }
                else{
                    window.parent.currentSave = localStorage.getItem(window.parent.userName + "_"+ element.id.replace('loadbutton','save_'));
                    Toast.fire( {
                        title:"读档成功！",
                        icon:"success"
                    })

                }
            }
        })
    }, false);
});
Array.from(document.getElementsByClassName('save')).forEach(function(element, index) {
    element.addEventListener("click", function(index) {
        // console.log(element.id.replace('save','sl_'));
        // console.log(window.parent.userName);
        
        Swal.fire({
            title: "确认要保存存档到这里吗？",
            icon:"info",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                let date = new Date,
                saveDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
                if(localStorage.getItem(window.parent.userName + "_"+ element.id.replace('button','_')) !== null ) {
                    localStorage.setItem(window.parent.userName + "_"+ element.id.replace('button','_'),window.parent.currentSave)
                    document.getElementById(element.id.replace('button','text')).innerHTML = saveDate;
                    localStorage.setItem(window.parent.userName + "_"+ element.id.replace('button','_') + "saveDate",saveDate)
                    console.log(element.id.replace('button','_'));
                    Toast.fire( {
                        title:"已覆盖旧存档!",
                        icon:"success"
                    })
                }
                else{
                    document.getElementById(element.id.replace('button','text')).innerHTML = saveDate;
                    
                    localStorage.setItem(window.parent.userName + "_"+ element.id.replace('button','_'),window.parent.currentSave)
                    localStorage.setItem(window.parent.userName + "_"+ element.id.replace('button','_') + "saveDate",saveDate)
                    console.log(element.id.replace('button','_'));
                    Toast.fire( {
                        title:"保存成功！",
                        icon:"success"
                    })
            }
            }
        })
    }, false);
});
document.getElementById('closeframebutton').onclick = exitFrame;
//监听用户是否登录
let intervalID = setInterval(function(){
    // console.log(window.parent.userName);
    if (window.parent.userName !== null){
        Array.from(document.getElementsByClassName('savetext')).forEach(function(element, index) {
            
            if(localStorage.getItem(window.parent.userName + "_"+ element.id.replace('text','_')) !== null ) {
                console.log(element.id.replace('text','_'));
                document.getElementById(element.id).innerHTML = localStorage.getItem(window.parent.userName + "_"+ element.id.replace('text','_') + "saveDate");
            }
        });
        clearInterval(intervalID);
    }
}
, 100)


    

// document.getElementById('uploadbutton').onclick = loadfromfile;
// document.getElementById('downloadbutton').onclick = savefordownload;

// import { getSaveString, readSaveString, defaultSave } from "./playerSaves.js";

// function updateList() {
//     console.log(window.parent.saveList);
//     let slist = document.getElementById('savelist');
//     slist.innerHTML = '';
//     for (let i = 0; i < window.parent.saveList.length; i++) {
//         let temp = document.createElement("button");
//         let text = window.parent.saveList[i].playerName + ':' + window.parent.saveList[i].saveDate;
//         temp.innerHTML = text;
//         temp.onclick = () => {
//             Swal.fire({
//                 title: 'Input Save Password',
//                 input: 'text',
//                 inputAttributes: {
//                     autocapitalize: 'off'
//                 },
//                 showCancelButton: true,
//                 confirmButtonText: 'Check',
//                 showLoaderOnConfirm: true,
//                 preConfirm: (txt) => {
//                     if (window.parent.saveList[i].password == txt) {
//                         window.parent.currentSaveIndex = i;
//                         Swal.fire("Loaded Save", text, "info");
//                     } else {
//                         Swal.fire("Failed", "Wrong Password", "error");
//                     }
//                 }
//             });
//         };
//         slist.appendChild(temp);
//     }
// }

// function loadfromfile() {
//     let input = document.createElement("input");
//     input.type = "file";
//     input.max = '1';
//     input.onchange = () => {
//         let file = input.files[0];
//         if (file) {
//             let reader = new FileReader();
//             reader.readAsText(file);
//             reader.addEventListener("load", (event) => {
//                 window.parent.saveList = readSaveString(reader.result);
//                 updateList();
//             });
//         } else {
//             Swal.fire("Fail to load", "No such file!", "error");
//         }
//     }
//     input.click();
// }

// function savefordownload() {
//     let str = getSaveString(window.parent.saveList);
//     let blob = new Blob([str]);
//     let url = URL.createObjectURL(blob);
//     let a_obj = document.createElement('a');
//     a_obj.href = url;
//     a_obj.download = new Date().toUTCString() + '.bitddl';
//     console.log(a_obj);
//     a_obj.click();
//     URL.revokeObjectURL(url);
// }

// function saveToCloud() {
//     console.log("1");
//     let str = getSaveString(window.parent.saveList);
//     return fetch(`../cloudSaves/writeSave.php?userid=${window.parent.userName}&save=${str}`)
//         .then(respon => {
//             if (!respon.ok) {
//                 throw new Error(respon.statusText)
//             } else
//                 Swal.fire("Success", "Saved to Cloud", "success");
//         })
//         .catch(error => {
//             Swal.showValidationMessage(
//                 `Request failed: ${error}`
//             );
//         });
// }
