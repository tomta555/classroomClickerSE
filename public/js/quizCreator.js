var socket = io();
var questionNum = 0; 
var questionCounter = 0;
var params = jQuery.deparam(window.location.search);
// var quizId;
socket.on('connect',function(){
    if(params.id == undefined){
        addQuestion();
        document.getElementById('submitButton').setAttribute("onclick","updateDatabase('create', 0)");
        document.getElementById('submitButton').innerHTML="Create Quiz";
        document.getElementById('cancleButton').innerHTML="Cancle Quiz";
        document.getElementById('mainTitle').innerHTML="Create Quiz";
    }else{
        socket.emit('req-quiz-data', params);
        document.getElementById('submitButton').setAttribute("onclick","updateDatabase('edit', 0)");
        document.getElementById('submitButton').innerHTML="Save";
        document.getElementById('cancleButton').innerHTML="cancle";
        document.getElementById('mainTitle').innerHTML="Edit Quiz";
    }
});
socket.on('gameData-edit',function(data){
    document.getElementById('submitButton').setAttribute("onclick",`updateDatabase('edit', ${data.id})`);
    document.getElementById("name").value=`${data.name}`;
    // quizId = data.id;
    for(q in data.questions){
        addQuestion();
        fixedOpenTab(questionNum, data.questions[String(q)]);
    }
});
function updateDatabase(reqtype, quizId){
    var questions = [];
    var name = document.getElementById('name').value;
    for(var i = 1; i <= questionNum; i++){
        if(document.getElementById('q'+i) == undefined) continue;
        var question = document.getElementById('q' + i).value;
        var content = document.getElementById("content"+i).value;
        var answers = [];
        var qtype = document.getElementById("type"+i).innerText;
        // var correct = document.getElementById('correct' + i).value;
        var correct;
        switch(qtype){
            case("4c"):
                var answer1 = document.getElementById(i + 'a1').value;
                var answer2 = document.getElementById(i + 'a2').value;
                var answer3 = document.getElementById(i + 'a3').value;
                var answer4 = document.getElementById(i + 'a4').value;
                correct = radioCheck(i);
                answers = [answer1, answer2, answer3, answer4];
                break;
                case("2c"):
                correct = radioCheck(i);
                break;
                case("sa"):
                correct = document.getElementById('correct' + i).value;
            }
            questions.push({"question": question, "content":content, "type":qtype, "answers": answers, "correct": correct})
    }
    var quiz = { id: 0, "name": name, "questions": questions };
    switch(reqtype){
        case('create'):
            socket.emit('newQuiz',quiz);
            break;
        case('edit'):
            quiz.id = quizId;
            socket.emit('editQuiz',quiz);
            socket.emit('addQuizContent',{"id":quizId, "content":content});
    }
};
function addQuestion(){
    var questionTable = "";
    questionCounter += 1;
    questionNum += 1;
    questionTable = document.getElementById('allQuestions');
    thisQuestion = document.createElement("div");
    thisQuestion.setAttribute("id",`Question${questionNum}`);
    thisQuestion.innerHTML = `
    <h3 id="questionName${questionNum}">Question ${questionCounter} :</h3>
        <div class="tab">
            <button class="tablinks${questionNum} active" onclick="openTab(event, '4c', ${questionNum})">4 choices</button>
            <button class="tablinks${questionNum}" onclick="openTab(event, '2c', ${questionNum})">true or false</button>
            <button class="tablinks${questionNum}" onclick="openTab(event, 'sa', ${questionNum})">Short Answer</button> 
            <button style="background-color: rgb(240, 160, 56); "onclick="exportQeustion(${questionNum})" >export(not work yet)</button>
            <button style="background-color: rgb(209, 61, 24); "onclick="deleteQeustion(${questionNum})" >Delete</button>
        </div>
        <br>
        <div>
            <label>Quiz content : </label>
            <input class = "question" id="content${questionNum}" type="text" autofocus/>
        </div>
        <div id="tabcontent${questionNum}">
            <div id="type${questionNum}" style = "display:none">4c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio1${questionNum}" name = "correct${questionNum}" value = 1></input>
            <label>Answer 1: </label>
            <input id = "${questionNum}a1" type = "text" autofocus/>
            <input type = "radio" id = "radio2${questionNum}" name = "correct${questionNum}" value = 2></input>
            <label>Answer 2: </label>
            <input id = "${questionNum}a2" type = "text" autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio3${questionNum}" name = "correct${questionNum}" value = 3></input>
            <label>Answer 3: </label>
            <input id = "${questionNum}a3"  type = "text"autofocus/>
            <input type = "radio" id = "radio4${questionNum}" name = "correct${questionNum}" value = 4></input>
            <label>Answer 4: </label>
            <input id = "${questionNum}a4"  type = "text" autofocus/>
        </div>    
    <br>`;
    questionTable.appendChild(thisQuestion);
}
function deleteQeustion(i){
    questionCounter-=1;
    document.getElementById(`Question${i}`).remove();
    var counter = 1;
    for(j=1;j<=questionNum;j++){
        var q = document.getElementById(`questionName${j}`)
        if(q != undefined){
            q.innerHTML = `Question ${counter} : `;
            counter++;
        }
    }

}
function radioCheck(i){
    var allRadio = document.getElementsByName(`correct${i}`);
    for(var j=0; j<4;j++){
        if(allRadio[j].checked == true) return allRadio[j].value;
    }
}

function fixedOpenTab(id, data){
    var targetQuestion = document.getElementById(`tabcontent${id}`);
    var tabcontent = '';
    switch(data.type){
        case("4c"):
            tabcontent = `
            <div id="type${id}" style = "display:none">4c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${id}" type = "text" value='${data.question}' autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio1${id}" name = "correct${id}" value = 1></input>
            <label>Answer 1: </label>
            <input id = "${id}a1" type = "text" value='${data.answers[0]}' autofocus/>
            <input type = "radio" id = "radio2${id}" name = "correct${id}" value = 2></input>
            <label>Answer 2: </label>
            <input id = "${id}a2" type = "text" value='${data.answers[1]}' autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio3${id}" name = "correct${id}" value = 3></input>
            <label>Answer 3: </label>
            <input id = "${id}a3"  type = "text" value='${data.answers[2]}' autofocus/>
            <input type = "radio" id = "radio4${id}" name = "correct${id}" value = 4></input>
            <label>Answer 4: </label>
            <input id = "${id}a4"  type = "text" value='${data.answers[3]}' autofocus/>`
            break;
        case("2c"):
            tabcontent = `
            <div id="type${id}" style = "display:none">2c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${id}" type = "text" value='${data.question}' autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio1${id}" name = "correct${id}" value = 1></input> <label>True</lebel>
            <input type = "radio" id = "radio2${id}" name = "correct${id}" value = 2></input> <label>False</lebel>`
            break;
        case("sa"):
            tabcontent = `
            <div id="type${id}" style = "display:none">sa</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${id}" type = "text" value='${data.question}' autofocus/>
            <br>
            <br>
            <label>Correct Answer :</label>
            <input class = "question" id = "correct${id}" value='${data.correct}' type = "text" autofocus/>
            <br>
            <br>`
    }
    targetQuestion.innerHTML = tabcontent;
    //make sure that there are no weird symbol (' or ")
    document.getElementById(`q${id}`).value = data.question;
    if(data.type == "4c"){
        document.getElementById(`${id}a1`).value = data.answers[0];
        document.getElementById(`${id}a2`).value = data.answers[1];
        document.getElementById(`${id}a3`).value = data.answers[2];
        document.getElementById(`${id}a4`).value = data.answers[3];
    }
    if(data.type == "4c" || data.type == "2c"){
        document.getElementById(`radio${data.correct}${id}`).checked = true;
    }else{
        document.getElementById(`correct${id}`).value = data.correct;
    }

}
function openTab(evt, quizType, id){
    if(evt.currentTarget.className == "active") return;
    //unactive all tablinks
    tablinks = document.getElementsByClassName(`tablinks${id}`);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    //active the target tablink
    evt.currentTarget.className += "active";
    var targetQuestion = document.getElementById(`tabcontent${id}`);
    var tabcontent;
    switch(quizType){
        case("4c"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">4c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio1${questionNum}" name = "correct${questionNum}" value = 1></input>
            <label>Answer 1: </label>
            <input id = "${questionNum}a1" type = "text" autofocus/>
            <input type = "radio" id = "radio2${questionNum}" name = "correct${questionNum}" value = 2></input>
            <label>Answer 2: </label>
            <input id = "${questionNum}a2" type = "text" autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio3${questionNum}" name = "correct${questionNum}" value = 3></input>
            <label>Answer 3: </label>
            <input id = "${questionNum}a3"  type = "text"autofocus/>
            <input type = "radio" id = "radio4${questionNum}" name = "correct${questionNum}" value = 4></input>
            <label>Answer 4: </label>
            <input id = "${questionNum}a4"  type = "text" autofocus/>`
            break;
        case("2c"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">2c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            
            <input type = "radio" id = "radio1${questionNum}" name = "correct${questionNum}" value = 1></input> <label>True</lebel>
            <input type = "radio" id = "radio2${questionNum}" name = "correct${questionNum}" value = 2></input> <label>False</lebel>`
            break;
        case("sa"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">sa</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            <label>Correct Answer :</label>
            <input class = "question" id = "correct${questionNum}" type = "text" autofocus/>
            <br>
            <br>`
    }
    targetQuestion.innerHTML = tabcontent;
}

//Called when user wants to exit quiz creator
function cancelQuiz() {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "/host_quiz";
    }
}

socket.on('backToHostPage', function (data) {
    window.location.href = "/host_quiz";
});

function randomColor() {
    var colors = ['#4CAF50', '#f94a1e', '#3399ff', '#ff9933'];
    var randomNum = Math.floor(Math.random() * 4);
    return colors[randomNum];
}

function setBGColor() {
    var randColor = randomColor();
    document.getElementById('question-field').style.backgroundColor = randColor;
}








