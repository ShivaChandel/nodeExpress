const mongoose = require('mongoose');
const schema = mongoose.Schema;

var articleSchema = schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});


var Article = module.exports = mongoose.model('Article', articleSchema);