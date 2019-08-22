const http = require('http'),
      ejs = require('ejs')
      fs = require('fs'),
      path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer();

const contentTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".jpg": "image/jpg"
}
const filePaths = {
  ".css": "/public/stylesheets",
  ".js": "/public/javascripts",
  ".jpg": "/public/img"
}

server.on('request', function(req, res) {
  res.setHeader('Content-Type', 'text/html');

  // make it async
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const html = ejs.render(fs.readFileSync('views/index.ejs', 'utf-8'), {});
    res.statusCode = 200;
    res.write(html);
    res.end();
  }

  // Static files (CSS, JPG, JS)
  const pathInfo = path.parse(req.url);
  if (pathInfo.ext !== '' && pathInfo.ext !== 'html') {
    handleFileRequest(pathInfo, res);
  }



  //console.log(`${req.connection.remoteAddress} accessed ${req.url} --- ${res.statusCode}`);
});

const handleFileRequest = function(pathInfo, res) {
  if (pathInfo.dir === filePaths[pathInfo.ext]) {
    const filePath = __dirname + filePaths[pathInfo.ext] + "/" + pathInfo.base;

    fs.readFile(filePath, function(err, data) {
      if (err) {
        console.error(err);
        res.statusCode = 404;
        res.end();
      } else {
        res.setHeader("Content-Type", contentTypes[pathInfo.ext]);
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
}

server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
