var socket = io();
var questionNum = 0; 
var questionCounter = 0;
function updateDatabase(){
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
        
        var quiz = { id: 0, "name": name, "questions": questions };
        socket.emit('newQuiz', quiz);
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
        window.location.href = "../";
    }
}

socket.on('startGameFromCreator', function (data) {
    window.location.href = "../index.html";
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








