import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//model name description videos owner

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    if(!name || !description) throw new ApiError(400 , "Please provide name and description");
    //TODO: create playlist
    //get the info
    //get the validation
    //create the playlist
    const playlist = await Playlist.create({name , description , owner : req.user._id});

    if(!playlist) throw new ApiError(500 , "Error while creating playlist");

    res.status(201).json(new ApiError(201 , "Playlist created successfully" , playlist));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!userId) throw new ApiError(404 , "No user id found")

    const playlists = await Playlist.find({owner : userId});

    if(!playlists) throw new ApiError(500 , " No playlist to fetch");

    res.status(200).json(new ApiError(200 , "Playlists are present" , playlists));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId) throw new ApiError(404 , "Id not found");

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) throw new ApiError(404 , "No playlist found");

    res.status(200).json(new ApiResponse(200 , "Playlist found successfully" , playlist));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const {playlistId, videoId} = req.params;
    if(!playlistId || !videoId) throw new ApiError(404  , "playlistid or videoid not found");
    const playlist = await Playlist.findById(playlistId);

    if(!playlist) throw new ApiError(404 , "No playlist found ")
    playlist.videos.push(new mongoose.Schema.Types.ObjectId(videoId));

    playlist.save({validateBeforeSave : false});

    res.status(200).json(new ApiResponse(200 , "Video added" ))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const {playlistId, videoId} = req.params;
    if(!playlistId || !videoId) throw new ApiError(404  , "playlistid or videoid not found");
    const playlist = await Playlist.findById(playlistId);

    if(!playlist) throw new ApiError(404 , "No playlist found ")
    const oldVideo = playlist.videos;
    const newVideo = playlist.videos.map((video)=>{ if(video !== videoId){return video}})

    playlist.videos = newVideo;

    playlist.save({validateBeforeSave : false});

    if(oldVideo === newVideo) throw new ApiError(500 , "Unable to submit delete the video")
    res.status(200).json(new ApiResponse(200 , "Video removed successfully" ))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId) throw new ApiError(404 , "Playlist not found");

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json(new ApiResponse(200 , "Playlist deleted "));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!name || !description) throw new ApiError(400 , "Please provide the details");

   const playlist =  await Playlist.findByIdAndUpdate(playlistId , {$set : {name, description}} , {new : true});

   if(!playlist) throw new ApiError(404 , "Playlist not found");

   res.status(200).json(new ApiResponse(200 , "Playlist found" , playlist));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}