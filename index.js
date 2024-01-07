const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");
const cors = require("cors")//used to prevent the cors error 
const { default: mongoose } = require("mongoose");
const { Socket } = require("socket.io");
dotenv.config()
const MONGO_URI = "mongodb+srv://Adhyan:MoxxVG0nmDL8583F@livechatdb.j0ct4ro.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(MONGO_URI)
const app = express();
app.use(express.json());
app.use(cors())

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

const server = app.listen(process.env.PORT, console.log("The server is running"));

const io = require("socket.io")(server, {
    cors: { origin: "*" },
    pingTimeout: 60000,
})

io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);
    socket.on("setup", (userData) => {
        console.log("userData recieved:", userData)
        socket.join(userData);
        socket.emit("connection")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room:", room);
    })

    socket.on("new message", (newMessageData) => {
        console.log("new message ", newMessageData)
        var chat = newMessageData.chat;
        if (!chat) {
            return console.log("chat.users not defined");
        }
        chat.users.forEach(user => {
            socket.in(user._id).emit("message recieved", newMessageData)
        });
    })

})