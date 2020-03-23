var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    info: {
        firstname: String,
        lastname: String,
        imageUrl: String,
    },
    local: {
        googleId: String,
        email: {
            type: String
        },
        password: {
            type: String
        }
    }
});

module.exports = mongoose.model('User', userSchema);