const mongoose = require('mongoose')

const hisabSchema = mongoose.Schema({
    title:{
        type:String,
        minLength:3,
        maxLength:100,
        trim:true,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    encrypted:{
        type:Boolean,
        default:false
    },
    shareable:{
        type:Boolean,
        default:false
    },
    passcode:{
        type:String,
        default:""
    },
    editpermissions: {
        type: Boolean,
        default: false,
    }
    },
    { timestamps: true }
);

const Hisaab = mongoose.model("Hisaab", hisabSchema);

module.exports = Hisaab;