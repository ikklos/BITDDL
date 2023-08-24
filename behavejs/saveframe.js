import { getSaveString, readSaveString } from "./playerSaves.js";


function loadfromfile() {
    let input = document.createElement("input");
    input.type = "file";
    input.max = '1';
    input.onchange = () => {
        let file = input.files[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener("load", (event) => {
                window.parent.saveList = readSaveString(reader.result);
            });
        } else {
            Swal.fire("Fail to load", "No such file!", "error");
        }
    }
    input.click();
}

function savefordownload() {
    let str = getSaveString(window.parent.saveList);
    let blob = new Blob([str]);
    let url = URL.createObjectURL(blob);
    let a_obj = document.createElement('a');
    a_obj.href = url;
    a_obj.download = new Date().toUTCString() + '.bitddl';
    console.log(a_obj);
    a_obj.click();
    URL.revokeObjectURL(url);
}


document.getElementById('uploadbutton').onclick = loadfromfile;
document.getElementById('downloadbutton').onclick = savefordownload;