var mongoose = require('mongoose');

// theme schema
var ThemeSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    slogan: String,
    thumbnail: String,
    image: String,
    description: String,
    components: [{
        title: String,
        displayOrder: Number,
        description: String,
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    }],
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Theme', ThemeSchema);
