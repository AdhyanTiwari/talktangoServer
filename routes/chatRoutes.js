const express = require("express");
const { accessChatController,
    fetchChatController,
    createGroupController,
    fetchGroupController,
    groupExitController,
    addSelfGroupController } = require("../controllers/chatController");
const fetchUser = require("../middleware/fetchuser");
const Router = express.Router();

Router.post("/accessChat", fetchUser, accessChatController);
Router.get("/fetchChat", fetchUser, fetchChatController);
Router.post("/createGroup", fetchUser, createGroupController);
Router.get("/fetchGroup", fetchUser, fetchGroupController);
Router.post("/groupExit", fetchUser, groupExitController);
Router.post("/addSelfGroup", fetchUser, addSelfGroupController);

module.exports = Router;