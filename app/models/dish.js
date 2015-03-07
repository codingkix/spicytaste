var mongoose = require('mongoose');

// dish schema
var DishSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: [],
    tags: [],
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Dish', DishSchema);
