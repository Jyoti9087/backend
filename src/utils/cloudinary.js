import {v2 as cloudinary} from "cloudinary"
import { log } from "console";
//node js file system(fs)module,which allow us to interact with local file. 
import fs from "fs"

//multer is a node.js middleware for handling file uploads,parsing files and storing them locally
//cloudinary is a cloud base media management platform for uploading,storing and optimizing and delivering images and videos

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
//define a asynchronous function named uploadOnCloudinary ,it takes one argument local path
const uploadOnCloudinary=async(localFilepath)=>{
    try {
        //cheks if the file path is actually passed to the function aur not
        if (!localFilepath) return null
            //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilepath,{
            //auto tells cloudinary to figure out if it's image,video,etc
            resource_type:"auto"
         })
            //file has been uploaded successfully
         console.log("file is uploaded on cloudinary",response.url);
            //if any error occured(eg:failed upload,network issue),go to catch
            return response;
    } catch (error) {
        //remove the file from the local server
        fs.unlinkSync(localFilepath) //remove the locally saved temporary file as the operation got failed
        //after handling the error and cleaning up,the function stops and return null
        return null;
    }
}

export {uploadOnCloudinary}