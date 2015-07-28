var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('cityCount', new Schema({
    city: String,
    count: Number
}));
