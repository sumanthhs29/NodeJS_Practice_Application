const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8080;

var server = http.createServer(app);

if(server) {
    console.log(`The server is running on Port :${port}`);
}

server.listen(port);