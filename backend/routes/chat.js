const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const ChatRoom = require('../Models/Chatroom');
const User = require('../Models/User');

router.post('/chat', fetchuser, async (req, res) => {
    try{
        const {name} = req.body;
        const nameRegex = /^[A-Za-z\s]+$/;

        if(!nameRegex.test(name)) return res.status(400).send("Chat room can contain only alphabets");
        const chatRoomExist = await ChatRoom.findOne({name});
        if(chatRoomExist) return res.status(400).send("Chatroom with that name already exists");

        if(!name) return res.status(400).send("Name is required");

        const chatRoom = await ChatRoom.create({name});

        res.json(chatRoom);
    }
    catch(err){
        console.log(err.msg);
        res.status(500).send("Some error occured");
    } 
})

module.exports = router;