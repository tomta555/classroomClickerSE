var socket = io();

socket.on('connect', function(){
    socket.emit('requestDbHW');//Get database names to display to user
    socket.emit('requestDbNames');
});

socket.on('HWData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
        var div = document.getElementById('hw-list');
        var button = document.createElement('button');
        var editbutton = document.createElement('button');
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "DoHW('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', "edit('"+data[i].id+"')");
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
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', "edit('"+data[i].id+"')");
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
    window.location.href="/editQuiz/" + "?id=" + data;
}