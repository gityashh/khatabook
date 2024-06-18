const jwt = require('jsonwebtoken')

function isLoggedIn(req,res,next){
    try {
        if (process.env.JWT_SECRET) {
            if (req.cookies.token) {
                jwt.verify(req.cookies.token,process.env.JWT_SECRET,function (err,decoded) {
                    if (decoded) {
                        req.user = decoded;
                        next();
                    }
                    else{
                        res.send('login first')
                    }
                })
            }
            else{
                res.redirect("/");
            }
        }
        else{
            res.send('no secret key')
        }
        
    } catch (error) {
        res.send(error.message)
    }
}

function redirectIfLogin(req, res, next) {
    if (req.cookies.token) {
      res.redirect("/profile");
    } else next();
}
  
  module.exports.isLoggedIn = isLoggedIn;
  module.exports.redirectIfLogin = redirectIfLogin;