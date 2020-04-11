var socket = io();

$(document).ready(function () {

    socket.on('connect',function () {
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(udetail){
        if (udetail.local.isTeacher){
            document.getElementById("greeting").innerHTML = `<h3 style="color: purple">Greeting  Teacher: </h3><h2>`+udetail.local.fname+" "+udetail.local.lname+`</h2><span class="image centered img"><img src="../../assets/css/images/teacher1.jpg"  alt="" /></span>`
        }else{
            document.getElementById("greeting").innerHTML = `<h3 style="color: purple">Greeting  Student: `+udetail.local.studentID+`</h3><h2>`+udetail.local.fname+" "+udetail.local.lname+`</h2><span class="image centered img"><img src="../../assets/css/images/student.jpg"  alt="" /></span>`
        }
        console.log(udetail)
    })
});
