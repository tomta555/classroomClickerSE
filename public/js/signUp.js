var socket = io();

$(document).ready(function () {  
    function validateField(){
        var user = $("#inputUsername").val()
        var pass = $("#inputPassword").val()
        var confirmPass = $("#confirmPassword").val()
        var stdID = $("#studentID").val()
        if(user!='' && pass != '' && confirmPass != '' && stdID != ''){
            if(pass == confirmPass) {
                return 1;
            }else{
                return 2
            }
        }else{
            return 0;
        }
      }

    $("#signUp").click(function () {
        if (validateField() == 1){
            socket.emit('signUp', {
                user: $("#inputUsername").val(),
                pass: $("#inputPassword").val(),
                id : $("#studentID").val()
            });
        }else if(validateField() == 2){
            alert("Password do not match!");
        }else{
            alert("Please input all field!");
        }

    });
    socket.on('register_failed', function () {
        alert("Username/studentID already exists, Please try again!");
    });

    socket.on('error', function () {
        alert("Error: Please try again!");
    });

    socket.on('register_succeeded', function(){
        window.location.href = '/'

    });
});