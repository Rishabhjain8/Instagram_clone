const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Post = require('../Models/Post');
const User = require('../Models/User');

router.post('/user/:id', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // console.log(mongoose.Types.ObjectId(req.body.userId))
        const user = await User.findById(req.params.id).select("-password");
        const allPosts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name username email");
        res.json({ user, allPosts });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/follow', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // User.findByIdAndUpdate(req.body.userId, {
    //     $push: { followers: req.user.id }
    // }, {
    //     new: true
    // }, (err, newUser) => {
    //     if (err) {
    //         return res.status(422).json({ error: err })
    //     }
    //     User.findByIdAndUpdate(req.user.id, {
    //         $push: { following: req.body.userId }

    //     }, { new: true }).select("-password").then(user => {
    //         res.json({user, newUser})
    //     }).catch(err => {
    //         return res.status(422).json({ error: err })
    //     })

    // }
    // )
    try {
        let newUser = await User.findByIdAndUpdate(req.body.userId, {

            $push: { followers: req.user.id }
        }, {
            $new: true
        }).select("-password")

        let user = await User.findByIdAndUpdate(req.user.id, {
            // $set : {...prevData, following: prevData.following.push(req.body.userId)}
            $push: { following: req.body.userId }
        }, {
            $new: true
        }).select("-password");

        newUser = await User.findById(req.body.userId).select("-password");
        user = await User.findById(req.user.id).select("-password");

        res.json({ user, newUser });
        // res.json(user);

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/unfollow', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // User.findByIdAndUpdate(req.body.userId,{
    //     $pull:{followers:req.user.id}
    // },{
    //     new:true
    // },(err,newUser)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }
    //   User.findByIdAndUpdate(req.user.id,{
    //       $pull:{following:req.body.userId}
          
    //   },{new:true}).select("-password").then(user=>{
    //       res.json({user, newUser})
    //   }).catch(err=>{
    //       return res.status(422).json({error:err})
    //   })

    // }
    // )
    try {

        let newUser = await User.findByIdAndUpdate(req.body.userId, {
            $pull: { followers: req.user.id }
        }, {
            $new: true
        }).select("-password")

        let user = await User.findByIdAndUpdate(req.user.id, {
            $pull: { following: req.body.userId }
        }, {
            $new: true
        }).select("-password")

        // newUser = await User.findById(req.body.userId).select("-password");
        // user = await User.findById(req.user.id).select("-password");

        if(user && newUser) res.json({ user, newUser });
        // res.json(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.put('/update', fetchuser, [
    body('email', 'Enter a valid email').isEmail(),
    body('name','Enter a valid name of length 3 or greater than 3').isLength({min: 3}),
    body('username','Enter a valid username of length 3 or greater than 3').isLength({min: 3})
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            // const {name, username, email} = req.body;
            const newUser = {...req.body, image: req.body.image};
            const user = await User.findByIdAndUpdate(req.user.id, {$set: newUser}, {new:true}).select("-password");
            res.json(user);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
)

router.delete('/delete', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const user = await User.findByIdAndDelete(req.user.id);
        res.json(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/alluser', async (req, res) => {
    try{
        const users = await User.find();
        res.json({users});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/allfollow/:id', fetchuser, async(req, res) => {
    try{
        const followDetails = await User.findById(req.params.id).populate("followers following", "_id name image");
        res.json(followDetails);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/likes/:id', async(req, res) => {
    try{
        const likeDetails = await Post.findById(req.params.id).populate("likes", "_id name image");
        res.json(likeDetails);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;