
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            lowercase : true,
            //to make the username searchable
            index : true
        } ,

        email : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            lowercase : true
        },

        fullname : {
            type : String,
            required : true,
            trim : true,
            index : true
        },

        avatar : {
            type : String, // cloudinary url
            required : true,
        },

        coverImage : {
            type : String, // cloudinary url
        },

        watchHistory :[
            {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
            }
        ],

        password : {
            type : String,
            required : true
        },

        refreshToken :{
            type : String
        }
    }, {timestamps : true}
)
//hashing the password using bcrypt js
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password , 10);

    next();
})

//checking the password

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

//generating access and refresh token

userSchema.methods.generateAccessToken  = async function(){

    return await jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn  : process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken  = async function(){

    return await jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn  : process.env.REFRESH_TOKEN_EXPIRY}
    )
}

//verify the access and refresh tokens




export const User = mongoose.model("User" , userSchema);