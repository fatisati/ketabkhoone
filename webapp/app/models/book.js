const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookModel = new Schema({
  bookname: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: 'Author'},
  summary: { type: String},
  // isbn: { type: String, required: true },
  // genre: [{ type: Schema.ObjectId, ref: 'Genre' }],
  genre: { type: String},
  due_back: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
  img: { data: Buffer, contentType: String },
})
module.exports = mongoose.model('Book', bookModel)