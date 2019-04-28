const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const borrowModel = new Schema({    
    borrower: {type : Schema.ObjectId, ref: 'User'},
    lender : {type : Schema.ObjectId, ref: 'User'},
    startDate :  {type : Date},
    finishDate : {type : Date},
    penalty : {type : Number, default :0},
    holdover : {type : Boolean},
    
})
module.exports = mongoose.model('Borrow', borrowModel)