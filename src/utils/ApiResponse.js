// it is craeted to standardized format for successful responses back to the client

class ApiResponse {
    constructor(statusCode,data,messege="Success"){
        this.statusCode=statusCode
        //assign the value passed as an argument to the constructor
        //the actual information to send back to the user
        this.data=data
        this.messege=messege
        this.success=statusCode<400
    }
}

export {ApiResponse}