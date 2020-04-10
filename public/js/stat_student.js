var socket = io();
var params = jQuery.deparam(window.location.search);

var courseDetail;
var udetail;
var questionDetail;

var tagScore = [];
var overallFull = 0;
var student_tag_score = [];

var modal = document.getElementById('editScorePopUp');

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

$(document).ready(function () {
    socket.on('connect',function () {
        socket.emit('get-course-detail', {"id": parseInt(params.courseId)});
        socket.emit('get-user-detail');
    });

    socket.on('user-detail',function(user){
        udetail = user.local;
    })

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
        questionDetail = data;
        document.getElementById('studentName').innerHTML = `Student id : ${params.stdId}`; 
        document.getElementById('mainTitle').innerHTML = data.name;
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
                        if(params.type == 'quiz') tagScore[k].fullScore += 100;
                    }
                }
            }
        }
        for(let i=0; i<data.questions.length; i++){
            overallFull += data.questions[i].score;
            if(params.type == 'quiz') overallFull += 100;
            showQuestion(data.questions[i], i);
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
                "tags":[]
            });
            if(data[i].stdId == params.stdId){
                var yourScore = document.getElementById('yourScore');
                yourScore.innerHTML = data[i].totalScore;
                if(udetail.isTeacher){
                    yourScore.innerHTML += `<button onclick="openEditScore(${data[i].totalScore})">edit</button>`;
                }
                for(let j=0; j< data[i].score.length; j++){
                    showPlayerAnswer(j, data[i].answer[j]);
                }
            }
            for(let j=0; j<tagScore.length; j++){// for each tag that is in course
                student_tag_score[i].tags.push({// add slot for each tag in every student
                    "name" : tagScore[j].name,
                    "score" : 0
                })
                for(let k=0; k<data[i].score.length; k++){// for each answer of this student
                    if(tagScore[j].question.includes(k)){// if that answer is in this tag  
                        student_tag_score[i].tags[j].score += data[i].score[k]; // add score of that answer to slot
                    }
                }
                var s = student_tag_score[i].tags[j].score;
                if(i == 0){
                    tagScore[j].min = s;
                }
                if(tagScore[j].min > s) tagScore[j].min = s;
                if(tagScore[j].max < s) tagScore[j].max = s;
                tagScore[j].mean += s;


            }
            var S = data[i].totalScore;
            if(overallMax < S) overallMax = S;
            if(i == 0){
                overallMin = S;
            }else if(overallMin > S){
                overallMin = S;
            } 
            overallMean += S
            
            // showStudentScore(student_tag_score[i].stdId, student_tag_score[i].stdScore);
        }
        overallMean /= data.length;
        for(let j=0; j<tagScore.length; j++){
            if(tagScore[j].question.length == 0){
                tagScore.splice(j, 1);
                j--;
            }else{
                tagScore[j].mean /= data.length;
                // showTagScore(tagScore[j].name, tagScore[j].fullScore, tagScore[j].max, tagScore[j].min, tagScore[j].mean);
            }
        }
        showOverAllScore(overallFull, overallMax, overallMin, overallMean);
    });

    socket.on('quiz-score', function( data ){
        // player(s) answer and score
        var screenedData = [];
        var r = 0;
        for(let i=0; i<data.length; i++){
            if(data[i].round > r){
                screenedData = [];
                screenedData.push(data[i]);
                r = data[i].round;
            }else if(data[i].round == r){
                screenedData.push(data[i]);
            }
        }
        questionDetail.round = r;

        var overallMax = 0;
        var overallMin = 0;
        var overallMean = 0;
        for(let i=0; i<screenedData.length; i++){// look in every student submit
            student_tag_score.push({// create slot for each student
                "stdId":screenedData[i].stdId,
                "tags":[]
            });
            if(screenedData[i].stdId == params.stdId){
                var yourScore = document.getElementById('yourScore');
                yourScore.innerHTML = screenedData[i].totalScore;
                if(udetail.isTeacher){
                    yourScore.innerHTML += `<button onclick="openEditScore(${screenedData[i].totalScore})">edit</button>`;
                }
                for(let j=0; j< screenedData[i].score.length; j++){
                    showPlayerAnswer(j, screenedData[i].answer[j]);
                }
            }
            for(let j=0; j<tagScore.length; j++){// for each tag that is in course
                student_tag_score[i].tags.push({// add slot for each tag in every student
                    "name" : tagScore[j].name,
                    "score" : 0
                })
                for(let k=0; k<screenedData[i].score.length; k++){// for each answer of this student
                    if(tagScore[j].question.includes(k)){// if that answer is in this tag  
                        student_tag_score[i].tags[j].score += screenedData[i].score[k]; // add score of that answer to slot
                    }
                }
                var s = student_tag_score[i].tags[j].score;
                if(i == 0){
                    tagScore[j].min = s;
                }
                if(tagScore[j].min > s) tagScore[j].min = s;
                if(tagScore[j].max < s) tagScore[j].max = s;
                tagScore[j].mean += s;


            }
            var S = screenedData[i].totalScore;
            if(overallMax < S) overallMax = S;
            if(i == 0){
                overallMin = S;
            }else if(overallMin > S){
                overallMin = S;
            } 
            overallMean += S
            
            // showStudentScore(student_tag_score[i].stdId, student_tag_score[i].stdScore);
        }
        overallMean /= screenedData.length;
        for(let j=0; j<tagScore.length; j++){
            if(tagScore[j].question.length == 0){
                tagScore.splice(j, 1);
                j--;
            }else{
                tagScore[j].mean /= screenedData.length;
                // showTagScore(tagScore[j].name, tagScore[j].fullScore, tagScore[j].max, tagScore[j].min, tagScore[j].mean);
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
    var ft = document.getElementById('fullScoreOnTable');
    if(f!= undefined)f.innerHTML=full;
    if(M!= undefined)M.innerHTML=max;
    if(m!= undefined)m.innerHTML=min;
    if(me!= undefined)me.innerHTML=mean;
    if(ft!= undefined)ft.innerHTML = `Score (Full:${full})`;
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

function showQuestion(data,questionNum){
    var list = document.getElementById('questionList');
    if(list == undefined) return;
    var card_holder = document.createElement('div');
    var card = document.createElement('div');

    card_holder.setAttribute('class', 'card-holder');
    card.className += ' card bg-gold';
    card.setAttribute('id', `question${questionNum}`);
    card.setAttribute('style', 'text-align: left;');

    var choiseHead = document.createElement('label');
    choiseHead.setAttribute('class', 'choiseHead');
    choiseHead.innerText  = data.question;
    card.appendChild(choiseHead);
    if(data.type == "4c" || data.type == "2c"){
        for(var i=0; i< data.answers.length; i++){
            if(data.correct == i+1){
                card.innerHTML += `
                <label class="choise correct-answer"> ${data.answers[i]}
                    <input id="answer${questionNum}_radio${i}" type="radio" disabled>
                    <span class="checkmark"></span>
                </label>`;
            }else{
                card.innerHTML += `
                <label class="choise"> ${data.answers[i]}
                    <input id="answer${questionNum}_radio${i}" type="radio" disabled>
                    <span class="checkmark"></span>
                </label>`;
            }
        }
    }else{
        card.innerHTML += `
            <label class = "fText">Answer : 
                <input type="text"  id="answer${questionNum}" disabled="disabled"/ placeholder = "player Answer">
            </label>
            <div style="font-size: 25px"> Correct answer(s) </div>`
        for(i=0; i<data.answers.length; i++){
            card.innerHTML += `<div style="font-size: 20px"> : ${data.answers[i]}</div>`;
        }
    }
    card_holder.appendChild(card);
    list.appendChild(card_holder);
}

function showPlayerAnswer(questionNum, i){
    console.log('showed')
    var tag = document.getElementById(`answer${questionNum}`);
    if(tag==undefined){
        playerAnswer = parseInt(i)-1
        tag = document.getElementById(`answer${questionNum}_radio${playerAnswer}`);
        tag.setAttribute('checked', 'checked');
    }else{
        tag.setAttribute('placeholder', i);
    }
}

function sum(total, num){
    return total + num
}

function openEditScore(score){
    document.getElementById('editScorePopUp').style.display = 'block';
    document.getElementById('studentScore').value = score;
}

function updateStudentScore(score){
    var stdId = params.stdId;
    var qId = questionDetail.id;
    var type = params.type;
    var round = questionDetail.round;
    var query = {'stdId':stdId, 'qId': qId, 'score': score, 'type':type, 'round':round};
    document.getElementById('editScorePopUp').style.display='none';
    document.getElementById('yourScore').innerHTML = score;
    socket.emit('updateStudentScore', query);
}