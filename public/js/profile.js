var socket = io();

$(document).ready(function () {

    socket.on('connect',function () {
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(udetail){
        if (udetail.local.isTeacher){
            document.getElementById("greeting").innerHTML = `<p>Greeting  Teacher `+udetail.local.fname+" "+udetail.local.lname+`</p>`
        }else{
            document.getElementById("greeting").innerHTML = `<p>Greeting  Student `+udetail.local.fname+" "+udetail.local.lname+`</p>`
        }
        console.log(udetail)
    })
});
