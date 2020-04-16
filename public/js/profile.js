var socket = io();

$(document).ready(function () {

    socket.on('connect',function () {
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(udetail){
        if (udetail.local.isTeacher){
            document.getElementById("greeting").innerHTML = `
                <h2 style="color: purple">Welcome! </h2>
                <h3>you have logged in as ${udetail.local.fname}  ${udetail.local.lname}</h3>
                <span class="image centered img"><img src="../../assets/css/images/teacher1.jpg"  alt="" /></span>`
        }else{
            document.getElementById("greeting").innerHTML = `
                <h2 style="color: purple">Welcome! </h2>
                <h3>${udetail.local.studentID}</h3>
                <h3>You have logged in as ${udetail.local.fname} ${udetail.local.lname}</h3>
                <span class="image centered img"><img src="../../assets/css/images/student.jpg"  alt="" /></span>`
            document.getElementById("quizlink").setAttribute("href","/join")
        }
    })
});
