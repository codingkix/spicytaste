var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);
