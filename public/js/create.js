var socket = io();
var params = jQuery.deparam(window.location.search);

socket.on('connect', function(){
    socket.emit('requestDbNames', {"courseId": params.courseId});//Get database names to display to user
});

socket.on('gameNamesData', function(data){
    for(var i = 0; i < Object.keys(data).length; i++){
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
// tableproduct += `
//     <div class="single-class-area">
//         <div class="hover-content">
//             <!-- detail-->
//         </a>
//     </div>`;

function startGame(data){
    window.location.href="/host/" + "?id=" + data;
}
function edit(data){
    window.location.href="/edit_quiz/" + "?id=" + data;
}


