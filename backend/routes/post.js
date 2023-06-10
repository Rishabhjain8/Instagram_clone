const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Post = require('../Models/Post');
const User = require('../Models/User');

router.post('/addpost', fetchuser, [
    body('body', 'Enter a valid body of length greater than or equal to 3').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let { body, image } = req.body;
        let user = await User.findById(req.user.id).select("-password");
        const post = await Post.create({
            body, image,
            postedBy: user
        })

        res.json({ success: true, post });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Some error occured");
    }
})

router.get('/allpost', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const allPost = await Post.find().populate('postedBy', "name _id email username image followers following").populate('comments.postedBy', "name _id email username  image followers following").sort("-createdAt");
        res.json(allPost);
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.post('/mypost', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const myPost = await Post.find({ postedBy: req.user.id }).populate('postedBy', "name _id email username image followers following").populate("comments.postedBy", "name _id image followers following").sort("-createdAt");
        // myPost.map(post => {
        //     console.log(post);
        //     return post["postedBy"]["_id"] === req.user.id
        // })

        res.json(myPost);
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.put('/like', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user.id }

        }, {
            new: true
        })
            .populate('postedBy', "name _id email username image followers following")
        res.json(post);
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.put('/unlike', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user.id }

        }, {
            new: true
        })
            .populate('postedBy', "name _id email username image followers following")
        res.json(post);
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.post('/comment', fetchuser, [
    body('text', 'Enter a valid comment of length greater than or equal to 3').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.user.id
        }
        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }

        }, {
            new: true
        })
            .populate("comments.postedBy", "name _id image followers following")
            .populate("postedBy", "_id name image followers following")
        res.json(post)
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.post('/deletecomment/:id', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        Post.findById(req.body.postId).populate('postedBy', "name _id").populate('comments.postedBy', "name _id").then(post => {
            post.comments.filter((comment, index) => {
                if(comment._id.toString() === req.params.id.toString() ){
                    if (req.user.id.toString() === comment.postedBy._id.toString()) {
                        post.comments.splice(index, 1);
                    }
                    else{
                        return comment;
                    }
                }
            })
            post.save();
            res.json(post)
        })

        // let post = await Post.findById(req.body.postId).populate("postedBy", "_id name").populate("comments.postedBy", "_id name");
        // const comment = await post.comments.find(comment => comment._id.toString() === req.params.id.toString());
        //     if(comment.postedBy._id.toString() === req.user.id.toString()){
        //         const removeIndex = await post.comments.map(comment => comment.postedBy._id.toString()).indexOf(req.user.id);
        //         console.log(removeIndex)
        //         await post.comments.splice(removeIndex, 1);
        //         await post.save()
        //         .then(result => {
        //             console.log(result);
        //             res.json(result);
        //         })
        //         .catch(err => console.log(err)); 
        //     }

    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.post('/delete', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let success = false;
        const postDet = await Post.findById(req.body.postId);

        // console.log(postDet['postedBy'].toString() === req.user.id.toString());
        // console.log(postDet[postedBy].toString() === req.user.id.toString())
        if (postDet['postedBy'].toString() === req.user.id.toString()) {
            const post = await Post.findByIdAndDelete(req.body.postId);
            success = true;
        }

        res.json(success);

    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.post('/followingpost', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // const user = await User.findById(req.user.id);
        // const following = user.following;
        // const allPost = following.map(async (follower) => {
        //     return await Post.findById(follower).populate('postedBy', "name _id email username").populate("comments.postedBy", "name _id");
        // })

        // res.json(allPost);

        //if posted in following
        const allPost = await Post.find({ postedBy: { $in: req.user.following } }).populate('postedBy', "name _id email username image followers following").populate('comments.postedBy', "name _id email username image followers following").sort("-createdAt");
        res.json(allPost);
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.put('/update/:id', fetchuser, [
    body('body', 'Enter a valid body of length greater than or equal to 3').isLength({ min: 3 })
],async (req, res) => {
    try{
        const postDet = req.body;
        let post = await Post.findById(req.params.id);
        console.log(post)
        console.log(post.postedBy.toString() ,req.user.id.toString())
        if(post.postedBy.toString() === req.user.id.toString()){
            post = await Post.findByIdAndUpdate(req.params.id, {$set: postDet}, {new: true}).populate('postedBy', "name _id email username image followers following").populate('comments.postedBy', "name _id email username image followers following");
            res.json(post);
        }
        else{
            return res.status(401).send("Unauthorized access");
        }
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

module.exports = router;