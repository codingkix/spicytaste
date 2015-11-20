var mongoose = require('mongoose');

var InstructionSchema = mongoose.Schema({
    text: String,
    photo: String,
    tips: String
});

module.exports = mongoose.model('Instruction', InstructionSchema);
