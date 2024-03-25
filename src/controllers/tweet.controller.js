import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    //get the content from the user
    //get the user id from req.user
    //create a new document using queries
    //send the response
    //do check the validations all the time
    const {content} = req.body;

    if(!content) throw new ApiError(400 , "Please provide the content");

    const userId = req.user._id;

    const tweet = await Tweet.create({content , owner : userId});

    if(!tweet) throw new ApiError(500 , "Unable to upload the tweet");

    res.status(201).json(new ApiResponse(201 , "Tweet upload successful", tweet));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.query;

    const tweets = await Tweet.aggregate([
        {$match : {owner : new mongoose.Schema.Types.ObjectId(userId)}},
        {$project : {content}}
    ])

    if(tweet?.length === 0) throw new ApiError(404 , "no tweets found");

    res.status(200).json(new ApiResponse(200 , "Tweets are found successfully" , tweets));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}  = req.params;
    const {newContent} = req.body

    if(!tweetId) throw new ApiError(404,  "No tweet id found");

    if(!newContent) throw new ApiError(404, "No content to update ");

    const tweet = await Tweet.findByIdAndUpdate(tweetId , {$set : {content : newContent}}, {new : true});

    if(!tweet) throw new ApiError(500 , "Unable to update the tweet");

    res.status(200).json(new ApiResponse(200 , "Tweet updated successfully" , tweet));

    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} =  req.params;

    await Tweet.findByIdAndDelete(tweetId);

    res.status(200).json(new ApiResponse(200 , "Delete successful" ));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}