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


router.get('/',redirectIfLogin, (req, res) => {
    res.render('index.ejs', { loggedin: false })
})
router.get('/register',redirectIfLogin, (req, res) => {
    res.render('register.ejs', { loggedin: false })
})

router.get("/profile", isLoggedIn, async function (req, res) {
    let user = await userModel
    .findOne({ username: req.user.username })
    res.render("profile", { user });
  });

router.get("/logout", function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
  });

router.post('/login',async function (req,res){
    try {
        
        let {username,password} = req.body;
        console.log(username);

        let user = await userModel.findOne({username:username}).select("+password");
        if (!user) return res.send('email or password did not match')

        if (process.env.JWT_SECRET) {
            bcrypt.compare(password, user.password, function (err,result) {
                if (result) {
                    let token = jwt.sign({username,id: user._id},process.env.JWT_SECRET)
                    res.cookie('token',token)
                    res.redirect('/profile')
                }
                else{
                    res.send(err)
                }
            })
        }
        else{
            res.send('no secret key')
        }
    } catch (err) {
        res.send(err)
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
                        { username, id: createduser._id },
                        process.env.JWT_SECRET
                      );

                    res.cookie('token',token)
                    res.redirect('/profile')
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