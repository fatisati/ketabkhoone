const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookModel = new Schema({
  bookname: {type: String, required: true},
  author: {type: Schema.ObjectId, ref: 'Author', required: true},
  summary: {type: String, required: true},
  isbn: {type: String, required: true},
  genre: [{type: Schema.ObjectId, ref: 'Genre'}],
  due_back: {type: Date, default: Date.now},
  status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    })
module.exports = mongoose.model('Book', bookModel)