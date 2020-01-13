const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    test: {
        type: String,
        required: true,
        unique: true
    }
});

testSchema.pre('save', function(next) {
    this.test = this.test.toLowerCase()
    next();
});

module.exports = mongoose.model('Test', testSchema);
