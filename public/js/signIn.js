// var socket = io();

// $(document).ready(function () {
//     let id = getCookie('id');
//     if(id != ''){
//         socket.emit('checkID',id);
//     }
    
//     $("#signIn").click(function () {
//         socket.emit("signIn", {
//             user: $("#inputUsername").val(),
//             pass: $("#inputPassword").val()
//         });
//     });
//     socket.on('already_logged_in',function(){
//         window.location.href = '/';
//     });
//     socket.on('signIn_failed', function () {
//         alert("Error: Username/Password is invalid");
//     });
//     socket.on('invalid_password', function () {
//         alert("Error: Username/Password is invalid");
//     });
//     socket.on('logged_in',function (data) {
//         var name = "id"
//         var id = data.id
//         var d = new Date();
//         d.setTime(d.getTime() + (1*24*60*60*1000));
//         var expires = "expires="+ d.toUTCString();
//         document.cookie = name + "=" + id + ";" + expires + ";path=/";
//         window.location.href = '/' //redirect to join
//     });
// });