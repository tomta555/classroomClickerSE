var socket = io();
var params = jQuery.deparam(window.location.search);

var udetail;
var courseDetail;

var homework_edit_innerhtml = '';
var homework_score_innerhtml = '';
var quiz_edit_innerhtml = '';
var quiz_score_innerhtml = '';

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
});

socket.on('user-detail',function(user){
    socket.emit('get-course-detail', {"id": parseInt(params.courseId)});
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
    var des = document.getElementById('description');
    des.innerHTML = `
    <div id='name' style="width:100%">Course name : ${courseDetail.name} | Course ID : ${courseDetail.id}</div>
    <br>
    <div id='desc' style="width:100%" >Description : ${courseDetail.desc}</div>
    <br>
    `;
    if(udetail.local.isTeacher){
        des.innerHTML += `
        <button id='descButton' class='editSize' onclick='editDesc()'>edit description</button>
        `;
    }
    socket.emit('get-users');
    socket.emit('requestDbHW', {"courseId": params.courseId});//Get database names to display to user
    socket.emit('requestDbNames', {"courseId": params.courseId});
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
    courseDetail.hw = [];
    courseDetail.hwName = [];
    for(var i = 0; i < Object.keys(data).length; i++){
        courseDetail.hw.push(data[i].id);
        courseDetail.hwName.push(data[i].name);
        if(udetail.local.isTeacher || data[i].submitedStd.includes(udetail.local.studentID)){
            div = document.getElementById('hw-list');
        }else{
            div = document.getElementById('doing-hw-list');
        }
        var button = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editHw`;
        button.innerHTML = data[i].name;
        if(udetail.local.isTeacher ){
            button.setAttribute('onClick', `hwStat(${courseDetail.hw[i]}, ${courseDetail.id})`);
        }else if(data[i].submitedStd.includes(udetail.local.studentID)){
            var linkToStatPage = `/stat_studentPage?courseId=${params.courseId}&id=${data[i].id}&type=homework&stdId=${udetail.local.studentID}`
            button.setAttribute('onClick', `window.location.href="${linkToStatPage}"`);
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
    courseDetail.quiz = [];
    courseDetail.quizName= [];
    for(var i = 0; i < Object.keys(data).length; i++){
        courseDetail.quiz.push(data[i].id);
        courseDetail.quizName.push(data[i].name);
        var div = document.getElementById('quiz-list');
        var button = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editQuiz`;
        
        button.innerHTML = data[i].name;
        if(udetail.local.isTeacher){
            button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        }else{
            var linkToStatPage = `/stat_studentPage?courseId=${params.courseId}&id=${data[i].id}&type=quiz&stdId=${udetail.local.studentID}`
            button.setAttribute('onClick', `window.location.href="${linkToStatPage}"`);
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
    document.getElementById('updateCourse').setAttribute('onclick',"updateCourseMember('teacher')")
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
    document.getElementById('updateCourse').setAttribute('onclick',"updateCourseMember('student')")
}

function getScore(){
    var hwList = document.getElementById('hw-list');
    var quizList = document.getElementById('quiz-list');
    var scoreButton = document.getElementById('pageButton');
    if(homework_score_innerhtml == ''){
        homework_edit_innerhtml = hwList.innerHTML;
        quiz_edit_innerhtml = quizList.innerHTML;
        socket.emit('get-hw-score', courseDetail.hw);
        socket.emit('get-quiz-score', courseDetail.quiz);
    }else{
        hwList.innerHTML = homework_score_innerhtml;
        quizList.innerHTML = quiz_score_innerhtml;
    }
    
    scoreButton.setAttribute('onclick', 'getEdit()');
    scoreButton.innerHTML = 'back to edit';
}

socket.on('hw-score', function(data){
    var hwList = document.getElementById('hw-list');
    var hw = [];
    var score;
    for(let i = 0; i < data.length; i++){
        score = data[i].totalScore;
        var newHw = true;
        for(let j = 0; j < hw.length; j++){
            if(hw[j].id == data[i].hwid){
                if(hw[j].min > score) hw[j].min = score;
                if(hw[j].max < score) hw[j].max = score;
                hw[j].mean = ((hw[j].mean*hw[j].student) + score) / (hw[j].student+1);
                hw[j].student += 1;
                newHw = false;
                break;
            }
        }
        if(newHw){
            hw.push({'id': data[i].hwid, 'min': score , 'mean': score, 'max': score, 'student': 1});
        }
    }
    var t = '';
    for(let i=0 ; i<courseDetail.hw.length; i++){
        t += `
            <button onclick='hwStat(${courseDetail.hw[i]}, ${courseDetail.id})' >${courseDetail.hwName[i]}</button>
        `;
        for(let j = 0; j < hw.length; j++){
            if(hw[j].id == courseDetail.hw[i]){
                t += `
                    <div style="background-color: red">
                        student answered : ${hw[j].student}/${courseDetail.students.length} 
                        <br>
                        min/max : ${hw[j].min}/${hw[j].max} 
                        <br> 
                        mean : ${hw[j].mean}
                    </div>
                `;
                break;
            }
        }
        t += '<br>';

    }
    hwList.innerHTML = t
    homework_score_innerhtml = t;
});

socket.on('quiz-score', function(data){
    var quizList = document.getElementById('quiz-list');
    var quiz = [];
    var score;
    var thisStudentScore = 0;
    for(let i = 0; i < data.length; i++){
        score = data[i].totalScore;
        var newQuiz = true;
        if (udetail.local.stdId == data.stdId) thisStudentScore = score; 
        for(let j = 0; j < quiz.length; j++){
            if(quiz[j].id == data[i].questionid){
                if(quiz[j].round == data[i].round){
                    if(quiz[j].min > score) quiz[j].min = score;
                    if(quiz[j].max < score) quiz[j].max = score;
                    quiz[j].mean = ((quiz[j].mean*quiz[j].student) + score) / (quiz[j].student+1);
                    quiz[j].student += 1;
                    newQuiz = false;
                    break;
                }else if(quiz[j].round > data[i].round){
                    quiz.remove(quiz[j]);
                }else {
                    newQuiz = false;
                }
            }
        }
        if(newQuiz){
            quiz.push({'id': data[i].questionid, 'min': score , 'mean': score, 'max': score, 'student': 1, 'round': data[i].round});
        }
    }
    var t = '';
    for(let i=0 ; i<courseDetail.quiz.length; i++){
        t += `
            <button onclick='quizStat(${courseDetail.quiz[i]}, ${courseDetail.id})' >${courseDetail.quizName[i]}</button>
        `;
        for(let j = 0; j < quiz.length; j++){
            if(quiz[j].id == courseDetail.quiz[i]){
                if(udetail.local.isTeacher){
                    t += `
                        <div style="background-color: red">
                            student answered : ${quiz[j].student}/${courseDetail.students.length} 
                            <br>
                            min/max : ${quiz[j].min}/${quiz[j].max} 
                            <br> 
                            mean : ${quiz[j].mean}
                        </div>
                    `;
                }else{
                    t += `
                        <div style="background-color: red">
                            your score : ${thisStudentScore} 
                            <br>
                            min/max : ${quiz[j].min}/${quiz[j].max} 
                            <br> 
                            mean : ${quiz[j].mean}
                        </div>
                    `;
                }
                break;
            }
        }
    }
    quizList.innerHTML = t
    quiz_score_innerhtml = t;
});

function getEdit(){
    document.getElementById('hw-list').innerHTML = homework_edit_innerhtml;
    document.getElementById('quiz-list').innerHTML = quiz_edit_innerhtml;
    var scoreButton = document.getElementById('pageButton');
    
    scoreButton.setAttribute('onclick', 'getScore()');
    scoreButton.innerHTML = 'score';
}

function hwStat(hwid, courseId){
    window.location.href=`/stat_teacherPage/?id=${hwid}&courseId=${courseId}&type=homework`;
}

function quizStat(quizid, courseId){
    window.location.href=`/stat_teacherPage/?id=${quizid}&courseId=${courseId}&type=quiz`;
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
    //delete the element
    document.getElementById(username).remove();
    //add element to the right place 
    func == 'add' ? addToInCourse(username, type, InCourse):addToNotInCourse(username, type, notInCourse);
}

function removeFromArray(array, value){
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function editDesc(){
    var desc = courseDetail.desc;
    var name = courseDetail.name;
    var descBox = document.getElementById('description');
    descBox.innerHTML = `
    <label>Course name :</label>
    <input id='nameInput' style="width:60%" type="text" value="${name}">
    <br>
    <label>Course description :</label>
    <input id='descInput' style="width:60%" type="text" value="${desc}">
    <br>
    <button id='descButton' class='editSize' onclick='updateCourseDesc()'>save</button>
    `;
}

function updateCourseDesc(){
    var newDesc = document.getElementById('descInput').value;
    var newName = document.getElementById('nameInput').value;
    var descBox = document.getElementById('description');
    if(newDesc == ''){
        if(!confirm('Is new description will be blank?')){
            return;
        }
    }
    descBox.innerHTML = `
    <div id='name' style="width:100%">Course name : ${newName} | Course ID : ${courseDetail.id}</div>
    <br>
    <div id='desc' style="width:100%" >Description : ${newDesc}</div>
    <br>
    <button id='descButton' onclick='editDesc()' class='editSize' >edit description</button>
    `
    courseDetail.name = newName;
    courseDetail.desc = newDesc;
    socket.emit('update-course', courseDetail);
}

function updateCourseMember(type){
    var InCourse = document.getElementById('InCourse').getElementsByTagName('label');
    var notInCourse = document.getElementById('notInCourse').getElementsByTagName('label');
    if(type == "teacher"){
        teacherInCourse = [];
        teacherNotInCourse = [];
        for(i=0;i<InCourse.length;i++){
            teacherInCourse.push(InCourse[i].innerText);
        }
        for(i=0;i<notInCourse.length;i++){
            teacherNotInCourse.push(notInCourse[i].innerText);
        }
        courseDetail.teachers = teacherInCourse;
    }else{
        studentInCourse = [];
        studentNotInCourse = [];
        for(i=0;i<InCourse.length;i++){
            studentInCourse.push(InCourse[i].innerText);
        }
        for(i=0;i<notInCourse.length;i++){
            studentNotInCourse.push(notInCourse[i].innerText);
        }
        courseDetail.students = studentInCourse;
    }
    socket.emit('update-course', courseDetail);
    document.getElementById('addPopUp').style.display= "none";
}