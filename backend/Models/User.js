const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/pinstagramcn/image/upload/v1680347631/no-image_iyomqa.jpg"
    },
    resetToken: String,
    expireDate: Date,
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', UserSchema);
module.exports = User;