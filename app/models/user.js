var mongoose = require('mongoose');

// user schema
var UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    linkedSocial: [],
    photoUrl: String,
    favouriteDishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }],
    role: String,
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
