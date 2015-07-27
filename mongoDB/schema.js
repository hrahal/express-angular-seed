var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.model('cityCount', new Schema({
    city: String,
    count: Number
}));
