class Apierror extends Error{// predefine error  "https://nodejs.org/api/errors.html"
  constructor(
    statusCode,
    message = "Something went wrong",
      errors = [],
      statck = ""
  ){//override
   super(message)
   this.statusCode= statusCode
   this.data= null
   this.message=message
   this.success= false  //here we are handling api errors not api response
   this.errors= errors

   if(statck){
    this.stack= statck
   }else{
    Error.captureStackTrace(this, this.constructor)
   }
  }
}
export {Apierror}