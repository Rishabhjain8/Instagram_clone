const mongoose = require('mongoose');
const {Schema} = mongoose;

const MessageSchema = new Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'chatroom'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    message: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;