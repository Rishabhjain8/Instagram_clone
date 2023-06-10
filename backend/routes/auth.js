const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const { urlencoded } = require('express');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name of length 3 or greater than 3').isLength({ min: 3 }),
    body('username', 'Enter a valid username of length 3 or greater than 3').isLength({ min: 3 }),
    body('password', 'Enter a strong password of minimum 4 length').isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let success = false;
        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt);

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" });
        }

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: secPass,
            image: req.body.image
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.cookie('jwt', authToken);
        res.json({ success, authToken, user });
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
}
)

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let success = false;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Please try to login with correct credentials' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        user = await User.findOne({ email }).select("-password");
        res.cookie('jwt', authToken);
        res.json({ success, authToken, user });
    }
    catch (err) {
        console.log(err.msg);
        res.status(500).send("Some error occured");
    }
})

router.post('/getuser', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = req.user.id;
        let user = await User.findById(id).select("-password");

        let suser = await User.findOne(req.user.email).select("_password");
        // res.json({suser: suser._id ,user :user._id})
        // res.json(suser._id.toString() === user._id.toString());
        if (suser._id.toString() !== user._id.toString()) {
            res.json({ msg: "Please! Login with your credentails" });
        }
        else {
            res.json(user);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/reset-password', [
    body('email', 'Enter a valid email').isEmail()
], async (req, res) => {
    try {
        const { email } = req.body;

        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
            }

            const token = buffer.toString('hex'); // because token we get will be in the hexadecimal form
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return res.json({message: 'Please! try to sign up first', success: false});
                    }
                    user.resetToken = token;
                    user.expireDate = Date.now() + 3600000;   //ms(milliseconds)
                    user.save().then(async (result) => {
                        // let testAccount = await nodemailer.createTestAccount(); only needed when we don;t want to send uing our gmail

                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            // host: "smtp.ethereal.email",
                            host: 'smtp.gmail.com',
                            service: 'gmail',
                            port: 465,
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: process.env.ACCOUNT, // generated ethereal user
                                pass: process.env.PASSWORD, // generated ethereal password
                            },
                        });

                        // send mail with defined transport object
                        let info = await transporter.sendMail({
                            from: `'Pinstagram' <${process.env.ACCOUNT}>`, // sender address
                            to: user.email, // list of receivers
                            subject: "Reset Password", // Subject line
                            html: `Hello <b>${user.name}</b> <br/> <p>You can Reset your password ${`<a href = http://localhost:3000/reset/${token}>here</a>`}</p>`// html body
                        });

                        res.json({message: "Check your email", success: true})
                    })
                })
        })

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/new-password', [
    body('password', 'Enter a strong password of minimum 4 length').isLength({ min: 4 })
], async (req, res) => {
    try{
        const {password, confirmPassword, resetToken} = req.body;
        User.findOne({resetToken:resetToken, expireDate:{$gt: Date.now()}})
        .then(user => {
            if (!user) {
                return res.json({message: 'Please! try again after sometime session may be expired', success: false});
            }

            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hashSync(req.body.password, salt);

            user.password = secPass;
            user.resetToken = undefined;
            user.expireDate = undefined;

            user.save().then(result => {
                res.json({message: "Password has been updated successfully", success: true})
            })
        })
    }
    catch(err){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;