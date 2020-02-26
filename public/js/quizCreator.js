var socket = io();
var questionNum = 0; 

function updateDatabase(){
    var questions = [];
    var name = document.getElementById('name').value;
    for(var i = 1; i <= questionNum; i++){
        var question = document.getElementById('q' + i).value;
        var answers = [];
        var type = "";
        switch(document.getElementById('type'+i).innerText){
            case("4c"):
                var answer1 = document.getElementById(i + 'a1').value;
                var answer2 = document.getElementById(i + 'a2').value;
                var answer3 = document.getElementById(i + 'a3').value;
                var answer4 = document.getElementById(i + 'a4').value;
                answers = [answer1, answer2, answer3, answer4];
                type = "4c";
                break;
            case("2c"):
                var answer1 = document.getElementById(i + 'a1').value;
                var answer2 = document.getElementById(i + 'a2').value;
                answers = [answer1, answer2];
                type = "2c";
                break;
            case("sa"):
                type = "sa";
                
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
    questionTable = document.getElementById('allQuestions').innerHTML;
    questionTable += `
    <h3>Question ${questionNum} :</h3>

      <div class="tab">
        <button class="tablinks${questionNum}" onclick="openTab(event, '4 choices${questionNum}', ${questionNum})">Select 4 choices</button>
        <button class="tablinks${questionNum}" onclick="openTab(event, '2 choices${questionNum}', ${questionNum})">Select 2 choices</button>
        <button class="tablinks${questionNum}" onclick="openTab(event, 'Short Answer${questionNum}', ${questionNum})">Select Short Answer</button> 
        <br>
        <br>
      </div>
      
      <div id="4 choices${questionNum}" class="tabcontent${questionNum}"><br>
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
      
      <div id="2 choices${questionNum}" class="tabcontent${questionNum}" style="display:none"><br>
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
        <label>Correct Answer (1-2) :</label>
        <input class = "correct" id = "correct${questionNum}"  type = "number" autofocus/>
      </div>
      
      <div id="Short Answer${questionNum}" class="tabcontent${questionNum}" style="display:none"><br>
        <label>Question : </label>
        <input class = "question" id = "q${questionNum}" type = "text" autofocus/>
        <br>
        <br>
        <label>Correct Answer :</label>
        <input class = "correct" id = "correct${questionNum}" type = "text" autofocus/>
        <br>
        <br>
      </div>
    <br>`;
    document.getElementById('allQuestions').innerHTML = questionTable;
}

function openTab(evt, quizType,id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName(`tabcontent${id}`);
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName(`tablinks${id}`);
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(quizType).style.display = "block";
    evt.currentTarget.className += " active";
}

function addQuestion4c(){
    questionNum += 1;
    
    var questionsDiv = document.getElementById('allQuestions');
    var newQuestionDiv = document.createElement("div");
    var questionType = document.createElement("div");
    
    var questionLabel = document.createElement('label');
    var questionField = document.createElement('input');
    
    var answer1Label = document.createElement('label');
    var answer1Field = document.createElement('input');
    
    var answer2Label = document.createElement('label');
    var answer2Field = document.createElement('input');
    
    var answer3Label = document.createElement('label');
    var answer3Field = document.createElement('input');
    
    var answer4Label = document.createElement('label');
    var answer4Field = document.createElement('input');
    
    var correctLabel = document.createElement('label');
    var correctField = document.createElement('input');

    questionType.innerHTML = "4c";
    questionType.setAttribute('id','type'+String(questionNum));
    questionType.setAttribute('style', 'display:none');

    questionLabel.innerHTML = "Question " + String(questionNum) + ": ";
    questionField.setAttribute('class', 'question');
    questionField.setAttribute('id', 'q' + String(questionNum));
    questionField.setAttribute('type', 'text');
    
    answer1Label.innerHTML = "Answer 1: ";
    answer2Label.innerHTML = " Answer 2: ";
    answer3Label.innerHTML = "Answer 3: ";
    answer4Label.innerHTML = " Answer 4: ";
    correctLabel.innerHTML = "Correct Answer (1-4): ";
    
    answer1Field.setAttribute('id', String(questionNum) + "a1");
    answer1Field.setAttribute('type', 'text');
    answer2Field.setAttribute('id', String(questionNum) + "a2");
    answer2Field.setAttribute('type', 'text');
    answer3Field.setAttribute('id', String(questionNum) + "a3");
    answer3Field.setAttribute('type', 'text');
    answer4Field.setAttribute('id', String(questionNum) + "a4");
    answer4Field.setAttribute('type', 'text');
    correctField.setAttribute('id', 'correct' + String(questionNum));
    correctField.setAttribute('type', 'number');
    
    newQuestionDiv.setAttribute('id', 'question-field');//Sets class of div

    newQuestionDiv.appendChild(questionType);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(questionLabel);
    newQuestionDiv.appendChild(questionField);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(answer1Label);
    newQuestionDiv.appendChild(answer1Field);
    newQuestionDiv.appendChild(answer2Label);
    newQuestionDiv.appendChild(answer2Field);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(answer3Label);
    newQuestionDiv.appendChild(answer3Field);
    newQuestionDiv.appendChild(answer4Label);
    newQuestionDiv.appendChild(answer4Field);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(correctLabel);
    newQuestionDiv.appendChild(correctField);
    
    questionsDiv.appendChild(document.createElement('br'));//Creates a break between each question
    questionsDiv.appendChild(newQuestionDiv);//Adds the question div to the screen
    
    newQuestionDiv.style.backgroundColor = randomColor();
}
function addQuestion2c(){
    questionNum += 1;
    
    var questionsDiv = document.getElementById('allQuestions');
    var newQuestionDiv = document.createElement("div");
    var questionType = document.createElement("div");
    
    var questionLabel = document.createElement('label');
    var questionField = document.createElement('input');
    
    var answer1Label = document.createElement('label');
    var answer1Field = document.createElement('input');
    
    var answer2Label = document.createElement('label');
    var answer2Field = document.createElement('input');
    
    var correctLabel = document.createElement('label');
    var correctField = document.createElement('input');

    questionType.innerHTML = "2c";
    questionType.setAttribute('id','type'+String(questionNum));
    questionType.setAttribute('style', 'display:none');

    questionLabel.innerHTML = "Question " + String(questionNum) + ": ";
    questionField.setAttribute('class', 'question');
    questionField.setAttribute('id', 'q' + String(questionNum));
    questionField.setAttribute('type', 'text');
    
    answer1Label.innerHTML = "Answer 1: ";
    answer2Label.innerHTML = " Answer 2: ";
    correctLabel.innerHTML = "Correct Answer (1-2): ";
    
    answer1Field.setAttribute('id', String(questionNum) + "a1");
    answer1Field.setAttribute('type', 'text');
    answer2Field.setAttribute('id', String(questionNum) + "a2");
    answer2Field.setAttribute('type', 'text');
    correctField.setAttribute('id', 'correct' + String(questionNum));
    correctField.setAttribute('type', 'number');
    
    newQuestionDiv.setAttribute('id', 'question-field');//Sets class of div

    newQuestionDiv.appendChild(questionType);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(questionLabel);
    newQuestionDiv.appendChild(questionField);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(answer1Label);
    newQuestionDiv.appendChild(answer1Field);
    newQuestionDiv.appendChild(answer2Label);
    newQuestionDiv.appendChild(answer2Field);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(correctLabel);
    newQuestionDiv.appendChild(correctField);
    
    questionsDiv.appendChild(document.createElement('br'));//Creates a break between each question
    questionsDiv.appendChild(newQuestionDiv);//Adds the question div to the screen
    
    newQuestionDiv.style.backgroundColor = randomColor();
}
function addQuestionSA(){
    questionNum += 1;
    
    var questionsDiv = document.getElementById('allQuestions');
    var newQuestionDiv = document.createElement("div");
    var questionType = document.createElement("div");
    
    var questionLabel = document.createElement('label');
    var questionField = document.createElement('input');
    
    var correctLabel = document.createElement('label');
    var correctField = document.createElement('input');

    questionType.innerHTML = "sa";
    questionType.setAttribute('id','type'+String(questionNum));
    questionType.setAttribute('style', 'display:none');
    
    questionLabel.innerHTML = "Question " + String(questionNum) + ": ";
    questionField.setAttribute('class', 'question');
    questionField.setAttribute('id', 'q' + String(questionNum));
    questionField.setAttribute('type', 'text');
    
    correctLabel.innerHTML = "Correct Answer: ";
    
    correctField.setAttribute('id', 'correct' + String(questionNum));
    correctField.setAttribute('type', 'text');
    
    newQuestionDiv.setAttribute('id', 'question-field');//Sets class of div
    
    newQuestionDiv.appendChild(questionType);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(questionLabel);
    newQuestionDiv.appendChild(questionField);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(correctLabel);
    newQuestionDiv.appendChild(correctField);
    
    questionsDiv.appendChild(document.createElement('br'));//Creates a break between each question
    questionsDiv.appendChild(newQuestionDiv);//Adds the question div to the screen
    
    newQuestionDiv.style.backgroundColor = randomColor();
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









