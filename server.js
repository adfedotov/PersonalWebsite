const http = require('http'),
      access = require('./config/access.json'),
      router = require('./util/router');

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer();

server.on('request', function(req, res) {
  if (req.method === 'GET') {
    router.get(req, res);
  }
  else if (req.method === 'POST') {
    router.post(req, res);
  }
  else if (req.method === "OPTIONS") {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.end();
  } 
});

server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
