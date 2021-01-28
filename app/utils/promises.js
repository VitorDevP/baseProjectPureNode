const response = require('../responses/http.responses');

function generatePromise(callback, ...arg){
    return new Promise((resolve, reject) => {
        try{
            setTimeout(_ => reject('timeout'), 5000);

            callback(...arg, resolve);
        }
        catch(err){
            reject("failed on promise")
        }
    })
}

module.exports = function (req, res, callbacks, next){
    var interceptors = [];

    callbacks.map(intercept => {
        interceptors.push(generatePromise(intercept, req, res));
    });

    Promise.all(interceptors).then(values => {
        next(values)
    }).catch(err => {
        response.internalError.sendError(err);
        response.internalError.sendResponse(res);
    })
}
