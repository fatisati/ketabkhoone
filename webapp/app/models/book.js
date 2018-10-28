const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookModel = new Schema({
  bookname: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: 'Author'},
  summary: { type: String},
  genre: { type: String},img: { data: Buffer, contentType: String },
  score :{type : Number , default : 0.0},
  comment :{type: [String]},
  borrowNum : { type: Number, default : 0},
})
module.exports = mongoose.model('Book', bookModel)