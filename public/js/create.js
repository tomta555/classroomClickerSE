var socket = io();

socket.on('connect', function(){
    socket.emit('requestDbNames');//Get database names to display to user
});

socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
        var div = document.getElementById('game-list');
        var button = document.createElement('button');
        var editbutton = document.createElement('button');
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', "edit('"+data[i].id+"')");
        editbutton.setAttribute('id', "gameButton");
        
        div.appendChild(button);
        div.appendChild(editbutton);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
});

function startGame(data){
    window.location.href="/host/" + "?id=" + data;
}
function edit(data){
    window.location.href="/editQuiz/" + "?id=" + data;
}