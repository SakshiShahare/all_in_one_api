//to avoid writing try catch again and again and avoid infinite looping of sending request
const asyncHandler = (requestHandler) => {
    return (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((error)=>{next(error)});
    }
}

export default asyncHandler;