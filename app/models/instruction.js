var mongoose = require('mongoose');

var InstructionSchema = mongoose.Schema({
    text: String,
    photo: String
});

module.exports = mongoose.model('Instruction', InstructionSchema);
