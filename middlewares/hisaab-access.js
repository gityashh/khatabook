const hisaabModel = require("../models/hisaab-model");
const jwt = require('jsonwebtoken')

async function checkhisaab(req,res,next) {
    if (process.env.JWT_SECRET) {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token,process.env.JWT_SECRET,(err,decoded)=>{
                if (decoded) {
                    req.user = decoded
                }
                else{
                    res.cookie("token","")
                    res.redirect('/')
                }
            })
            let hisaab = await hisaabModel.findOne({_id:req.params.id});
            
            if (!hisaab.encrypted) {
                next();
            }
            else if (!req.session.hisaabAccess) {
                res.render("passcode",{hisaabid:req.params.id})
            }
            else if (req.session.hisaabAccess) {
                if (req.session.hisaabAccess === `${req.params.id}${req.user.id}`) {
                    next()
                }
                else{
                    req.session.hisaabAccess = "";
                    res.redirect(`/hisaab/view/${req.params.id}`)
                }
            }
        }
        else{
            res.redirect('/')
        }
    } 
    else {
        res.send("no secret key")
    }
}

module.exports = checkhisaab