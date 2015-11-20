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
        select: false
    },
    photoUrl: String,
    role: String,
    facebook: {
        id: String
    },
    favouriteDishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }],
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
