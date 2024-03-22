import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

//simply setting up the things in .env and copy pasting from the cloudinary website
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) =>{

    try {
        if(!localFilePath) return null;

        //uploading file on cloudinary
       const response  = await cloudinary.uploader.upload(localFilePath , {resource_type  : "auto"});
        //successfully uploaded on cloudinary 
       console.log("File uploaded successfully " , response.url);
       //unlink the file from local storage
       fs.unlinkSync(localFilePath);
       return response;
    } catch (error) {
        //for cleaning purpose 
        fs.unlinkSync(localFilePath) 
        //removing the file from local storage as the upload operation got failed 
        return null;
    }
}


export {uploadOnCloudinary};