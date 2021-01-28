const http = require('http');
const config = require('dotenv');
const api = require('./routes/routes');
const routes = require('./routes/test.route');

const server = http.createServer(api);

server.listen(3000, "localhost", _ => {
    console.log('server is running ');
});
