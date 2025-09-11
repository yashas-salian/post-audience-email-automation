export class appResponse{
        statusCode : number
        message : string 
        success : boolean
        data : any
    constructor(
        statusCode : number,
        message : string = "Success",
        success : boolean,
        data : any
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400
    }

}