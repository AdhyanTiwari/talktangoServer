const express = require("express");
const { registerController,loginController,getUsersController } = require("../controllers/userController");
const fetchUser = require("../middleware/fetchuser");
const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register", registerController)
Router.get("/get-users",fetchUser,getUsersController)

module.exports = Router;