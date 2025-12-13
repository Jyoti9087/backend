import multer from "multer";

//the disk storage gives you full control on storing files to disk
//allows the developer to  have complete control over where and how the file are saved on the server local storage

const storage=multer.diskStorage({
    //function that determines the folder where the uploaded files will be stored
    destination:function(req,file,cb){
        //null-no error ,./public-where files will be stored
        cb(null,"./public")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const upload=multer({
    storage
})