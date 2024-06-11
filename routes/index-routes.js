const express = require('express')
const router = express()
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dbgr = require('debug')('development:')
const {
    isLoggedIn,
    redirectIfLogin,
  } = require("../middlewares/login-middlewares");


router.get('/', (req, res) => {
    res.render('index.ejs', { loggedin: false })
})
router.get('/register', (req, res) => {
    res.render('register.ejs', { loggedin: false })
})
router.get('/profile', (req, res) => {
    res.render('profile.ejs', {

    })
})

router.get("/logout", function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
  });

router.post('/login',async function (req,res){
    try {
        
        let {email,password} = req.body;

        let user = await userModel.findOne({email}).select("+password");
        if (!user) return res.send('email or password did not match')

        if (process.env.JWT_SECRET) {
            bcrypt.compare(password, user.password, function (err,result) {
                if (result) {
                    let token = jwt.sign({email,id: user._id},process.env.JWT_SECRET)
                    res.cookie('token',token)
                    return res.send('logged in')
                }
                else{
                    res.send(err.message)
                }
            })
        }
        else{
            res.send('no secret key')
        }
    } catch (err) {
        res.send(err.message)
    }
})

router.post('/register', async (req, res) => {
    try {
        let { name, username, email, password } = req.body;

        let user = await userModel.findOne({ username })
        if (user) return res.send('you already have an account')

        if (process.env.JWT_SECRET) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) {
                        return res.send(err.message)
                    }
                    let createduser = userModel.create({
                        email,
                        username,
                        name,
                        password: hash,
                    })

                    let token = jwt.sign(
                        { email, id: createduser._id },
                        process.env.JWT_SECRET
                      );

                    res.cookie('token',token)
                    res.send('signed in')
                })
            })
        }
        else{
            res.send('no secret key')
        }

    } catch (error) {
        res.send("error")
    }
})


module.exports = router;