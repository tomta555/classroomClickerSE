var socket = io();
var udetail;
// Get the modal
var modal = document.getElementById('createPopUp');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

$(document).ready(function () {
    socket.on('connect',function () {
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(user){
        udetail = user;
        socket.emit('get-courses', String(udetail.local.username));
    })
    socket.on('course-detail', function( data ){
        for(let i=0; i<data.length; i++){
            showCourse(data[i]);
        }
        showAddCourseButton();
    });
    
});

function addCourse(){
    var courseid = document.getElementById('courseid').value;
    var coursename = document.getElementById('coursename').value;
    var coursedesc = document.getElementById('coursedesc').value;
    var creator = udetail.local.username;
    var teachers = [];
    var students = [];
    var tags = [];
    teachers.push(creator);
    var course = {"id":courseid,"name":coursename,"desc":coursedesc, "creator":creator, "teachers":teachers, "students":students, "tags":tags};
    document.getElementById("addCourseButton").remove();
    showCourse(course);
    showAddCourseButton();
    socket.emit("addCourse", course);
}

function showCourse(data){
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

function showAddCourseButton(){
    var courseList = document.getElementById("courseList");
    var addCourseButton = `
        <button id="addCourseButton" class = "createCard" onclick="document.getElementById('createPopUp').style.display='block'">
            <div>Add New Course</div><br>
            <div class = "plus"><img src = "../img/plus.png"></div>
        </button>
    `;
    courseList.innerHTML += addCourseButton;

}