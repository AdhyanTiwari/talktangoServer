const User = require("../models/userModel");
const asyncExpressHandler = require("express-async-handler");
const bcrypt = require("bcrypt")//used for encryption using hashing and salting
const generateToken = require("../config/generateToken");


const registerController = asyncExpressHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //all fields not given
    if (!name || !email || !password) {
        res.send(400);
        throw Error("All required information not filled");
    }

    //Email already registered
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.json({ status: false, error: "User already exists" })
        throw Error("User already exists")
    }

    // username already taken
    const userNameExist = await User.findOne({ name });
    if (userNameExist) {
        res.json({ status: false, error: "User name taken" })
        throw Error("User name taken");
    }

    // creating an entry in the database
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email, password: hash })

    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token: generateToken(newUser._id),
            status: true
        });
    }
    else {
        res.status(400).send("Registration error!");
    }
})

const loginController = asyncExpressHandler(async (req, res) => {
    const { email, password } = req.body;
    const myUser = await User.findOne({ email });
    if (myUser && (await bcrypt.compare(password, myUser.password))) {
        res.status(200).json(
            {
                _id: myUser._id,
                name: myUser.name,
                email: myUser.email,
                isAdmin: myUser.isAdmin,
                token: generateToken(myUser._id),
                status: true
            }
        )
    }
    else {
        res.json({ status: false, error: "wrong credentials" });
        throw Error("Wrong credentials");
    }
})

const getUsersController = asyncExpressHandler(async (req, res) => {
    const allUsers = await User.find({}, "name email").find({ _id: { $ne: req.user } });
    allUsers.reverse();
    res.send({ allUsers, user: req.user });
})

module.exports = { registerController, loginController, getUsersController }