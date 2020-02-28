var socket = io();
var questionNum = 0; 

function updateDatabase(){
    var questions = [];
    var name = document.getElementById('name').value;
    for(var i = 1; i <= questionNum; i++){
        // if(qtype){}
        // else{} 
        var question = document.getElementById('q' + i).value;
        var answers = [];
        var type = document.getElementById("type"+i).innerText;
        if (type === "4c"){
            var answer1 = document.getElementById(i + 'a1').value;
            var answer2 = document.getElementById(i + 'a2').value;
            var answer3 = document.getElementById(i + 'a3').value;
            var answer4 = document.getElementById(i + 'a4').value;
            answers = [answer1, answer2, answer3, answer4];
        }
        var correct = document.getElementById('correct' + i).value;
        questions.push({"question": question, "answers": answers, "correct": correct, "type":type})
    }
    
    var quiz = {id: 0, "name": name, "questions": questions};
    socket.emit('newQuiz', quiz);
};


var questionTable = "";

function addQuestion(){
    questionNum += 1;
    questionTable = document.getElementById('allQuestions');
    thisQuestion = document.createElement("div");
    thisQuestion.setAttribute("id",`Question${questionNum}`);
    thisQuestion.innerHTML = `
    <h3>Question ${questionNum} :</h3>
        <div class="tab">
            <button class="tablinks${questionNum}" onclick="openTab(event, '4c', ${questionNum})">Select 4 choices</button>
            <button class="tablinks${questionNum}" onclick="openTab(event, '2c', ${questionNum})">Select 2 choices</button>
            <button class="tablinks${questionNum}" onclick="openTab(event, 'sa', ${questionNum})">Select Short Answer</button> 
            <br>
            <br>
        </div>
        <div id="tabcontent${questionNum}">
            <div id="type${questionNum}" style = "display:none">4c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            <label>Answer 1: </label>
            <input id = "${questionNum}a1" type = "text" autofocus/>
            <label>Answer 2: </label>
            <input id = "${questionNum}a2" type = "text" autofocus/>
            <br>
            <br>
            <label>Answer 3: </label>
            <input id = "${questionNum}a3"  type = "text"autofocus/>
            <label>Answer 4: </label>
            <input id = "${questionNum}a4"  type = "text" autofocus/>
            <br>
            <br>
            <label>Correct Answer (1-4) :</label>
            <input class = "correct" id = "correct${questionNum}"  type = "number" autofocus/>
        </div>    
    <br>`;
    questionTable.appendChild(thisQuestion);
}

function openTab(evt, quizType, id){
    if(evt.currentTarget.className == "active") return;
    //unactive all tablinks
    tablinks = document.getElementsByClassName(`tablinks${id}`);
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    //active the target tablink
    evt.currentTarget.className += " active";
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
            <label>Answer 1: </label>
            <input id = "${questionNum}a1" type = "text" autofocus/>
            <label>Answer 2: </label>
            <input id = "${questionNum}a2" type = "text" autofocus/>
            <br>
            <br>
            <label>Answer 3: </label>
            <input id = "${questionNum}a3"  type = "text"autofocus/>
            <label>Answer 4: </label>
            <input id = "${questionNum}a4"  type = "text" autofocus/>
            <br>
            <br>
            <label>Correct Answer (1-4) :</label>
            <input class = "correct" id = "correct${questionNum}"  type = "number" autofocus/>`
            break;
        case("2c"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">2c</div>
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            <label>Correct Answer (1-2) :</label>
            <input class = "correct" id = "correct${questionNum}"  type = "number" autofocus/>`
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
            <input class = "correct" id = "correct${questionNum}" type = "text" autofocus/>
            <br>
            <br>`
    }
    targetQuestion.innerHTML = tabcontent;
}

//Called when user wants to exit quiz creator
function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../";
    }
}

socket.on('startGameFromCreator', function(data){
    window.location.href = "../../host/?id=" + data;
});

function randomColor(){
    
    var colors = ['#4CAF50', '#f94a1e', '#3399ff', '#ff9933'];
    var randomNum = Math.floor(Math.random() * 4);
    return colors[randomNum];
}

function setBGColor(){
    var randColor = randomColor();
    document.getElementById('question-field').style.backgroundColor = randColor;
}








