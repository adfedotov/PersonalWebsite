const http = require('http'),
      ejs = require('ejs')
      fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer();

server.on('request', function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const html = ejs.render(fs.readFileSync('views/index.ejs', 'utf-8'), {});
    res.statusCode = 200;
    res.write(html);
    res.end();
  }

  // Static files (CSS)
  if (req.url.indexOf('.css') != -1) {
    fs.readFile(__dirname + req.url, function(err, data) {
      if (err) {
        console.error(err);
        res.statusCode = 404;
        res.end();
      } else {
        res.setHeader("Content-Type", "text/css");
        res.statusCode = 200;
        res.write(data);
        res.end();
      }
    });
  } else if (req.url.indexOf('.jpeg') != -1) {
    fs.readFile(__dirname + req.url, function(err, data) {
      if (err) {
        console.error(err);
        res.statusCode = 404;
      } else {
        res.setHeader("Content-Type", "image/jpeg");
        res.statusCode = 200;
        res.write(data);
      }
      res.end();
    });
  }
  //console.log(`${req.connection.remoteAddress} accessed ${req.url} --- ${res.statusCode}`);
});

server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
