var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test',{ useMongoClient: true });
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    id: {
      type: Number,
    },
    nickname: {
      type: String,
      required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    dateTime: {
        type: String
    }
});
module.exports = mongoose.model('Comment',commentSchema);
