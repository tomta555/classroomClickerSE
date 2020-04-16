var socket = io();
var params = jQuery.deparam(window.location.search);
var courseData;
var questionNum = 0;
var questionCounter = 0;
var countCorrect = 1;
var courseId = parseInt(params.courseId);
var uName;
// var quizId;
socket.on('connect', function () {
    socket.emit('get-user-detail');
    socket.emit('get-course-detail',{"id":params.courseId});
    var mainTitle = document.getElementById('mainTitle');
    var quizTitle = document.getElementById('quizTitle');
    var submitButton = document.getElementById('submitButton');
    var cancelButton = document.getElementById('cancelButton');
    var deleteButton = document.getElementById('deleteQuizButton');
    switch (params.type.toString()) {
        case ("createQuiz"):
            mainTitle.innerHTML = "New Quiz";
            addQuestion();
            submitButton.setAttribute("onclick", "updateDatabase('createQuiz', 0)");
            submitButton.innerHTML = "Create Quiz";
            cancelButton.innerHTML = "cancel Quiz";
            mainTitle.innerHTML = "Create Quiz";
            break;
        case ("editQuiz"):
            mainTitle.innerHTML = "edit Quiz";
            submitButton.setAttribute("onclick", `updateDatabase('editQuiz', ${params.id})`);
            submitButton.innerHTML = "Save";
            cancelButton.innerHTML = "cancel";
            mainTitle.innerHTML = "Edit Quiz";
            document.getElementById('deleteQuizButton').setAttribute("onclick", `deleteQuiz(${params.id})`)
            socket.emit('req-quiz-data', params);
            break;
        case ("createHw"):
            mainTitle.innerHTML = "New Homework";
            addQuestion();
            customScore = document.getElementById("customScore").style.display = 'block';
            submitButton.setAttribute("onclick", "updateDatabase('createHw', 0)");
            submitButton.innerHTML = "Create Homework";
            cancelButton.innerHTML = "cancel Homework";
            quizTitle.innerHTML="Homework title";
            deleteButton.innerHTML = 'cancel Homework';
            break;
        case ("editHw"):
            mainTitle.innerHTML = "Edit Homework";
            submitButton.setAttribute("onclick", `updateDatabase('editHw', ${params.id})`);
            submitButton.innerHTML="Save";
            cancelButton.innerHTML="cancel";
            document.getElementById('deleteQuizButton').setAttribute("onclick", `deleteHw(${params.id})`);
            quizTitle.innerHTML="Homework title";
            socket.emit('req-hw-data', params);
            deleteButton.innerHTML = 'Delete Homework';
            break;
    }
});

socket.on('user-detail',function(udetail){
    uName = udetail.local.username;
});

socket.on('course-detail', function(data){
    courseData = data;
    var tags = document.getElementById('browsers');
    for(i=0; i<data.tags.length; i++){
        var t = document.createElement('option');
        t.setAttribute('value', data.tags[i]);
        tags.appendChild(t);
    }
});

socket.on('gameData-edit', function (data) {
    document.getElementById("name").value = `${data.name}`;
    for (q in data.questions) {
        addQuestion();
        openTab("newQuestion", data.questions[String(q)].type, questionNum);
        addDataToQuestion(questionNum, data.questions[String(q)])
    }
});
function addInput(loc) {
    let inputField
    if (loc.id == "isEarly") {
        inputField = document.getElementById("earlyInput");
    } else if (loc.id == "isTopN") {
        inputField = document.getElementById("topNInput");
    } else if (loc.id == "isFast") {
        inputField = document.getElementById("fastInput");
    }
    if (loc.checked == true) {
        inputField.style.display = "block";
    } else {
        inputField.style.display = "none";
    }
}

function updateDatabase(reqtype, Id){
    var questions = [];
    var name = document.getElementById('name').value;
    if(name == "" || name == undefined){
        alert("Title must not be blank.");
        return;
    }
    for (let i = 1; i <= questionNum; i++) {
        if (document.getElementById('q' + i) == undefined) continue;
        var question = document.getElementById('q' + i).value;
        if(question == "" || question == undefined){
            alert(`At question${i} : Question must not be blank.`);
            return;
        }
        var qtag = document.getElementById(`tagbox${i}`);
        var messages = qtag.getElementsByClassName("tag-message");
        var tags = [];
        var baseScore = document.getElementById(`score${i}`).value;
        if(baseScore == ''){
            if(confirm(`At question${i} : If you don't insert score the score will be 0.`)){
                baseScore = 0;
            }else{
                return ;
            } 
        }else{
            parseInt(baseScore);
        }
        var answers = [];
        var qtype = document.getElementById('type' + i).innerText;
        var correct;
        // tags 
        for (k = 0; k < messages.length; k++) {
            tags.push(messages[k].innerText);
            if(!courseData.tags.includes(messages[k].innerText)){
                courseData.tags.push(messages[k].innerText);
            }
        }
        // answer & correct 
        switch (qtype) {
            case ("4c"):
                var answer1 = document.getElementById(i + 'a1').value;
                var answer2 = document.getElementById(i + 'a2').value;
                var answer3 = document.getElementById(i + 'a3').value;
                var answer4 = document.getElementById(i + 'a4').value;
                correct = radioCheck(i);
                answers = [answer1, answer2, answer3, answer4];
                if(answer1 == '' || answer2 == '' || answer3 == '' || answer4 == ''){
                    alert(`At question${i} : Every answer must not be blank.`);
                    return;
                } 
                break;
            case ("2c"):
                correct = radioCheck(i);
                answers = ['True', 'False'];
                break;
            case ("sa"):
                var x = 0;
                for (var j = 1; j <= countCorrect; j++) {
                    var correct_i_j = document.getElementById(j + 'correct' + i);
                    if(correct_i_j != undefined){
                        answers[x] = correct_i_j.value;
                        x++;
                    }
                }
                break;
        }
        if(correct == "not found" || answers[0] == ''){
            alert(`At question${i} : The question must have at least 1 correct answer.`);
            return;
        }
        questions.push({"question": question, "tag":tags, "type":qtype, "answers": answers, "correct": correct, "score": parseInt(baseScore)})
    }
    var data = { id: 0, "name": name, "questions": questions,"courseId": courseId,"creator": uName};
    socket.emit('update-course',courseData);
    
    if (reqtype == 'createHw') {
        let Deadline = document.getElementById("deadLine").value + ":00"
        let isEarlySub = document.getElementById("isEarly").checked
        let EarlyDate = document.getElementById("erlSubmitDate").value + ":00"
        let EarlyScore = parseInt(document.getElementById("erlScore").value)
        let isFast = document.getElementById("isFast").checked
        let FastMin = parseInt(document.getElementById("fastTime").value)
        let FastScore = parseInt(document.getElementById("fastScore").value)
        let isTopN = document.getElementById("isTopN").checked
        let NStudent = parseInt(document.getElementById("nStudent").value)
        let TopNScore = parseInt(document.getElementById("nScore").value)
        if(Deadline == ":00"){
            Deadline = new Date();
            Deadline.setDate(Deadline.getDate() + 7);
        }
        if(EarlyDate == ":00"){
            EarlyDate = new Date();
            EarlyDate.setDate(EarlyDate.getDate() + 7);
        }
        data = {
            id: 0, 
            "name": name, 
            "questions": questions, 
            "courseId": courseId,
            "creator": uName, 
            "deadline": new Date(Deadline), 
            "isEarlySub": isEarlySub,
            "earlyDate": new Date(EarlyDate), 
            "earlyScore": EarlyScore,
            "isFastSub": isFast, 
            "fastTime": FastMin, 
            "fastScore": FastScore, 
            "isTopN": isTopN,
            "nStudent": NStudent, 
            "topNScore": TopNScore,
        };
    }
    switch(reqtype){
        case('createQuiz'):
            data.roundPlayed = 0;
            socket.emit('newQuiz', data);
            break;
        case ('editQuiz'):
            data.id = Id;
            socket.emit('editQuiz', data);
            break;
        case ('createHw'):
            data.submittedStd = [];
            data.startDoingStd = [];
            socket.emit('newHw', data);
            break;
        case ('editHw'):
            data.id = Id;
            socket.emit('editHw', data);
            break;
    }
};
function addTagBox(questionNum, tagInput, tagNum) {
    if (tagInput.value == '') {
        alert("tag must not be blank");
        return;
    }
    if(!courseData.tags.includes(tagInput.value)){
        courseData.tags.push(tagInput.value);
        var browsers = document.getElementById('browsers');
        var opt = document.createElement('option');
        opt.setAttribute('value', tagInput.value);
        browsers.appendChild(opt);
    }
    var tagbox = document.getElementById(`tagbox${questionNum}`);
    var thistag = document.createElement("div");
    var delBut = document.createElement("button");
    var Message = document.createElement("div");

    Message.innerHTML = tagInput.value;
    Message.className += "tag-message";
    delBut.innerText = 'x';
    delBut.setAttribute("onclick", `document.getElementById('tag${questionNum}_${tagNum}').remove()`)
    thistag.className += ` tag${questionNum}`;
    thistag.className += " questionTag";
    thistag.appendChild(Message);
    thistag.appendChild(delBut);
    thistag.setAttribute('id', `tag${questionNum}_${tagNum}`)
    tagbox.appendChild(thistag);
    tagNum += 1;
    document.getElementsByClassName('addTagBut')[questionNum - 1].setAttribute('onclick', `addTagBox(${questionNum},document.getElementById('tagInput${questionNum}'), ${tagNum})`);
    tagInput.value = "";
    
}

function addQuestion() {
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
            
            
            <div class="questionBox">
                <div class="questionMain">
                    <label>Question : </label>
                    <input class = "question" id = "q${questionNum}" type = "text">
                    <br>
                    <br>
                    <div id="tabcontent${questionNum}">
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
                        <input id = "${questionNum}a4"  type = "text" autofocus/>
                    </div>
                </div>
                <div class="Line"></div>
                <div class="questionDetail">
                    <div id = "tagbox${questionNum}">
                    </div>
                    
                    <label>Tags :
                        <input list="browsers" name="myBrowser" id="tagInput${questionNum}"/>
                    </label>
                    <button class="addTagBut" onclick="addTagBox(${questionNum},document.getElementById('tagInput${questionNum}'), 0)">Add</button>
                    <br>
                    <br>
                    <label>Score : </label>
                    <input id="score${questionNum}" type="number" min='0' class="Answer"></input>    
                </div>
            </div>
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
    var found;
    for (var j = 0; j < 4; j++) {
        if (allRadio[j].checked == true) {
            found = true;
            return allRadio[j].value;
        }
    }
    if (!found) return "not found";
}

function addDataToQuestion(questionNum, data) {
    var tablinks = document.getElementsByClassName(`tablinks${questionNum}`);
    var tagInput = document.getElementById(`tagInput${questionNum}`);
    var scoreInput = document.getElementById(`score${questionNum}`);
    var tags = data.tag;
    document.getElementById(`q${questionNum}`).value = data.question;
    switch (data.type) {
        case ("4c"):
            quizType = "4 choices";
            document.getElementById(`${questionNum}a1`).value = data.answers[0];
            document.getElementById(`${questionNum}a2`).value = data.answers[1];
            document.getElementById(`${questionNum}a3`).value = data.answers[2];
            document.getElementById(`${questionNum}a4`).value = data.answers[3];
            break;
        case ("2c"):
            quizType = "true or false";
            break;
        case ("sa"):
            quizType = "Short Answer";
            for (i in data.answers) {
                document.getElementById(`${countCorrect}correct${questionNum}`).value = data.answers[i];
                if (i != data.answers.length - 1) addbuttonAns(questionNum);
            }
            break;
    }
    if (data.type == "4c" || data.type == "2c") {
        document.getElementById(`radio${data.correct}${questionNum}`).checked = true;
    }
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className.replace(" active", "");
        if (tablinks[i].innerHTML == quizType) {
            tablinks[i].className += " active";
        }
    }

    for (i = 0; i < tags.length; i++) {
        tagInput.value = tags[i];
        addTagBox(questionNum, tagInput, i);
    }
    tagInput.value = "";

    scoreInput.value = data.score;

}

function openTab(evt, quizType, id) {
    var evtTarget = evt.currentTarget;
    //unactive all tablinks

    if (evtTarget != undefined) {
        if (evtTarget.className == "active") {
            return;
        } else {
            tablinks = document.getElementsByClassName(`tablinks${id}`);
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            evtTarget.className += " active";
        }
    }
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
            <div id="allCorrect${questionNum}">
                <div id="countCorrect">
                    <input class = "correct" id = "${countCorrect}correct${questionNum}" type = "text" autofocus/>
                    <br>
                    <br>
                </div>
            </div>
            <button id="addbuttonAns${questionNum}" class="tablinks${questionNum}" onclick="addbuttonAns(${questionNum})">AddAnswer</button> 
            <br>`
    }
    targetQuestion.innerHTML = tabcontent;
}
function addbuttonAns(qNum) {
    countCorrect++;
    var newAns = document.createElement('div');
    newAns.innerHTML = `
    <input class = "correct" id = "${countCorrect}correct${qNum}" type = "text" autofocus/>
    <br>
    <br>
    `;
    document.getElementById(`allCorrect${qNum}`).appendChild(newAns);
}

function deleteQuiz(quizId) {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = `/courseInfo?courseId=${courseId}`;
        socket.emit('deleteQuiz', { "id": quizId });
    }
}

function deleteHw(Id) {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = `/courseInfo?courseId=${courseId}`;
        socket.emit('deleteHw', { "id": Id });
    }
}

//Called when user wants to exit quiz creator
function cancelQuiz() {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = `/courseInfo?courseId=${courseId}`;
    }
}

socket.on('backToHostPage', function (data) {
    window.location.href = `/courseInfo?courseId=` + courseId;
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