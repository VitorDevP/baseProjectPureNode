class httpResponse {
	constructor(status, error, data=null){
		this.status = status;
		this.error = error;
		this.data = data;
	}

	get response (){
		if(this.error) return {error: this.error};
		else return {data: this.data};
	}

	get statusCode(){
		return this.status;
	}

	sendError(err){
		this.error = {serverError: this.error, debug: err};
	}

	sendResponse(res){
		res.setHeader('Content-Type', 'application/json');
		res.writeHead(this.statusCode);
		res.end(JSON.stringify(this.response));
	}
}

exports.notFound = new httpResponse(404, 'not Found');
exports.internalError = new httpResponse(500, 'internal error!');
exports.success = (data) => new httpResponse(200, null, data);
exports.created = (data) => new httpResponse(201, null, data);
exports.updated = (data) => new httpResponse(200, null, data);
exports.deleted = (data) => new httpResponse(200, null, data);
