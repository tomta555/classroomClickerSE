var socket = io();
var udetail;
var newCourseId;
var allHomework;
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
        socket.emit('get-course-id');
    });
    
    socket.on('user-detail',function(user){
        udetail = user;
        socket.emit('get-all-homework');
    })
    socket.on('allHw', function(data){
        allHomework = data;
        socket.emit('get-courses', String(udetail.local.username));
    });
    socket.on('course-detail', function( data ){
        if(data == undefined){
            alert("Can't find that course.")
        }else{
            var addbutton = document.getElementById("addCourseButton");
            if(addbutton != undefined) addbutton.remove();
            if(data.length == undefined){
                data.students.push(udetail.local.username);
                socket.emit('update-course', data);
                data = [data];
            }
            for(let i=0; i<data.length; i++){
                var n = 0;
                for(let j=0; j<allHomework.length; j++){
                    if(allHomework[j].courseId == data[i].id){
                        if(udetail.local.isTeacher){
                            n++;
                        }else if (!allHomework[j].submitedStd.includes(udetail.local.studentID) ){
                            n++;
                        }
                    } 
                }
                showCourse(data[i],n);
            }
            showAddCourseButton();
            if(!udetail.local.isTeacher) {
                var b = document.getElementById('addCourseButton');
                b.setAttribute('onclick', "document.getElementById('addmePopUp').style.display='block'");
            }
        }
    });
    socket.on('new-course-id', (data) => {
        newCourseId = parseInt(data);
    });
});

function addCourse(){
    var courseid = newCourseId;
    var coursename = document.getElementById('coursename').value;
    var coursedesc = document.getElementById('coursedesc').value;
    var creator = udetail.local.username;
    var teachers = [];
    var students = [];
    var tags = [];
    teachers.push(creator);
    var course = {"id":courseid,"name":coursename,"desc":coursedesc, "creator":creator, "teachers":teachers, "students":students, "tags":tags, "homeworks":[]};
    document.getElementById("addCourseButton").remove();
    showCourse(course);
    showAddCourseButton();
    socket.emit('get-course-id');
    socket.emit("addCourse", course);
    document.getElementById('createPopUp').style.display='none';
}

function showCourse(data, n){
    console.log(data);
    var link;
    if(udetail.local.isTeacher){
        link = `/courseInfo?courseId=${data.id}`; 
    }else{
        link = `/courseInfoStu?courseId=${data.id}`;
    }
    var courseList = document.getElementById("courseList");
    var course = `
        <button id="course${data.id}" class = "backButton" style=" font-size:44px;" onclick = "window.location.href = '${link}'" >${data.name}<br>
            <label style = "font-size:25px">${data.desc}</label><br><br><br>
            <label style = "font-size:18px;">Homework ${n}.</label>
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

function findCourse(id){
    document.getElementById('addmePopUp').style.display='none';
    socket.emit('get-course-detail', {'id': id});
}

