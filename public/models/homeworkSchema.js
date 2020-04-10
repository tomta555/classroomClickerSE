var mongoose = require('mongoose');

var hwSchema = mongoose.Schema({
    hwid:Number,
    courseId:Number,
    stdId:String,
    // round:Number,
    answer:[String],
    score:[Number],
    earlyScore:Number,
    fastScore:Number,
    topNScore:Number,
    extraScore:Number,
    totalScore:Number,
    startDatetime:Date,
    submittedDatetime:Date,
    isLate:Boolean,
    },{collection:'submittedHomework'});


module.exports = mongoose.model('homeworkModel', hwSchema);