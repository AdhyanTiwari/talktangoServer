const express = require("express");
const { allMessageController, sendMessageController } = require("../controllers/messageController");
const fetchUser = require("../middleware/fetchuser");
const Router = express.Router();

Router.post("/allMessage", fetchUser, allMessageController);
Router.post("/sendMessage", fetchUser, sendMessageController);

module.exports = Router;