var socket =io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var questionNumber = 1; 
var udetail
var maxScore = 0
socket.on('connect', function() {
    document.getElementById('show-HW').innerHTML = ""
    socket.emit('get-user-detail');
    socket.emit('get-hw',params)
});
socket.on('user-detail',function(user){
    udetail = user;
});
socket.on('check-hw',function(hw){
    let flag = true
    for (sc in hw.questions){
        maxScore += hw.questions[sc].score
    }
    if (hw.startDoingStd.includes(udetail.local.studentID)){
        socket.emit('get-already-done-hw',params)
        flag = false
    }
    if(flag){
    
        document.getElementById('show-HW').innerHTML += `<button onclick="DoHW()"> START </button> `
    }
})
socket.on('already-done-hw',function(doneHw){
    document.getElementById('show-HW').innerHTML += `
    <div style = 'text-align: center'>
    <br>
        <label><h2>Score:${doneHw.totalScore}/${maxScore}</h2></label>
        <label><h2>Extra Score:${doneHw.extraScore}</h2></label>
    </div>
    <div style = 'text-align: center'><button type="button" onclick="backtoCourseinfo()">Back to course</button></div>
    `
})
function backtoCourseinfo(){
    window.location.href='/courseInfoStu?courseId='+params.courseId
}
function DoHW(){
    document.getElementById('show-HW').innerHTML = "";
    document.getElementById('show-HW').innerHTML = `<input type="text" name="hwid" value="${params.id}" style="display:none">`;
    document.getElementById('show-HW').innerHTML += `<input type="text" name="courseid" value="${params.courseId}" style="display:none">`;
    socket.emit('ShowHW',params,udetail);
};

socket.on('DoHW', function (data) {
    var ansCount = 0;  
    var tMin = 0;
    var tSec = 0; 
    var tTextMin = "00";
    var tTextSec = "00";
    var dateTime = new Date()
    document.getElementById('Timer').style.display = "block"
    document.getElementById('startDatetime').value = dateTime
    timer = setInterval(function () {
        if(tSec == 59){
            tSec = 0;
            tMin += 1;
        }else{
            tSec += 1;
        }
        if(tMin < 10){
            tTextMin = "0" + tMin.toString();
        }else{
            tTextMin = tMin.toString();
        }
        if(tSec < 10){
            tTextSec = "0" + tSec.toString();
        }else{
            tTextSec = tSec.toString();
        }
        document.getElementById('sentTime').value = tMin
        document.getElementById('timeValue').textContent = tTextMin +":"+tTextSec;
    }, 1000);

    while(data.questions[questionNumber-1]!=undefined){
        switch(data.questions[questionNumber-1].type){
            case "4c" : document.getElementById('show-HW').innerHTML += `
                        <div class="card-holder">
                            <div class="card bg-gold" id="question${questionNumber}" style="text-align:left;">
                                <label class="choiceHead">${questionNumber}. ${data.questions[questionNumber-1].question} </label>
                                <label class="choice"> ${data.questions[questionNumber-1].answers[0]}
                                    <input type="radio" name="ans${ansCount}" value = 1 required>
                                    <span class="checkmark"></span>
                                </label>
                                <label class="choice"> ${data.questions[questionNumber-1].answers[1]}
                                    <input type="radio" name="ans${ansCount}" value = 2>
                                    <span class="checkmark"></span>
                                </label>
                                <label class="choice">${data.questions[questionNumber-1].answers[2]}
                                    <input type="radio" name="ans${ansCount}" value = 3>
                                    <span class="checkmark"></span>
                                </label>
                                <label class="choice">${data.questions[questionNumber-1].answers[3]}
                                    <input type="radio" name="ans${ansCount}" value = 4 >
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>;`;
                        break;
            case "2c" : document.getElementById('show-HW').innerHTML += `
                        <div class="card-holder">    
                            <div class="card bg-gold" id="question${questionNumber}" style="text-align:left;">
                                <label class="choiceHead">${questionNumber}. ${data.questions[questionNumber-1].question} </label>
                                    <label class="choice">True
                                        <input type="radio" name="ans${ansCount}" value = 1 required>
                                            <span class="checkmark"></span>
                                    </label>
                                    <label class="choice">False
                                        <input type="radio" name="ans${ansCount}" value = 2 >
                                            <span class="checkmark"></span>
                                    </label>
                                </label>
                            </div>
                        </div>`;
                        break;
            case "sa" : document.getElementById('show-HW').innerHTML += `
                        <div class="card-holder">
                            <div class="card bg-gold" id="question${questionNumber}" style="text-align:left;">
                                <label class="choiceHead">${questionNumber}. ${data.questions[questionNumber-1].question} </label>
                                <label class = "fText">Answer : 
                                    <input type="text"  name="ans${ansCount}" placeholder = "Answer Here" required>
                                </label>
                            </div>
                        </div>`  
                        break;
        }
        ansCount++;  
        questionNumber++;
        
    }
    
    document.getElementById('show-HW').innerHTML +=`<button type="submit" style ="background-color:#18E218;">Submit</button>`
});