var socket = io();

$(document).ready(function () {
    // let id = getCookie('id');
    // if(id != ''){
    //     socket.emit('checkID',id);
    // }
    socket.on('connect',function () {
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(udetail){
        console.log(udetail)


    })
});
