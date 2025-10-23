// if any error comes when talking to database then gives the error

const asyncHandler = (requestHandler)=>{
 return (req, res , next)=>{
    Promise.resolve(requestHandler(req,res, next)).catch((err)=>next(err))
  }
}


export {asyncHandler}




/*


// just for understanding - higher order function both line having same meaning , function inside func
// const asyncHandler=(func)=>{()=>{}}
// const asyncHandler=(func)=>()=>{}

// we are wrapper func , so we can use multiple
const asyncHandler = (fn) => async (req, res, next) => {
try {
  await fn(req, res , next)
} catch (error) {
  req.status(error.code || 500).json({
    success: false,
    message: err.message
  })
}
}


*/