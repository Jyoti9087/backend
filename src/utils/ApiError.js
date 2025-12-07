// custom error class names ApiError which is excellent practice for building backend api

//ApiError inherits all the standard feature of build-in js error class
class ApiError extends Error{
    constructor(
        //this accepts the HTTP status code(like 404 or 500)
        statusCode,
        //this accepts the error messege
        messege="Something went wrong",
        errors=[],
        stack=""
    ){

        //this calls the constructor of the parent error class and passes the messege to it
        //this sets up the error basic property correctly
        super(messege)
        this.statusCode=statusCode
        this.data=null  
        this.message=messege
        this.success=false;
        this.errors=errors


        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
      }
}
// this makes the ApiError class available to be imported and used in other files
export {ApiError}