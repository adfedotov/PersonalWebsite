const http = require('http');
const router = require('./util/router');

const hostname = process.argv[2] || '127.0.0.1';
const port = process.argv[3] || 3000;

const server = http.createServer();

server.on('request', function(req, res) {
  if (req.method === 'GET') {
    router.get(req, res);
  } else if (req.method === 'POST') {
    router.post(req, res);
  } else {
    res.writeHead(400);
    res.end();
  }

  // res.on('close', function() {
  //   log(req, res);
  // });
});

server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
