import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const {userId} = req.user._id;
    //now we have videoId and userId
    //find the document
    //if the document is available then delete it 
    //if not availabe then add it

    const like = await Like.findOne({video : videoId , likedBy : userId});

    if(!like){
    const newLike = await Like.create({video : videoId , likedBy  : userId});
    res.status(201).json(new ApiResponse(201 , "Liked" , newLike));
    }

    await Like.findOneAndDelete({video : videoId , likedBy : userId});
    res.status(200).json(new ApiResponse(200 , "Not liked"));
    

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const {userId} = req.user._id;

    const like = await Like.findOne({comment : commentId , likedBy : userId});
    
    if(!like){
        const newLike = await Like.create({comment : commentId , likedBy : userId});
        res.status(201).json(new ApiResponse(201 , "Liked" , newLike));
    }

    await Like.findOneAndDelete({comment : commentId , likedBy : userId});
    res.status(200).json(new ApiResponse(200 , "Not liked"));

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const {userId} = req.user._id;

    const like = await Like.findOne({tweet : tweetId , likedBy : userId});
    
    if(!like){
        const newLike = await Like.create({tweet : tweetId , likedBy : userId});
        res.status(201).json(new ApiResponse(201 , "Liked" , newLike));
    }

    await Like.findOneAndDelete({tweet : tweetId , likedBy : userId});
    res.status(200).json(new ApiResponse(200 , "Not liked"));

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {userId} = req.user._id;

   const videos =  await Like.find({likedBy : userId });

   if(!videos) throw new ApiError(404 , "No videos found");

   res.status(200).json(new ApiResponse(200 , "Videos are found" , videos));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}