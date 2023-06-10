const bodyParser = require("body-parser");
const express = require("express");
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require('path');
const connectToMongo = require('./db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

require('dotenv').config();

const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
connectToMongo();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/post', require('./routes/post'));
app.use('/api', require('./routes/user'));
app.use('/chatroom', require('./routes/chat'));

const server = app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
})

const io = require("socket.io")(server);

io.use(async (socket, next) => {
    const token = socket.handshake.query.token;
    try{
        const data = jwt.verify(token, JWT_SECRET);
        socket.userId = data.user.id;
        next();
    }
    catch (error) {}
})

io.on('connection', (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on('disconnect', () => {
        console.log("Disconnected: " + socket.userId)
    })
})