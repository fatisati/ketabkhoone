const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookInstanceModel = new Schema({
  book : {type: Schema.ObjectId, ref: 'Book'},
  summary: { type: String},
  beautiful_part:{type: [String]},
  publication:{type: String},
  status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
  img: { data: Buffer, contentType: String },
  qualityscore :{type : Number , default : 0.0},
  owner_comment : { type: String},
  yearOfPublish: { type: Number},
  numPages : { type: Number},
})
module.exports = mongoose.model('BookInstance', bookInstanceModel)