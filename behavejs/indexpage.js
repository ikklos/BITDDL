import { readSaveString } from "./playerSaves.js";

function startgame() {
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("maingameframe").style.visibility = 'visible';
}

function checksaves() {
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("savelistframe").style.visibility = 'visible';
}

function showMainMenu() {
    document.getElementById("startgamebutton").style.visibility = 'visible';
    document.getElementById("loadsavebutton").style.visibility = 'visible';
    document.getElementById("maingameframe").style.visibility = 'hidden';
    document.getElementById("savelistframe").style.visibility = 'hidden';
}

function passwordCheck() {
    Swal.fire({
        title: 'Login/Register',
        html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
  <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const login = Swal.getPopup().querySelector('#login').value;
            const password = Swal.getPopup().querySelector('#password').value;
            return fetch(`../cloudSaves/checkPasswd.php?userid=${login}&userpasswd=${password}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    response.text().then((text) => {
                        if (text == "Verified") {
                            Swal.fire({
                                title: "Login Success",
                                text: "Loading your cloud saves",
                                icon: "success",
                                preConfirm: () => {
                                    //window.saveList = readSaveString()
                                }
                            });
                        } else if (text == "Unknown") {

                        } else {
                            Swal.fire("Login Failed", "Wrong Password", "error");
                        }
                        console.log(text);
                    });
                    return response;
                })
                .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    );
                });
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}

if (document.getElementById("startgamebutton")) {
    document.getElementById("startgamebutton").onclick = startgame;
}
if (document.getElementById("loadsavebutton")) {
    document.getElementById("loadsavebutton").onclick = checksaves;
}
if (document.getElementById("loginbutton")) {
    document.getElementById("loginbutton").onclick = passwordCheck;
}