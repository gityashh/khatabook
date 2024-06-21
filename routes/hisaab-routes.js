const express = require('express')
const router = express.Router();
const userModel = require('../models/user-model')
const hisaabModel = require('../models/hisaab-model');
const { isLoggedIn } = require('../middlewares/login-middlewares');
const checkhisaab = require('../middlewares/hisaab-access');

router.get('/view/:id',checkhisaab,async (req,res)=>{
    let hisaab = await hisaabModel.findOne({_id: req.params.id})
    res.render("hisaab.ejs",{hisaab})
})

router.get('/create',isLoggedIn,(req,res)=>{
    res.render('create')
})

router.post("/:id/verify",isLoggedIn,async (req,res)=>{
    let hisaab = await hisaabModel.findOne({_id:req.params.id})
    let passcode = req.body.passcode;
    if (passcode === hisaab.passcode) {
        req.session.hisaabAccess = `${req.params.id}${req.user.id}`
        res.redirect(`/hisaab/view/${req.params.id}`)
    }
    else{
        res.send("wrong passcode")
    }
})

router.post('/create',isLoggedIn,async (req,res)=>{
    let {title,description,encrypted,shareable,passcode,editpermissions} = req.body;

    encrypted = encrypted ? true : false 
    shareable = shareable ? true : false 
    editpermissions = editpermissions ? true : false 

    let hisaab = await hisaabModel.create({
        title,
        description,
        user: req.user.id,
        encrypted,
        shareable,
        passcode,
        editpermissions,
    })
    
    let user = await userModel.findOne({ username: req.user.username });
    user.hisaab.push(hisaab._id);

    await user.save();

    res.redirect('/profile');
})

module.exports = router;