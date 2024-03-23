import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
//method to generate the access and refresh tokens together 
const generateAccessAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = await user.genrateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        //adding the refresh token to the document
        user.refreshToken = refreshToken;
        //the validation is false so that no need to check for the password again and again 
        await user.save({validateBeforeSave : false});

        return {accessToken , refreshToken};
    } catch (error) {
        throw new APiError(500 , "Something went wrong while generating tokens");
    }

}
const registerUser = asyncHandler(async (req , res) => {
    
    //steps
    //get info from user
    //check if info is valid and correct
    //if not throw error
    //check if user is already register
    //if it is 
    //upload things to cloudinary
    //check if the things are uploaded properly 
    //get the url from cloudinary
    //create document using query
    //remove password and refreshToken field 
    //check for user creation 
    //return response of success or failure 

    const {fullname, email, username , password} = req.body;

    console.log("email :" , email)

    if(([fullname, email, username, password].some((field) => { return field.trim === "" }))){
        throw new ApiError(400 , "All fields are required");
    }
    
    
    //with or operator the user with either the username or the email criteria to check if it exists
    const existedUser = await User.findOne({$or : [{username} , {email}]});

    if(existedUser)
    throw new ApiError(409 , "User already exists");

    //multer gives us the req.files 
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverLocalPath = req.files?.coverImage[0]?.path ;

    let coverLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverLocalPath = req.files?.coverImage[0]?.path
    }

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar is required");
    }

     const avatar   = await uploadOnCloudinary(avatarLocalPath);
     const coverImage = await uploadOnCloudinary(coverLocalPath);

     if(!avatar) throw new APiError(400 , "Avatr is required");

    const user =  await User.create({
        username : username.toLowerCase(),
        email,
        fullname,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
     })

     const createdUser = await User.findById(user._id).select("-refreshToken  -password");

     if(!createdUser) throw new ApiError(404 , "user not found");

     //sending the final response

     res.status(201).json(new ApiResponse(201, "User registered" , createdUser));
     


})

const loginUser = asyncHandler(async (req ,res )=>{
    //steps
    //get the data from the user
    //validation if the data is correctly filled
    //check the entered password
    //if incorrect password return error
    //if correct password
    //find the user in the database
    //generate accesstoken and refreshtoken
    //cookies se khelenge
    //refreshtoken save in database
    //return user login successful if it is successful else return failure message

    const {username ,email , password} = req.body;

    if(!username && !email){
        throw new ApiError(400 , "Username or email is required");
    }

    const registeredUser = await User.findOne({$or : [{username} , {email}]});

    if(!registeredUser) throw new ApiError(404 , "User with such username or email is not found");

    if(!password) throw new ApiError(404 , "Password is required");

    const checkPassword = await registerUser.isPasswordCorrect(password);

    if(!checkPassword) throw new ApiError(404 , "Incorrect password");

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(registeredUser._id);

    //getting the new user because we need refreshToken

    const newUser = await User.findById(user._id).select("-password -refreshToken");
    //options to make the cookie modifiable only from the backend 
    const options =  { 
        httpOnly : true,
        secure : true
    }
    
    res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(new ApiResponse(200 , "Login successful" , {accessToken , refreshToken , user: newUser}));

});

export {registerUser, loginUser};