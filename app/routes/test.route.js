const router = require('./router');
const response = require('../responses/http.responses');

const testInterceptor = (req, res, next) => {
	const time = Math.floor((Math.random() * 5000) + 1);
	setTimeout(() => next(time), time);
};

router.get('/', [testInterceptor,testInterceptor], (req, res, result) => {
	response.success(result).sendResponse(res);
});

router.get('/test/:id',  (req, res) => {
	response.success('ok').sendResponse(res);
});

router.get('/test/test/:id',  (req, res) => {
	response.success('ok').sendResponse(res);
});


exports = router;