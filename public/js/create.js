var socket = io();
var params = jQuery.deparam(window.location.search);
var udetail;

socket.on('connect', function(){
    socket.emit('get-user-detail');
});

socket.on('user-detail',function(user){
    udetail = user;
    socket.emit('get-courses', String(udetail.local.username));
    
})


socket.on('course-detail', function( data ){
    var allCourse = document.getElementById('allCourse');
    for(let i=0; i<data.length; i++){
        showCourse(data[i]);
        allCourse.appendChild(document.createElement('br'));
    }
    socket.emit('get-all-quiz');
});

socket.on('all-quiz', function(data){
    for(let i=0; i<data.length; i++){
        addQuiz(data[i]);
    }
});

function showCourse(course){
    var allCourse = document.getElementById('allCourse');
    var c = document.createElement('div');
    var p = document.createElement('h3');
    p.innerText = `${course.name}`;
    c.setAttribute('id', `${course.id}`);
    c.setAttribute('style', 'background-color: red; margin: 0% 5%; padding: 2%;');
    c.appendChild(p);
    allCourse.appendChild(c);
}

function addQuiz(quiz){
    var c = document.getElementById(quiz.courseId);
    if(c != undefined){
        var button = document.createElement('button');
        button.innerHTML = quiz.name;
        button.setAttribute('onClick', "startGame('" + quiz.id + "')");
        c.appendChild(button);
        c.appendChild(document.createElement('br'));
    }
}

socket.on('gameNamesData', function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        var div = document.getElementById('game-list');
        var class_area =  document.createElement('div');
        var button = document.createElement('button');
        var editbutton = document.createElement('button');
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', "edit('"+data[i].id+"')");
        editbutton.setAttribute('id', "gameButton");
        class_area.appendChild(button);
        class_area.appendChild(editbutton);
        class_area.setAttribute("class", "single-class-area");
        // div.appendChild(button);
        // div.appendChild(editbutton);
        div.appendChild(class_area);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
});


function startGame(data){
    window.location.href="/host/" + "?id=" + data;
}
function edit(data){
    window.location.href="/edit_quiz/" + "?id=" + data;
}


