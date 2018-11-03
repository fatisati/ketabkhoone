const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema({    
    username: { type: String  },
    pass : { type: String  },
    name : { type: String  },
    fname : { type: String  },
    books :[{ type : Schema.ObjectId, ref: 'BookInstance' }]
})

module.exports = mongoose.model('User', userModel)