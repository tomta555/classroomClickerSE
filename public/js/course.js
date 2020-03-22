var socket = io();
var params = jQuery.deparam(window.location.search);
var udetail;
var courseDetail;
var teacherInCourse = [];
var teacherNotInCourse = [];
var studentInCourse = [];
var studentNotInCourse = [];
var modal = document.getElementById('addPopUp');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

socket.on('connect', function(){
    socket.emit('get-user-detail');
    socket.emit('get-course-detail', {"id": parseInt(params.courseId)});
    socket.emit('requestDbHW', {"courseId": params.courseId});//Get database names to display to user
    socket.emit('requestDbNames', {"courseId": params.courseId});
});

socket.on('user-detail',function(user){
    udetail = user;
    if(user.local.isTeacher){
        var createHwButton = document.getElementById("createHwButton");
        var createQuizButton = document.getElementById("createQuizButton");
        createHwButton.setAttribute("onclick", `window.location.href = '../create?courseId=${params.courseId}&type=createHw'`);
        createQuizButton.setAttribute("onclick", `window.location.href = '../create?courseId=${params.courseId}&type=createQuiz'`);
    }else{

    }
});

socket.on('course-detail', function(data){
    courseDetail = data;
    socket.emit('get-users');
});

socket.on('users-detail', function(data){
    for(var i=0; i<data.length; i++){
        if(data[i].local.isTeacher){
            if(courseDetail.teachers.includes(data[i].local.username)) teacherInCourse.push(data[i].local.username);
            else teacherNotInCourse.push(data[i].local.username);
        }else{
            if(courseDetail.students.includes(data[i].local.username)) studentInCourse.push(data[i].local.username);
            else studentNotInCourse.push(data[i].local.username);
        }
    }
});

socket.on('HWData', function(data){
    var div;
    for(var i = 0; i < Object.keys(data).length; i++){
        if(udetail.local.isTeacher || !data[i].submitedStd.includes(udetail.local.studentID)){
            div = document.getElementById('hw-list');
        }else{
            div = document.getElementById('done-hw-list');
        }
        var button = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editHw`;
        button.innerHTML = data[i].name;
        if(udetail.local.isTeacher || data[i].submitedStd.includes(udetail.local.studentID)){
            button.setAttribute('onClick', '');
        }else{
            button.setAttribute('onClick', `DoHW(${data[i].id},${params.courseId})`);
        }
        button.setAttribute('id', 'gameButton');
        
        div.appendChild(button);
        if(udetail.local.isTeacher){
            var editbutton = document.createElement('button');
            editbutton.innerText = "edit";
            editbutton.setAttribute('onClick', `edit("${mydata}")`);
            editbutton.setAttribute('id', "gameButton");
            editbutton.setAttribute('class',"editButton");
            div.appendChild(editbutton);
        }
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
});

socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
        var div = document.getElementById('quiz-list');
        var button = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editQuiz`;
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        div.appendChild(button);
        if(udetail.local.isTeacher){
            var editbutton = document.createElement('button');
            editbutton.innerText = "edit";
            editbutton.setAttribute('onClick', `edit("${mydata}")`);
            editbutton.setAttribute('id', "gameButton");
            editbutton.setAttribute('class',"editButton");
            div.appendChild(editbutton);
        }
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
});

function startGame(data){
    window.location.href="/host/" + "?id=" + data;
}
function DoHW(hwId,cId){
    window.location.href="/DoHW"+ "?id="+ hwId +"&courseId="+ cId;
}
function edit(data){
    window.location.href="/create_quiz/" + "?" + data;
}
function getTeacher(){
    document.getElementById('addPopUp').style.display= "block";
    var InCourse = document.getElementById('InCourse');
    var notInCourse = document.getElementById('notInCourse');
    InCourse.innerHTML = '';
    notInCourse.innerHTML = '';
    for(t in teacherInCourse){
        addToInCourse(teacherInCourse[t], 'teacher', InCourse);
    }
    for(t in teacherNotInCourse){
        addToNotInCourse(teacherNotInCourse[t], 'teacher', notInCourse);
    }
}

function getStudent(){
    document.getElementById('addPopUp').style.display= "block";
    var InCourse = document.getElementById('InCourse');
    var notInCourse = document.getElementById('notInCourse');
    InCourse.innerHTML = '';
    notInCourse.innerHTML = '';
    for(t in studentInCourse){
        addToInCourse(studentInCourse[t], 'student', InCourse);
    }
    for(t in studentNotInCourse){
        addToNotInCourse(studentNotInCourse[t], 'student', notInCourse);
    }
}

function addToInCourse(t, type, target){
    var p = document.createElement('div');
    p.className += " questionList";
    p.setAttribute('id', t);
    var removebut = document.createElement('button');
    removebut.innerHTML = '<' ;
    removebut.setAttribute('onclick', `manage('${t}', '${type}', 'remove')`);
    var la = document.createElement('label');
    la.innerHTML = t;
    p.appendChild(removebut);
    p.appendChild(la);
    p.appendChild(document.createElement('br'));
    target.appendChild(p);
}
function addToNotInCourse(t, type, target){
    var p = document.createElement('div');
    p.className += " questionList";
    p.setAttribute('id', t);
    var addbut = document.createElement('button');
    addbut.innerHTML = '>' ;
    addbut.setAttribute('onclick', `manage('${t}', '${type}', 'add')`);
    var la = document.createElement('label');
    la.innerHTML = t;
    p.appendChild(la);
    p.appendChild(addbut);
    p.appendChild(document.createElement('br'));
    target.appendChild(p);
}
function manage(username, type, func){
    var InCourse = document.getElementById('InCourse');
    var notInCourse = document.getElementById('notInCourse');
    document.getElementById(username).remove();
    if(func == 'add'){
        addToInCourse(username, type, InCourse);
        if(type == "teacher"){
            courseDetail.teachers.push(username);
            teacherInCourse.push(username);
            removeFromArray(teacherNotInCourse, username);
        }else{
            courseDetail.students.push(username);
            studentInCourse.push(username);
            removeFromArray(studentNotInCourse, username);
        }
    }
    if(func == 'remove'){
        addToNotInCourse(username, type, notInCourse);
        if(type == "teacher"){
            removeFromArray(courseDetail.teachers,username);
            removeFromArray(teacherInCourse, username)
            teacherNotInCourse.push(username);
        }else{
            removeFromArray(courseDetail.students, username);
            removeFromArray(studentInCourse, username)
            studentNotInCourse.push(username);
        }
    }
}

function removeFromArray(array, value){
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function updateCourse(){
    socket.emit('update-course', courseDetail);
    document.getElementById('addPopUp').style.display= "none";
}