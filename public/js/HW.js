var socket =io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var questionNumber = 0;

socket.on('connect', function() {
    
    document.getElementById('show-HW').innerHTML = "";
    // socket.emit('ShowHW',params);    
});

socket.on('DoHW',function(data){
    // questionNumber += 1;
    // switch (data.type) {
    //     case "4c" :
    //         type_Q = "4C"

    // }
    document.getElementById('show-HW').innerHTML += `
        <div class="card-holder">
            <div class="card bg-gold" id="question${questionNumber} style="text-align:left;"></div>
        </div>; `
});

function DoHW(){
    socket.emit('ShowHW',params);
};

