var mongoose = require('mongoose');

var hwSchema = mongoose.Schema({
    hwid:Number,
    stdId:String,
    // round:Number,
    answer:[String],
    score:[Number],
    totalScore:Number
    },{collection:'submittedHomework'});


module.exports = mongoose.model('homeworkModel', hwSchema);