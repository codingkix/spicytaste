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
    prepTime: Number,
    totalTime: Number,
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

DishSchema.virtual('cookTime').get(function() {
    'use strict';

    return this.totalTime - this.prepTime;
});

DishSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

module.exports = mongoose.model('Dish', DishSchema);
