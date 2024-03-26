import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const {userId} = req.user._id
    // TODO: toggle subscription
   //get the userId and the channel id
   //find in the subscription model the document with this
   //if find then change the subscribe to unsubscribe
   //if not then create the document and subscribe it

   const subscribe = await Subscription.find({channel : channelId , subscriber : userId});

   if(subscribe)
   {
    await Subscription.findOneAndDelete({channel : channelId , subscriber : userId});
    res.status(200).json(new ApiResponse(200 , "Unsubscribed successfully"));
    }
    //subscription done
    const newSubscriber = await Subscription.create({channel : ChannelId , subscriber : userId});
    res.status(201).json(new ApiResponse(201, "Subscribed successfully" , newSubscriber));
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    const subscribers = await Subscription.aggregate(
        [
            {$match : {channel : new mongoose.Schema.Types.ObjectId(channelId)}}
        ]);
    
    console.log(subscribers)

    res.status(200).json(new ApiResponse(200 , "Subscriber found" , subscribers));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscribedTo = await Subscription.aggregate(
        [
            {$match : {subscriber : new mongoose.Schema.Types.ObjectId(subscriberId)}}
        ]);

        console.log(subscribedTo);

        res.status(200).json(new ApiResponse(200 , "Channels fetched" , subscribedTo));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}