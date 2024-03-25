import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const video = await Video.aggregate(
        [
        {$match : {owner : new mongoose.Schema.Types.ObjectId(userId)}},
        {$sort : { sortBy : sortType }},
        {$project : {thumbnail , title , description , isPublished , duration , videoFile}}
        ]
        );

        if(video?.length === 0) throw new ApiError(400 , "no videos to get");

        res.status(200).json(new ApiResponse(200 , "Video sent successfull" , video));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    //get the title description

    const videoLocalPath = req.files?.video[0]?.path;
    const thumbnailLocalPath  = req.files?.thumbnail[0]?.path;

    if(!videoLocalPath || !thumbnailLocalPath) throw new ApiError(400 , "Please upload the video and thumbnail files");

    const videoResponse = await uploadOnCloudinary(videoLocalPath);
    const thumbnailResponse = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoResponse) throw new ApiError(400 , "Video file not uploaded successfully");
    if(!thumbnailResponse) throw new ApiError(400 , "Thumbnail file not uploaded successfully");

    const video  = await Video.create({title , 
        description , 
        thumbnail : thumbnailResponse.url ,
        videoFile : videoResponse.url ,
        duration : videoResponse.width ,
        owner : req.user._id
    })

    if(!video) throw new ApiError(500 , "Error while uploading video");

    res.status(200).json(new ApiResponse(200 , "video published successfully" , video));

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    //use id to get the video
    //if not found throw error
    // if found send response
    //all the information about the video will be gone with owner id if we want owner name then use aggregate pipeline 
    const video  = await Video.findById(videoId);
    if(!video) throw new ApiError(404, "Video not found");

    res.status(200).json(new ApiResponse(200 , "Video sent successfully" , video));

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    //get the info from the user
    //get the id from videoId
    //find the video in the database
    //check the validation for all the things
    // if everything is perfect
    //do find by id and update
    //return the response
    const {title , description , thumbnail} = req.body;

    if(!title || !description || !thumbnail) throw new ApiError(400 , "Please provide all the details");

    const video = await Video.findByIdAndUpdate(videoId , {$set : {title , thumbnail , description}} , {new : true});

    if(!video ) throw new ApiError(404 , "Video with such id is not found");

    res.status(200).json(new ApiResponse(200 , "Video update successfully" , video));



})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    //get the video by the id
    //find the video and delete it 
    // by monggose if it is present then delete and if not no effect to database

    await Video.findByIdAndDelete(videoId);

    res.status(200).json(new ApiResponse(200 , "Video deleted" ));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //get the video using the id 
    //check validation
    // everything good then find the video
    //if not throw error
    //get the isPublished status from the video
    //change the status by negation
    //then save the video again 
    //send the response

    const video = await Video.findById(videoId);

    if(video.isPublished === true){video.isPublished = false}
    else video.isPublished = true;

    video.save({validateBeforeSave : false});

    res.status(200).json(new ApiResponse(200 , "Toggle successful" ));
    //smart code if the negation works
   // const video = await Video.findByIdAndUpdate(videoId , {$set : {isPublished : !isPublished }} , {new : true});
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}