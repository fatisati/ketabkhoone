const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const borrowModel = new Schema({    
    borrower: {type : String},
    lender : {type : String},
    startDate :  {type : Number},
    finishDate : {type : Number},
    penalty : {type : Number, default :0},
    holdover : {type : Boolean},
    
})
module.exports = mongoose.model('Borrow', borrowModel)