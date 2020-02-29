var socket = io();
var params = jQuery.deparam(window.location.search);

var quizId;

socket.on('connect', function() {
    socket.emit('req-quiz-data', params);
});

socket.on('gameData-edit',function(data){
    document.getElementById("name").value=`${data.name}`;
    quizId = data.id;
    for(q in data.questions){
        addQuestion();
        fixedOpenTab(questionNum, data.questions[String(q)]);
    }
});

function fixedOpenTab(id, data){
    var targetQuestion = document.getElementById(`tabcontent${id}`);
    var tabcontent = '';
    switch(data.type){
        case("4c"):
            tabcontent = `
            <div id="type${id}" style = "display:none">4c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${id}" type = "text" value="${data.question}" autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio1${id}" name = "correct${id}" value = 1></input>
            <label>Answer 1: </label>
            <input id = "${id}a1" type = "text" value="${data.answers[0]}" autofocus/>
            <input type = "radio" id = "radio2${id}" name = "correct${id}" value = 2></input>
            <label>Answer 2: </label>
            <input id = "${id}a2" type = "text" value="${data.answers[1]}" autofocus/>
            <br>
            <br>
            <input type = "radio" id = "radio3${id}" name = "correct${id}" value = 3></input>
            <label>Answer 3: </label>
            <input id = "${id}a3"  type = "text" value="${data.answers[2]}" autofocus/>
            <input type = "radio" id = "radio4${id}" name = "correct${id}" value = 4></input>
            <label>Answer 4: </label>
            <input id = "${id}a4"  type = "text" value="${data.answers[3]}" autofocus/>`
            break;
        case("2c"):
            tabcontent = `
            <div id="type${id}" style = "display:none">2c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${id}" type = "text" value="${data.question}" autofocus/>
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
            <input class = "question" id = "q${id}" type = "text" value="${data.question}" autofocus/>
            <br>
            <br>
            <label>Correct Answer :</label>
            <input class = "correct" id = "correct${id}" value="${data.correct}" type = "text" autofocus/>
            <br>
            <br>`
    }
    targetQuestion.innerHTML = tabcontent;
    if(data.type == "4c" || data.type == "2c")
        document.getElementById(`radio${data.correct}${id}`).checked = true;
}

function editQuiz(){
    var questions = [];
    var name = document.getElementById('name').value;
    for(var i = 1; i <= questionNum; i++){
        if(document.getElementById('q'+i) == undefined) continue;
        var question = document.getElementById('q' + i).value;
        var answers = [];
        var type = document.getElementById("type"+i).innerText;
        // var correct = document.getElementById('correct' + i).value;
        var correct;
        switch(type){
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
        questions.push({"question": question, "answers": answers, "correct": correct, "type":type})
    }
    
    var quiz = {id: quizId, "name": name, "questions": questions};
    socket.emit('editQuiz', quiz);
}