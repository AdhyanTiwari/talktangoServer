const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const asyncExpressHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

const allMessageController = asyncExpressHandler(async (req, res) => {
    const { chatId } = req.body;
    if (!chatId) {
        res.json({ status: false, error: "chat dose not exist" })
    }
    const allMessage = await Message.find({ chat: chatId })
        .populate("sender", "name email")
        .populate("reciever", "name email");
    allMessage.reverse();
    res.json({ allMessage, user: req.user });
});

const sendMessageController = asyncExpressHandler(async (req, res) => {
    const { chatId, content } = req.body;
    if (!content || !chatId) {
        res.json({ status: false, error: "chatId or content not available" });
    }
    else {
        const data = {
            sender: req.user,
            chat: chatId,
            content: content,
            time: Date.now()
        }
        var newMessage = await Message.create(data);
        const update = await Chat.updateOne({ _id: chatId }, { latestMessage: newMessage, updatedAt: Date.now() });
        newMessage = await Chat.populate(newMessage, {
            path: "chat",
        });
        newMessage = await User.populate(newMessage, {
            path: "chat.users",
            select: "-password"
        });


        res.json(newMessage);

    }

})

module.exports = { allMessageController, sendMessageController }