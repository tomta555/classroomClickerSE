var socket = io();
var udetail;
$(document).ready(function () {
    socket.on('connect',function () {
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(user){
        udetail = user;
        socket.emit('get-courses', String(udetail._id));
    })

    socket.on('course-detail', function( data ){
        console.log(data);
        for(let i=0; i<data.length; i++){
            addCourseButton(data[i]);
        }
    });

    function addCourseButton(data){
        var link;
        if(udetail.local.isTeacher){
            link = `/courseInfo?courseId=${data.id}`; 
        }else{
            link = `/courseInfoStu?courseId=${data.id}`;
        }
        var courseList = document.getElementById("courseList");
        var course = `
            <button class = "backButton" style=" font-size:44px;" onclick = "window.location.href = '${link}'" >${data.name}<br>
                <label style = "font-size:25px">Description...here...</label><br><br><br>
                <label style = "font-size:18px;">Homekwork...here...</label>
            </button>`;
        courseList.innerHTML += course;
    }
});