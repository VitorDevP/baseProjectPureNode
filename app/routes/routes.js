const response = require('../responses/http.responses');
const router = require('./router');

module.exports = (req,res) => {
    try{        
        router.callRouter(req, res);
    }
    catch (err){
        response.internalError.sendError(err.message)
        response.internalError.sendResponse(res)
    }    
}