const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const ChatRoom = mongoose.model('chatroom', ChatRoomSchema);
module.exports = ChatRoom;