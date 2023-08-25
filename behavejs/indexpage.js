import { readSaveString } from "./playerSaves.js";

function startgame() {
    if (userName == null) {
        passwordCheck();
        return;
    }
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("maingameframe").style.visibility = 'visible';
}

function checksaves() {
    if (userName == null) {
        passwordCheck();
        return;
    }
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("savelistframe").style.visibility = 'visible';
    document.getElementById("savelistframe").contentWindow.onSaveFrameOpen();
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
                            window.userName = login;
                            Swal.fire({
                                title: "Login Success",
                                text: "Loading your cloud saves",
                                icon: "success",
                                preConfirm: () => {
                                    return fetch(`../cloudSaves/getSave.php?userid=${login}`)
                                        .then(respon => {
                                            window.saveList = [];
                                            if (respon.status == 404) {
                                                Swal.fire("No Cloud Save", "Why not upload/create one?~", "info");
                                            } else if (!respon.ok) {
                                                throw new Error(respon.statusText)
                                            } else
                                                respon.text().then((txt) => {
                                                    window.saveList = readSaveString(txt);
                                                });
                                        })
                                        .catch(error => {
                                            Swal.showValidationMessage(
                                                `Request failed: ${error}`
                                            );
                                        });
                                }
                            });
                        } else if (text == "Unknown") {
                            Swal.fire({
                                title: "Unknown UserId",
                                text: "Do you want to register?",
                                showCancelButton: true,
                                icon: "question",
                                preConfirm: () => {
                                    window.userName = login;
                                    return fetch(`../cloudSaves/addUser.php?userid=${login}&userpasswd=${password}`)
                                        .then(respon => {
                                            if (!respon.ok) {
                                                throw new Error(respon.statusText)
                                            }
                                            Swal.fire("Register Success", "Welcome to BITDDL!", "success");
                                        })
                                        .catch(error => {
                                            Swal.showValidationMessage(
                                                `Request failed: ${error}`
                                            );
                                        });
                                }
                            });
                        } else if (text == "Wrong") {
                            Swal.fire("Login Failed", "Wrong Password", "error");
                        } else {
                            Swal.fire("Illegal Response", "The PHP Service may not be running.\nPlease Contact Website Manager", "error");
                        }
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