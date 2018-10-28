const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookInstanceModel = new Schema({
  book : {type: Schema.ObjectId, ref: 'Book'},
//   bookname: { type: String, required: true },
//   author: { type: Schema.ObjectId, ref: 'Author'},
  summary: { type: String},
  beautiful_part:{type: [String]},
  publication:{type: String},
  // isbn: { type: String },
//   genre: { type: String},
  // due_back: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
  img: { data: Buffer, contentType: String },
  // user :{type: Schema.ObjectId, ref: 'User'},
  qualityscore :{type : Number , default : 0.0},
//   comment :{type: [String]},
  owner_comment : { type: String},
  yearOfPublish: { type: Number},
  numPages : { type: Number},
//   borrowNum : { type: Number, default : 0},
})
module.exports = mongoose.model('BookInstance', bookInstanceModel)