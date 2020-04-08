var socket = io();
var params = jQuery.deparam(window.location.search);

var courseDetail;
var tagScore = [];
var overallFull = 0;
var student_tag_score = [];

$(document).ready(function () {
    socket.on('connect',function () {
        socket.emit('get-course-detail', {"id": parseInt(params.courseId)});
    });
    
    socket.on('course-detail', function(data){
        courseDetail = data;
        if(params.type == 'homework'){
            socket.emit('req-hw-data', {"id":params.id});
        }else if(params.type == 'quiz'){
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
                for(let j=0; j<data.questions[i].tag.length; j++){
                    if(data.questions[i].tag[j] == courseDetail.tags[k]){
                        tagScore[k].question.push(i);
                        tagScore[k].fullScore += data.questions[i].score;
                    }
                }
            }
        }
        for(let i=0; i<data.questions.length; i++){
            overallFull += data.questions[i].score;
            if(params.type == 'quiz') overallFull += 100;
        }
        if(params.type == 'homework'){
            socket.emit('get-hw-score', [parseInt(params.id)]);
        }else if(params.type == 'quiz'){
            socket.emit('get-quiz-score', [parseInt(params.id)]);
        }
    });

    socket.on('hw-score', function(data){
        // player(s) answer and score
        var overallMax = 0;
        var overallMin = 0;
        var overallMean = 0;
        for(let i=0; i<data.length; i++){// look in every student submit
            student_tag_score.push({// create slot for each student
                "stdId":data[i].stdId,
                "tags":[],
                "stdScore":0
            });
            for(let j=0; j<tagScore.length; j++){// for each tag that is in course
                student_tag_score[i].tags.push({// add slot for each tag in every student
                    "name" : tagScore[j].name,
                    "score" : 0
                })
                for(let k=0; k<data[i].score.length; k++){// for each answer of this student
                    if(tagScore[j].question.includes(k)){// if that answer is in this tag  
                        student_tag_score[i].tags[j].score += data[i].score[k]; // add score of that answer to slot
                    }
                    if(j == 0) student_tag_score[i].stdScore += data[i].score[k];
                }
                var s = student_tag_score[i].tags[j].score;
                if(tagScore[j].min > s) tagScore[j].min = s;
                if(tagScore[j].max < s) tagScore[j].max = s;
                tagScore[j].mean += s;


            }
            var S = student_tag_score[i].stdScore;
            if(overallMax < S) overallMax = S;
            if(i == 0){
                overallMin = S;
            }else if(overallMin > S){
                overallMin = S;
            } 
            overallMean += S

            showStudentScore(student_tag_score[i].stdId, student_tag_score[i].stdScore);
        }
        overallMean /= data.length;
        for(let j=0; j<tagScore.length; j++){
            if(tagScore[j].question.length == 0){
                tagScore.splice(j, 1);
                j--;
            }else{
                tagScore[j].mean /= data.length;
                showTagScore(tagScore[j].name, tagScore[j].fullScore, tagScore[j].max, tagScore[j].min, tagScore[j].mean);
            }
        }
        showOverAllScore(overallFull, overallMax, overallMin, overallMean);
    });

    socket.on('quiz-score', function( data ){
        // player(s) answer and score
        var overallMax = 0;
        var overallMin = 0;
        var overallMean = 0;
        for(let i=0; i<data.length; i++){// look in every student submit
            student_tag_score.push({// create slot for each student
                "stdId":data[i].stdId,
                "tags":[],
                "stdScore":0
            });
            for(let j=0; j<tagScore.length; j++){// for each tag that is in course
                student_tag_score[i].tags.push({// add slot for each tag in every student
                    "name" : tagScore[j].name,
                    "score" : 0
                })
                for(let k=0; k<data[i].score.length; k++){// for each answer of this student
                    if(tagScore[j].question.includes(k)){// if that answer is in this tag  
                        student_tag_score[i].tags[j].score += data[i].score[k]; // add score of that answer to slot
                    }
                    if(j == 0) student_tag_score[i].stdScore += data[i].score[k];
                }
                var s = student_tag_score[i].tags[j].score;
                if(tagScore[j].min > s) tagScore[j].min = s;
                if(tagScore[j].max < s) tagScore[j].max = s;
                tagScore[j].mean += s;


            }
            var S = student_tag_score[i].stdScore;
            if(overallMax < S) overallMax = S;
            if(i == 0){
                overallMin = S;
            }else if(overallMin > S){
                overallMin = S;
            } 
            overallMean += S

            showStudentScore(student_tag_score[i].stdId, student_tag_score[i].stdScore);
        }
        overallMean /= data.length;
        for(let j=0; j<tagScore.length; j++){
            if(tagScore[j].question.length == 0){
                tagScore.splice(j, 1);
                j--;
            }else{
                tagScore[j].mean /= data.length;
                showTagScore(tagScore[j].name, tagScore[j].fullScore, tagScore[j].max, tagScore[j].min, tagScore[j].mean);
            }
        }
        showOverAllScore(overallFull, overallMax, overallMin, overallMean);
    });

});

function showOverAllScore(full, max, min, mean){
    var f = document.getElementById('overallFull');
    var M = document.getElementById('overallMax');
    var m = document.getElementById('overallMin');
    var me = document.getElementById('overallMean');

    f.innerHTML=full;
    M.innerHTML=max;
    m.innerHTML=min;
    me.innerHTML=mean;
}

function showTagScore(name, full, max, min, mean){
    var list = document.getElementById('tagList');
    list.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${full}</td>
            <td>${max}</td>
            <td>${min}</td>
            <td>${mean}</td>
        </tr>
    `;
}

function showStudentScore(stdId,score){
    var list = document.getElementById('studentList');
    list.innerHTML += `
    <tr>
        <td><a href="/stat_studentPage">${stdId}</a></td>
        <td><a href="/stat_studentPage" id="${stdId}">student name</a></td>
        <td><a href="/stat_studentPage">${score}</a></td>
    </tr>
    `;
    socket.emit('get-student-detail', stdId);
}

socket.on('student-detail', function(data){
    var name = document.getElementById(data.local.studentID);
    name.innerHTML = `${data.local.fname} ${data.local.lname}`;
});