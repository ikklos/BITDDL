import { readSaveString } from "./playerSaves.js";

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
                saveList = readSaveString(reader.result);
            });
        } else {
            Swal.fire("Fail to load", "No such file!", "error");
        }
    }
    input.click();
}

function savefordownload() {

}


document.getElementById('uploadbutton').onclick = loadfromfile;