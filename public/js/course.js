var socket = io();
var params = jQuery.deparam(window.location.search);

socket.on('connect', function(){
    socket.emit('requestDbHW', {"courseId": params.courseId});//Get database names to display to user
    socket.emit('requestDbNames', {"courseId": params.courseId});
    var createHwButton = document.getElementById("createHwButton");
    var createQuizButton = document.getElementById("createQuizButton");
    createHwButton.setAttribute("onclick", `window.location.href = '../create?courseId=${params.courseId}&type=createHw'`);
    createQuizButton.setAttribute("onclick", `window.location.href = '../create?courseId=${params.courseId}&type=createQuiz'`);
});

socket.on('HWData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
        var div = document.getElementById('hw-list');
        var button = document.createElement('button');
        var editbutton = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editHw`;

        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "DoHW('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', `edit("${mydata}")`);
        editbutton.setAttribute('id', "gameButton");
        editbutton.setAttribute('class',"editButton");
        div.appendChild(button);
        div.appendChild(editbutton);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
});

socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
        var div = document.getElementById('quiz-list');
        var button = document.createElement('button');
        var editbutton = document.createElement('button');
        var mydata = `id=${data[i].id}&courseId=${params.courseId}&type=editQuiz`;
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', `edit("${mydata}")`);
        editbutton.setAttribute('id', "gameButton");
        editbutton.setAttribute('class',"editButton");
        div.appendChild(button);
        div.appendChild(editbutton);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
});

function startGame(data){
    window.location.href="/host/" + "?id=" + data;
}
function DoHW(data){
    window.location.href="/DoHW"+ "?id=" + data;
}
function edit(data){
    window.location.href="/create_quiz/" + "?" + data;
}