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
    prepTime: String,
    totalTime: String,
    difficulty: String,
    photos: [],
    tags: [],
    blog: String,
    ingredients: [],
    instructions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instruction'
    }],
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
