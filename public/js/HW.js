var socket =io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var questionNumber = 1; 
var udetail
var maxScore = 0
socket.on('connect', function() {
    document.getElementById('show-HW').innerHTML = ""
    socket.emit('get-user-detail');
    socket.emit('get-hw',params)

    //HW done -> emit -> Show-hw-score -> paste score
    //HW not done -> paste start button
    //
    // document.getElementById('show-HW').innerHTML = "";
    // socket.emit('ShowHW',params);    
});
socket.on('user-detail',function(user){
    udetail = user;
});
socket.on('check-hw',function(hw){
    let flag = true
    for (sc in hw.questions){
        maxScore += hw.questions[sc].score
    }
    for(let i=0 ; i < hw.submittedStd.length;i++){
        if (udetail.local.studentID == hw.submittedStd[i]){
            socket.emit('get-already-done-hw',params)
            flag = false
            break;
        }
    }
    if(flag){
        document.getElementById('show-HW').innerHTML += `<button onclick="DoHW()"> START </button> `
    }
})
socket.on('already-done-hw',function(doneHw){
    document.getElementById('show-HW').innerHTML += `<div><label>Score:${doneHw.totalScore}/${maxScore}</label></div>
    <div><button type="button" onclick="backtoCourseinfo()">Back to course</button></div>
    `
})
function backtoCourseinfo(){
    window.location.href='/courseInfoStu?courseId='+params.courseId
}
function DoHW(){
    document.getElementById('show-HW').innerHTML = "";
    document.getElementById('show-HW').innerHTML = `<input type="text" name="hwid" value="${params.id}" style="display:none">`;
    document.getElementById('show-HW').innerHTML += `<input type="text" name="courseid" value="${params.courseId}" style="display:none">`;
    socket.emit('ShowHW',params);
};

socket.on('DoHW', function (data) {
    // console.log(data.questions[0]);
    var ansCount = 0;  
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
    
    document.getElementById('show-HW').innerHTML +=`<button type="submit">Submit</button>`
});