// import { readSaveString } from "./playerSaves.js";

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



function startgame() {
    if (userName == null) {
        Toast.fire({
            title: "请先登录！",
            icon: 'info',
            didClose: (toast) => {
                passwordCheck_log();
            }
        })
        return;
    }
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("gametitle").style.visibility = 'hidden';
    document.getElementById("aboutusbutton").style.visibility = 'hidden';
    document.getElementById("maingameframe").style.visibility = 'visible';
}

function checksaves() {
    if (userName == null) {
        Toast.fire({
            title: "请先登录！",
            icon: 'info',
            didClose: (toast) => {
                passwordCheck_log();
            }
        })
        return;
    }
    document.getElementById("startgamebutton").style.visibility = 'hidden';
    document.getElementById("loadsavebutton").style.visibility = 'hidden';
    document.getElementById("gametitle").style.visibility = 'hidden';
    document.getElementById("aboutusbutton").style.visibility = 'hidden';
    document.getElementById("savelistframe").style.visibility = 'visible';
}

function passwordCheck_log() {
    (async () => {
        const { value: userValues } = await Swal.fire({
            title: 'Login',
            html:
                `<input type="text" id="login" class="swal2-input" placeholder="Username">
         <input type="password" id="password" class="swal2-input" placeholder="Password">`,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText: '登录',
            denyButtonText: '注册',
            showLoaderOnConfirm: true,
            preDeny: () => {
                return 'flag_changepage';
            },
            preConfirm: () => {
                return [
                    document.getElementById('login').value,
                    document.getElementById('password').value
                ]
            }
        })
        if (userValues == 'flag_changepage') {
            return passwordCheck_reg();
        }
        else if (window.userName !== null) {
            Swal.fire({
                title: "已经登录了！",
                icon: 'info'
            })
        }
        else if (userValues[0] == '' || userValues[1] == '') {
            Swal.fire({
                title: "交卷的时候不能空题哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })

        }
        else if (localStorage.getItem(userValues[0]) == null) {
            Swal.fire({
                title: "这个用户名还没有注册哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else if (localStorage.getItem(userValues[0]) !== userValues[1]) {
            Swal.fire({
                title: "密码输入错误！",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else if (localStorage.getItem(userValues[0]) == userValues[1]) {
            window.userName = userValues[0];
            document.getElementById("logbutton").style.visibility = 'hidden';
            document.getElementById("regbutton").style.visibility = 'hidden';
            document.getElementById("logged").style.visibility = 'visible';
            document.getElementById("logged").innerHTML = "已登录" + "<br><br>" + "用户名：" + userValues[0];
            Toast.fire({
                title: "登录成功！",
                icon: 'info'
            })
        }
        else {
            console.log("error");
        }
    })()
}
function passwordCheck_reg() {
    // console.log("注册界面");
    (async () => {
        const { value: userValues } = await Swal.fire({
            title: 'Register',
            html:
                `<input type="text" id="login" class="swal2-input" placeholder="Username">
         <input type="password" id="password" class="swal2-input" placeholder="Password">
         <input type="password" id="password_cfm" class="swal2-input" placeholder="Confirm Password">`,
            focusConfirm: false,
            showDenyButton: true,
            confirmButtonText: '注册',
            denyButtonText: '登录',
            showLoaderOnConfirm: true,
            preDeny: () => {
                return 'flag_changepage';
            },
            preConfirm: () => {
                return [
                    document.getElementById('login').value,
                    document.getElementById('password').value,
                    document.getElementById('password_cfm').value
                ]
            }
        })
        console.log(userValues[0]);
        console.log(userValues[1]);
        console.log(userValues[2]);
        if (userValues == 'flag_changepage') {
            return passwordCheck_log();
        }
        else if (userValues[0] == '' || userValues[1] == '' || userValues[2] == '') {
            Swal.fire({
                title: "交卷的时候不能空题哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_reg();
                }
            })
        }
        else if (userValues[1] !== userValues[2]) {
            Swal.fire({
                title: "两次密码不一样哦",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_reg();
                }
            })
        }
        else if (localStorage.getItem(userValues[0]) !== null) {
            Swal.fire({
                title: "看来你已经注册过了",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else if (userValues[1] === userValues[2]) {
            localStorage.setItem(userValues[0], userValues[1]);
            console.log("saved!");
            Toast.fire({
                title: "注册成功！",
                icon: 'info',
                didClose: () => {
                    return passwordCheck_log();
                }
            })
        }
        else {
            console.log("error");
        }
    })()
}
//     preConfirm: () => {
//         const login = Swal.getPopup().querySelector('#login').value;
//         const password = Swal.getPopup().querySelector('#password').value;
//         return fetch(`../cloudSaves/checkPasswd.php?userid=${login}&userpasswd=${password}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(response.statusText)
//                 }
//                 response.text().then((text) => {
//                     if (text == "Verified") {
//                         window.userName = login;
//                         Swal.fire({
//                             title: "Login Success",
//                             text: "Loading your cloud saves",
//                             icon: "success",
//                             preConfirm: () => {
//                                 return fetch(`../cloudSaves/getSave.php?userid=${login}`)
//                                     .then(respon => {
//                                         window.saveList = [];
//                                         if (respon.status == 404) {
//                                             Swal.fire("No Cloud Save", "Why not upload/create one?~", "info");
//                                         } else if (!respon.ok) {
//                                             throw new Error(respon.statusText)
//                                         } else
//                                             respon.text().then((txt) => {
//                                                 window.saveList = readSaveString(txt);
//                                             });
//                                     })
//                                     .catch(error => {
//                                         Swal.showValidationMessage(
//                                             `Request failed: ${error}`
//                                         );
//                                     });
//                             }
//                         });
//                     } else if (text == "Unknown") {
//                         Swal.fire({
//                             title: "Unknown UserId",
//                             text: "Do you want to register?",
//                             showCancelButton: true,
//                             icon: "question",
//                             preConfirm: () => {
//                                 window.userName = login;
//                                 return fetch(`../cloudSaves/addUser.php?userid=${login}&userpasswd=${password}`)
//                                     .then(respon => {
//                                         if (!respon.ok) {
//                                             throw new Error(respon.statusText)
//                                         }
//                                         Swal.fire("Register Success", "Welcome to BITDDL!", "success");
//                                     })
//                                     .catch(error => {
//                                         Swal.showValidationMessage(
//                                             `Request failed: ${error}`
//                                         );
//                                     });
//                             }
//                         });
//                     } else if (text == "Wrong") {
//                         Swal.fire("Login Failed", "Wrong Password", "error");
//                     } else {
//                         Swal.fire("Illegal Response", "The PHP Service may not be running.\nPlease Contact Website Manager", "error");
//                     }
//                 });
//                 return response;
//             })
//             .catch(error => {
//                 Swal.showValidationMessage(
//                     `Request failed: ${error}`
//                 );
//             });
//     },
//     allowOutsideClick: () => !Swal.isLoading()

if (document.getElementById("startgamebutton")) {
    document.getElementById("startgamebutton").onclick = startgame;
}
if (document.getElementById("loadsavebutton")) {
    document.getElementById("loadsavebutton").onclick = checksaves;
}
if (document.getElementById("logbutton")) {
    document.getElementById("logbutton").onclick = passwordCheck_log;
}
if (document.getElementById("regbutton")) {
    document.getElementById("regbutton").onclick = passwordCheck_reg;
}


function iframeAutoFit(iframeObj) {
    setTimeout(
        function () {
            if (!iframeObj) {
                return;
            }
            console.log("auto fit height");
            iframeObj.height = (
                iframeObj.Document ?
                    iframeObj.Document.body.scrollHeight
                    : iframeObj.contentDocument.body.offsetHeight
            );
        }
        , 200)
}
//调整iframe大小
window.onload = function () {
    // iframeAutoFit(document.getElementById('maingameframe'));
    // iframeAutoFit(document.getElementById('savelistframe'));
};