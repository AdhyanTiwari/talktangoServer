const mongoose = require("mongoose");

const messageModel = mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    content: String,
    time: {
        type: Date, default: Date.now()
    }
},
    { timestamp: true, })

const Message = mongoose.model("Message", messageModel);
module.exports = Message;