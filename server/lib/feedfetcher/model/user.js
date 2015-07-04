/**
 * Created by michaelfisher on 6/18/15.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        set: function (value) {
            return value.trim().toLowerCase();
        },
        validate: [
            function (email) {
                return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null),
                    'Invalid email';
            }
        ]
    },
    password: String,
    admin: {
        type: Boolean,
        default: false
    },
    savedItems: [{type: Schema.Types.ObjectId, ref: 'SavedItem'}]
});

/**
 * Hashes the password before saving to database
 */
userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});
/**
 * Compare to hashed password.
 * @param password
 * @returns {*}
 */
userSchema.methods.comparePassword = function (password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

/**
 * List all Users
 */
userSchema.static({
    list: function (callback) {
        this.find({}).sort('-_id').select('email').exec(callback);
    }
});

module.exports = mongoose.model('User', userSchema);