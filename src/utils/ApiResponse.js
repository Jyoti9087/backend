// it is craeted to standardized format for successful responses back to the client

class ApiResponse {
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        //assign the value passed as an argument to the constructor
        //the actual information to send back to the user
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}

export {ApiResponse}