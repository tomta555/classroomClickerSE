var socket = io();
var questionNum = 0;
var questionCounter = 0;
var tags = [];
var params = jQuery.deparam(window.location.search);
var countCorrect = 1;
var courseId = params.courseId;
// var quizId;
socket.on('connect',function(){
    var mainTitle = document.getElementById('mainTitle');
    var submitButton = document.getElementById('submitButton');
    var cancleButton = document.getElementById('cancleButton');
    console.log(params.type==="editHw");
    switch( params.type.toString() ){
        case("createQuiz"):
            mainTitle.innerHTML="create Quiz";
            addQuestion();
            submitButton.setAttribute("onclick","updateDatabase('createQuiz', 0)");
            submitButton.innerHTML="Create Quiz";
            cancleButton.innerHTML="Cancle Quiz";
            mainTitle.innerHTML="Create Quiz";
            break;
        case("editQuiz"):
            mainTitle.innerHTML="edit Quiz";
            socket.emit('req-quiz-data', params);
            submitButton.setAttribute("onclick", "updateDatabase('editQuiz', 0)");
            submitButton.innerHTML="Save";
            cancleButton.innerHTML="cancle";
            mainTitle.innerHTML="Edit Quiz";
            document.getElementById('deleteQuizButton').setAttribute("onclick", `deleteQuiz(${params.id})`)
            break;
        case("createHw"):
            mainTitle.innerHTML="create Hw";
            addQuestion();
            submitButton.setAttribute("onclick","updateDatabase('createHw', 0)");
            submitButton.innerHTML="Create Quiz";
            cancleButton.innerHTML="Cancle Quiz";
            mainTitle.innerHTML="Create Quiz";
            break;
        case("editHw"):
            mainTitle.innerHTML="Edit Homework";
            socket.emit('req-hw-data', params);
            submitButton.setAttribute("onclick", "updateDatabase('editHw', 0)");
            submitButton.innerHTML="Save";
            cancleButton.innerHTML="cancle";
            document.getElementById('deleteQuizButton').setAttribute("onclick", ``)
            break;
    }
    // socket.emit('getTags',{"id":params.courseId});
});

// socket.on('TagsData', function(data){
//     var tags = document.getElementsByClassName('dropdown-content');
    
// });


socket.on('gameData-edit',function(data){
    document.getElementById('submitButton').setAttribute("onclick",`updateDatabase('edit', ${data.id})`);
    document.getElementById("name").value=`${data.name}`;
    // quizId = data.id;
    for(q in data.questions){
        addQuestion();
        fixedOpenTab(questionNum, data.questions[String(q)]);
        for(i in data.questions[String(q)].tag){
            addTagBox(questionNum, data.questions[String(q)].tag[String[i]], i);
        }
    }
});
function updateDatabase(reqtype, Id){
    var questions = [];
    var tag;
    var name = document.getElementById('name').value;
    for (var i = 1; i <= questionNum; i++) {
        if (document.getElementById('q' + i) == undefined) continue;
        var question = document.getElementById('q' + i).value;
        var qtag = document.getElementsByClassName("tag"+i);
        //get tags
        tag = [];
        if(qtag !== undefined){
            for(k in qtag){
                tag.push(k.innerText);
            }
        }
        var answers = [];
        var qtype = document.getElementById(`type${i}`).innerText;
        
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
            case ("2c"):
                correct = radioCheck(i);
                break;
            case("sa"):
                for (var j = 1; j <= countCorrect; j++){
                    tempans = document.getElementById(j + 'correct' + i).value;
                    answers[j - 1] = tempans.toUpperCase();
               }
            }
            questions.push({"question": question, "tag":tag, "type":qtype, "answers": answers, "correct": correct})
    }
    var data = { id: 0, "name": name, "questions": questions,"courseId": courseId };
    console.log(data);
    switch(reqtype){
        case('createQuiz'):
            socket.emit('newQuiz',data);
            break;
        case('editQuiz'):
            data.id = Id;
            socket.emit('editQuiz',data);
            break;
        case('createHw'):
            socket.emit('newHw',data);
            break;
        case('editHw'):
            data.id = Id;
            socket.emit('editHw',data);
            break;
        }
};
function deleteQuiz(quizId){
    socket.emit('deleteQuiz',{"id":quizId});
}
function addTagBox(questionNum, tagInput, tagNum){
    var tagbox = document.getElementById(`tagbox${questionNum}`);
    var thistag = document.createElement("div");
    var delBut = document.createElement("button");

    delBut.innerText = 'x';
    delBut.setAttribute("onclick", `document.getElementById('tag${questionNum}_${tagNum}').remove()`)
    thistag.className += ` tag${questionNum}`; 
    thistag.className += " questionTag";
    thistag.innerHTML = tagInput.value;
    thistag.setAttribute('id', `tag${questionNum}_${tagNum}`)
    thistag.appendChild(delBut);
    tagNum += 1;
    tagbox.appendChild(thistag);
    document.getElementsByClassName('addTagBut')[questionNum-1].setAttribute('onclick', `addTagBox(${questionNum},document.getElementById('tagInput${questionNum}'), ${tagNum})`);
    tagInput.value = "";
}
function addQuestion(){
    var questionTable = "";
    questionCounter += 1;
    questionNum += 1;
    questionTable = document.getElementById('allQuestions');
    thisQuestion = document.createElement("div");
    thisQuestion.setAttribute("id", `Question${questionNum}`);
    thisQuestion.innerHTML = `
    <h3 id="questionName${questionNum}">Question ${questionCounter} :</h3>
        <div class="tab">
            <button class="tablinks${questionNum} active" onclick="openTab(event, '4c', ${questionNum})">4 choices</button>
            <button class="tablinks${questionNum}" onclick="openTab(event, '2c', ${questionNum})">true or false</button>
            <button class="tablinks${questionNum}" onclick="openTab(event, 'sa', ${questionNum})">Short Answer</button> 
            <button style="background-color: rgb(240, 160, 56); "onclick="exportQeustion(${questionNum})" >export(not work yet)</button>
            <button style="background-color: rgb(209, 61, 24); "onclick="deleteQuestion(${questionNum})" >Delete</button>
        </div>
        <br>
        <div id = "tagbox${questionNum}" class="box">
        </div>
        <label>Tags : </label>
        <input class = "question" id="tagInput${questionNum}" type="text">
        <div class="dropdown">
            <button class="dropbtn">v</button>
            <div class="dropdown-content">
                <p>hello</p>
            </div>
        </div>
        <button class="addTagBut" onclick="addTagBox(${questionNum},document.getElementById('tagInput${questionNum}'), 0)">Add</button>
        <br>
        <label>Question : </label>
        <input class = "question" id = "q${questionNum}" type = "text">
        <br>
        <br>
        <div id="tabcontent${questionNum}">
            <div id="type${questionNum}" style = "display:none">4c</div>
            <input type = "radio" id = "radio1${questionNum}" name = "correct${questionNum}" value = 1></input>
            <label>Answer 1: </label>
            <input id = "${questionNum}a1" type = "text">
            <input type = "radio" id = "radio2${questionNum}" name = "correct${questionNum}" value = 2></input>
            <label>Answer 2: </label>
            <input id = "${questionNum}a2" type = "text">
            <br>
            <br>
            <input type = "radio" id = "radio3${questionNum}" name = "correct${questionNum}" value = 3></input>
            <label>Answer 3: </label>
            <input id = "${questionNum}a3"  type = "text>
            <input type = "radio" id = "radio4${questionNum}" name = "correct${questionNum}" value = 4></input>
            <label>Answer 4: </label>
            <input id = "${questionNum}a4"  type = "text">
        </div> 
        <br>
        <label>Score : </label>
        <input id="score${questionNum}" type="text" class="question"></input>    
    <br>`;
    questionTable.appendChild(thisQuestion);
}
function deleteQuestion(i) {
    questionCounter -= 1;
    document.getElementById(`Question${i}`).remove();
    var counter = 1;
    for (j = 1; j <= questionNum; j++) {
        var q = document.getElementById(`questionName${j}`)
        if (q != undefined) {
            q.innerHTML = `Question ${counter} : `;
            counter++;
        }
    }

}
function radioCheck(i) {
    var allRadio = document.getElementsByName(`correct${i}`);
    var quizType;
    for(var j=0; j<4;j++){
        if(allRadio[j].checked == true) return allRadio[j].value;
    }
}

function fixedOpenTab(id, data){
    var targetQuestion = document.getElementById(`tabcontent${id}`);
    var tabcontent = `
            <br>
            <label>Question : </label>
            <input class = "question" id = "q${id}" type = "text" value='${data.question}'>
            <br>
            <br>`;
    switch(data.type){
        case("4c"):
            quizType = "4 choices";
            tabcontent = `
            <div id="type${id}" style = "display:none">4c</div>
            
            <input type = "radio" id = "radio1${id}" name = "correct${id}" value = 1></input>
            <label>Answer 1: </label>
            <input id = "${id}a1" type = "text" value='${data.answers[0]}'>
            <input type = "radio" id = "radio2${id}" name = "correct${id}" value = 2></input>
            <label>Answer 2: </label>
            <input id = "${id}a2" type = "text" value='${data.answers[1]}'>
            <br>
            <br>
            <input type = "radio" id = "radio3${id}" name = "correct${id}" value = 3></input>
            <label>Answer 3: </label>
            <input id = "${id}a3"  type = "text" value='${data.answers[2]}'>
            <input type = "radio" id = "radio4${id}" name = "correct${id}" value = 4></input>
            <label>Answer 4: </label>
            <input id = "${id}a4"  type = "text" value='${data.answers[3]}'>`
            break;
        case("2c"):
            quizType = "true or false";
            tabcontent = `
            <div id="type${id}" style = "display:none">2c</div>
            <input type = "radio" id = "radio1${id}" name = "correct${id}" value = 1></input> <label>True</lebel>
            <input type = "radio" id = "radio2${id}" name = "correct${id}" value = 2></input> <label>False</lebel>`
            break;
        case("sa"):
            quizType = "Short Answer";
            tabcontent = `
            <div id="type${id}" style = "display:none">sa</div>
            <label>Correct Answer :</label>
            <input class = "question" id = "correct${id}" value='${data.correct}' type = "text">
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
    var tablinks = document.getElementsByClassName(`tablinks${questionNum}`);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        if(tablinks[i].innerHTML == quizType){
            tablinks[i].className += " active";
        }
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
    switch (quizType) {
        case ("4c"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">4c</div>
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
        case ("2c"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">2c</div>
            
            <input type = "radio" id = "radio1${questionNum}" name = "correct${questionNum}" value = 1></input> <label>True</lebel>
            <input type = "radio" id = "radio2${questionNum}" name = "correct${questionNum}" value = 2></input> <label>False</lebel>`
            break;
        case ("sa"):
            tabcontent = `
            <div id="type${questionNum}" style = "display:none">sa</div>
            <label>Correct Answer :</label>
            <div id="allCorrect">
            <div id="countCorrect">
            <input class = "correct" id = "${countCorrect}correct${questionNum}" type = "text" autofocus/>
            <br>
            <br>
            </div>
            </div>
            <button class="tablinks${questionNum}" onclick="addbuttonAns()">AddAnswer</button> 
            <br>`
    }
    targetQuestion.innerHTML = tabcontent;
}
function addbuttonAns() {
    countCorrect++;
    var AnsDiv = document.createElement("div");
    AnsDiv.innerHTML = document.getElementById('countCorrect').innerHTML;
    document.getElementById('allCorrect').appendChild(AnsDiv);
    AnsDiv.getElementsByTagName("input")[0].setAttribute("id", `${countCorrect}correct${questionNum}`);
    console.log(countCorrect);
}

//Called when user wants to exit quiz creator
function cancelQuiz() {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "/host_quiz";
    }
}

socket.on('backToHostPage', function (data) {
    window.location.href = `/courseInfo?courseId=${courseId}`;
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








