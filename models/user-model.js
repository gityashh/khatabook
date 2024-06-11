const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required:true,
        trim:true,
        minLenght:3,
        maxLenght:20
    },
    password:{
        type: String,
        required:true,
        select:false
    },
    name: {
        type: String,
        required: true,
        trim: true,
      },
      profilepicture: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
      hisaab: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hisaab" }],    
})

const User = mongoose.model("User", userSchema);

module.exports = User;