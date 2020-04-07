var socket = io();
var params = jQuery.deparam(window.location.search);

var courseDetail;
var tagScore = [];
$(document).ready(function () {
    socket.on('connect',function () {
        socket.emit('get-course-detail', {"id": parseInt(params.courseId)});
    });
    
    socket.on('course-detail', function(data){
        courseDetail = data;
        if(params.type == 'homework'){
            socket.emit('get-hw-score', [params.id]);
            socket.emit('req-hw-data', {"id":params.id});
        }else if(params.type == 'quiz'){
            socket.emit('get-quiz-score', [params.id]);
            socket.emit('req-quiz-data', {"id":params.id});
        }
    });

    socket.on('gameData-edit',function(data){
        // homework or quiz data 
        for(let k=0; k<courseDetail.tags.length; k++){
            tagScore.push({
                "name":courseDetail.tags[k],
                "min":0, 
                "mean":0, 
                "max":0, 
                "fullScore":0,
                "question":[]
            });
            for(let i=0; i<data.questions.length; i++){
                for(let j=0; j<data.questions.tag.length; j++){
                    if(data.questions[i].tag[j] == courseDetail.tags[k]){
                        tagScore[k].question.push(i);
                        fullScore += data.question[i].score;
                    }
                }
            }
        }
        console.log(tagScore);
    });

    socket.on('hw-score', function(data){
        // player(s) answer and score

    });

    socket.on('quiz-score', function( data ){
        // player(s) answer and score

    });

});

function addCourse(){
    
}

