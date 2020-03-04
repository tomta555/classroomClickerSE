var socket = io();

socket.on('connect', function(){
    socket.emit('requestDbNames');//Get database names to display to user
});

socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
        var div = document.getElementById('game-list');
        var classarea =  document.createElement('div');
        var button = document.createElement('button');
        var editbutton = document.createElement('button');
        
        button.innerHTML = data[i].name;
        button.setAttribute('onClick', "startGame('" + data[i].id + "')");
        button.setAttribute('id', 'gameButton');
        
        editbutton.innerText = "edit";
        editbutton.setAttribute('onClick', "edit('"+data[i].id+"')");
        editbutton.setAttribute('id', "gameButton");
        classarea.appendChild(button);
        classarea.appendChild(editbutton);
        classarea.setAttribute("class", "single-class-area");
        // div.appendChild(button);
        // div.appendChild(editbutton);
        div.appendChild('classarea');
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
    }
            tableproduct += `
                <div class="single-class-area">
                    <div class="hover-content">
                        <!-- detail-->
                    </a>
                </div>`;
});

function startGame(data){
    window.location.href="/host/" + "?id=" + data;
}
function edit(data){
    window.location.href="/editQuiz/" + "?id=" + data;
}


