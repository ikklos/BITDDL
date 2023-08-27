// function loadSave() {
//     Swal.fire({
//         title: "确认要读取这个存档吗？",
//         icon:"info"
//     });
// }
// function addNewSave() {
//     Swal.fire({
//         title: "确认要加载这个存档吗？",
//         icon:"info"
//     });
// }
function exitFrame() {
    console.log(window.parent);
    window.parent.showMainMenu();
}


Array.from(document.getElementsByClassName('load')).forEach(function(element, index) {
    element.addEventListener("click", function(e) {
        alert('something');
    }, false);
});
// Array.from(document.getElementsByClassName('save_button')).forEach(function(element, index) {
//     element.onclick = loadSave;
// });
document.getElementById('closeframebutton').onclick = exitFrame;
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
