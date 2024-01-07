const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const asyncExpressHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");


const accessChatController = asyncExpressHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).send("error! no userId")
    }
    var allChat = await Chat.findOne({
        isGroupChat: false,
        $and: [{ users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user } } }]
    }).populate("users", "-password")
        .populate("latestMessage");
    if (allChat) {
        res.json(allChat);
    }
    else {
        const data = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user, userId]
        }
        const newChat = await Chat.create(data);
        newChat = await Chat.populate(newChat, {
            path: "users",
            select: "-passwords"
        })
        res.json(newChat);
    }
})

const fetchChatController = asyncExpressHandler(async (req, res) => {
    const myUser = req.user;
    var myChat = await Chat.find({ users: { $elemMatch: { $eq: myUser } } })
        .sort({ updatedAt: -1 })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin");
    res.json({ myChat, myUser });

})

const createGroupController = asyncExpressHandler(async (req, res) => {
    const { groupName } = req.body
    var newGroup = await Chat.findOne({ chatName: { $eq: groupName } });
    if (newGroup) {
        res.json({ status: false, error: "Group name already exists" });
    }
    else {
        const data = {
            chatName: groupName,
            isGroupChat: true,
            users: ["6595b85778c1932b48921917", "6596bf27b2740f1f7b9dc010", "6596c032b2740f1f7b9dc01f", "6596c032b2740f1f7b9dc01f", "6596b32ff614c832e2ae0b54"],
            groupAdmin: req.user
        }
        newGroup = await Chat.create(data);
        newGroup = await User.populate(newGroup, {
            path: "users",
            select: "-password"
        })
        newGroup = await User.populate(newGroup, {
            path: "groupAdmin",
            select: "-password"
        })
        res.json({ status: true, newGroup });
    }
})

const fetchGroupController = asyncExpressHandler(async (req, res) => {
    const allGroups = await Chat.find({ isGroupChat: true }, "chatName");
    allGroups.reverse();
    res.json(allGroups);
})

const groupExitController = asyncExpressHandler(async (req, res) => {
    const { chatId } = req.body;
    if (!chatId) {
        res.json({ status: false, error: "the chat does not exist" })
    }
    var removedChat = await Chat.findOne({ $and: [{ _id: chatId }, { users: { $elemMatch: { $eq: req.user } } }] });
    if (removedChat) {
        removedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: new mongoose.Types.ObjectId(req.user) } },
            { new: true }
        );
        res.json({ status: true });
    }
    else {
        res.json({ status: false, error: "user is not a part of the group" })
    }
})

const addSelfGroupController = asyncExpressHandler(async (req, res) => {
    const { chatId } = req.body;
    if (!chatId) {
        res.json({ status: false, error: "the chat does not exist" })
    }
    var AddedChat = await Chat.findOne({ $and: [{ _id: chatId }, { users: { $elemMatch: { $eq: req.user } } }] });
    if (AddedChat) {
        res.json({ status: false, error: "user is already a part of the group" })
    }
    else {
        AddedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: new mongoose.Types.ObjectId(req.user) } },
            { new: true }
        );
        res.json({ status: true });
    }
})



module.exports = { accessChatController, fetchChatController, createGroupController, fetchGroupController, groupExitController, addSelfGroupController }