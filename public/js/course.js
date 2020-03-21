var socket = io();
var params = jQuery.deparam(window.location.search);
var udetail;

socket.on('connect', function(){
    socket.emit('get-user-detail');
    socket.emit('requestDbHW', {"courseId": parseInt(params.courseId)});//Get database names to display to user
    socket.emit('requestDbNames', {"courseId": parseInt(params.courseId)});
});

socket.on('user-detail',function(user){
    udetail = user;
    if(user.local.isTeacher){
        var createHwButton = document.getElementById("createHwButton");
        var createQuizButton = document.getElementById("createQuizButton");
        createHwButton.setAttribute("onclick", `window.location.href = '../create?courseId=${params.courseId}&type=createHw'`);
        createQuizButton.setAttribute("onclick", `window.location.href = '../create?courseId=${params.courseId}&type=createQuiz'`);
    }
});

socket.on('HWData', function(data){
    var div;
    for(var i = 0; i < Object.keys(data).length; i++){
        if(udetail.local.isTeacher || !data[i].submittedStd.includes(udetail.local.studentID)){
            div = document.getElementById('hw-list');
        }else{
            div = document.getElementById('done-hw-list');
        }
        var button = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editHw`;
        button.innerHTML = data[i].name;
        if(udetail.local.isTeacher || data[i].submittedStd.includes(udetail.local.studentID)){
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