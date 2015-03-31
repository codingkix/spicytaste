var mongoose = require('mongoose');

// dish schema
var DishSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String
    },
    photos: [],
    tags: [],
    blog: String,
    ingredients: [],
    instructions: [],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Dish', DishSchema);
