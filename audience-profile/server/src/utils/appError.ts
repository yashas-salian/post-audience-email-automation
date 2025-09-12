

export class appError extends Error{
    statusCode : number
    success : boolean
    constructor(
        statusCode :number,
        message : string = "Something went wrong",
        errors : any[] = [],
        stack = ""
    ){
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.success = false
        if(stack) this.stack = stack
        else Error.captureStackTrace(this, this.constructor)
    }
}