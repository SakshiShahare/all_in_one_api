import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    //we have the videoId
    //find in the database all the comments having video field as videoId

    const comments = await Comment.find({video : videoId});

    //now we have all the comments 

    if(!comments) throw new ApiError(404, "No comments found");

    res.status(200).json(new ApiResponse(200 , "COmments found", comments));

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    const {content} = req.body;
    const {owner} = req.user._id;

    const comment = await Comment.create({video : videoId , content : content , owner : owner});

    if(!comment) throw new ApiError(500 , "Unable to upload the comment");

    res.status(201).json(new ApiResponse(201, "Commented Successfully", comment));

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {newContent} = req.body;
    const {commentId} = req.params;

    const newComment = await Comment.findByIdAndUpdate(commentId , {content : newContent} , {new : true});

    if(!newComment) throw new ApiError(404, "No such comments found");

    res.status(200).json(new ApiResponse(200 , "Comment updated" , newComment));

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);

    if(!comment) throw new ApiError(404 , "No comment found");
    
    res.status(200).json(new ApiResponse(200 , "Delete successful"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }