var socket =io();
var params = jQuery.deparam(window.location.search); //Gets the id from url
var questionNumber = 1; 

socket.on('connect', function() {
    
    // document.getElementById('show-HW').innerHTML = "";
    // socket.emit('ShowHW',params);    
});

function DoHW(){
    document.getElementById('show-HW').innerHTML = "";
    socket.emit('ShowHW',params);
};

socket.on('DoHW', function (data) {
    // console.log(data.questions[0]);
    while(data.questions[questionNumber-1]!=undefined){
        switch(data.questions[questionNumber-1].type){
            case "4c" : document.getElementById('show-HW').innerHTML += `
                        <div class="card-holder">
                            <div class="card bg-gold" id="question${questionNumber} style="text-align:left;">
                                <label class="choiseHead">${questionNumber}. ${data.questions[questionNumber-1].question} </label>
                                <label class="choise"> ${data.questions[questionNumber-1].answers[0]}
                                    <input type="radio" checked="checked" name="radio">
                                    <span class="checkmark"></span>
                                </label>
                                <label class="choise"> ${data.questions[questionNumber-1].answers[1]}
                                    <input type="radio" name="radio">
                                    <span class="checkmark"></span>
                                </label>
                                <label class="choise">${data.questions[questionNumber-1].answers[2]}
                                    <input type="radio" name="radio">
                                    <span class="checkmark"></span>
                                </label>
                                <label class="choise">${data.questions[questionNumber-1].answers[3]}
                                    <input type="radio" name="radio">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>;`;
                        break;
            case "2c" : document.getElementById('show-HW').innerHTML += `
                        <div class="card-holder">    
                            <div class="card bg-gold" id="question${questionNumber} style="text-align:left;">
                                <label class="choiseHead">${questionNumber}. ${data.questions[questionNumber-1].question} </label>
                                    <label class="choise">True
                                        <input type="radio" checked="checked" name="radio">
                                            <span class="checkmark"></span>
                                    </label>
                                    <label class="choise">False
                                        <input type="radio" name="radio">
                                            <span class="checkmark"></span>
                                    </label>
                                </label>
                            </div>
                        </div>`;
                        break;
            case "sa" : document.getElementById('show-HW').innerHTML += `
                        <div class="card-holder">
                            <div class="card bg-gold" id="question${questionNumber} style="text-align:left;">
                                <label class="choiseHead">${questionNumber}. ${data.questions[questionNumber-1].question} </label>
                                <label class = "fText">Answer : 
                                    <input type="text"  name="text">
                                </label>
                            </div>
                        </div>`    
                        break;
        }
        questionNumber++;
    }
    

});