var mongoose = require('mongoose');

// user schema
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: String,
    linkedSocial: [],
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
