const response = require('../responses/http.responses');

function generatePromise(callback, ...arg){
	return new Promise((resolve, reject) => {
		try{
			// eslint-disable-next-line no-unused-vars
			setTimeout(_ => reject('timeout error-code:99998'), 5000);

			callback(...arg, resolve);
		}
		catch(err){
			reject('failed on promise error-code:99999');
		}
	});
}

module.exports = function (req, res, callbacks, next){
	var interceptors = [];

	callbacks.map(intercept => {
		interceptors.push(generatePromise(intercept, req, res));
	});

	Promise.all(interceptors).then(values => {
		next(values);
	}).catch(err => {
		response.internalError.sendError(err);
		response.internalError.sendResponse(res);
	});
};
