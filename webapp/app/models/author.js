var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    // date_of_birth: {type: Date},
    // date_of_death: {type: Date},
  }
);


//Export model
module.exports = mongoose.model('Author', AuthorSchema);