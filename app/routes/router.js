const promises = require('../utils/promises');

class routes {
    constructor(){
        this.GetRoutes = []
        this.PostRoutes = []
        this.PutRoutes = []
        this.DeleteRoutes = []
    }

    get(path, interceptors, controller = null){        
        this.GetRoutes.push(new route("GET", path, interceptors, controller));
    }

    post(path, interceptors, controller = null){        
        this.GetRoutes.push(new route("POST", path, interceptors, controller));
    }

    put(path, interceptors, controller = null){        
        this.GetRoutes.push(new route("PUT", path, interceptors, controller));
    }

    delete(path, interceptors, controller = null){        
        this.GetRoutes.push(new route("DELET", path, interceptors, controller));
    }

    callRouter(req, res){
        const findPath = (req, url) => {
            var path = req.url;

            if(url.param){
                path = path.substring(0, path.lastIndexOf('/')+1);
            }
            
            return (path.includes(url.path) && path.length == url.path.length);
        }

        var pathList 

        switch(req.method){
            case "GET":
                pathList = this.GetRoutes;
                break;
            case "POST":
                pathList = this.PostRoutes;
                break;
            case "PUT":
                pathList = this.PutRoutes;
                break;
            case "DELETE":
                pathList = this.DeleteRoutes;
                break;
            default:
                throw new Error("Invalid http method");
        }

        const route = pathList.filter(x => findPath(req, x));

        if(Array.isArray(route) && route.length == 1){
            if(route[0].interceptors.length > 0) {
                promises(req, res,route[0].interceptors, values => {
                    route[0].callback(req, res, values) ;
                });                    
            }
            else route[0].callback(req, res);
        }
        else {
            response.notFound.sendResponse(res);
        }
    }
}

class route {
    constructor(method, path, interceptors, callback) {
        this.method = method,
        this.path = this.validatePath(path) 
        this.interceptors = this.validateInterceptor(callback ? interceptors : []);
        this.callback = this.validateCallback(callback ? callback : interceptors);
    }

    validateIsFunction(callback) {
        return callback.constructor === Function;
    }

    validateInterceptor(interceptors) {
        if(Array.isArray(interceptors)){ 
            interceptors.map(x => {
                if(!this.validateIsFunction(x)) throw new TypeError("Interceptors should be Functions");
            });
        }
        else if(!this.validateIsFunction(interceptors)) throw new TypeError("Interceptor should be Functions");

        return Array.isArray(interceptors) ? interceptors : [interceptors];
    }

    validateCallback(callback){
        if(Array.isArray(callback)) throw new TypeError('callback should be a function not an array')
        if(!this.validateIsFunction(callback)) throw new TypeError("callback should be a function")
        return callback;
    }

    validatePath(path){
        if(typeof path !== 'string') throw new TypeError("path should be a string");

        var [path, param = null] = path.split(':',2);

        if(path.length == 0) throw new Error("path could not be empty");

        this.param = param;
        
        return path;
    }
}

const router = new routes();

module.exports = router;