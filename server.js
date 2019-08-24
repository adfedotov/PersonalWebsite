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
  ".jpg": "image/jpg",
  ".png": "image/png",
  ".ico": "image/ico",
  ".woff": "font/woff"
}
const filePaths = {
  ".css": "/public/stylesheets",
  ".js": "/public/javascripts",
  ".jpg": "/public/img",
  ".png": "/public/img",
  ".ico": "/public/img",
  ".woff": "/public/fonts"
}

server.on('request', function(req, res) {
  if (req.method === 'GET') {
    const pathInfo = path.parse(req.url);

    if (req.url === '/') {
      console.log(`${req.connection.remoteAddress} - ${req.url}`);
      const html = ejs.render(fs.readFileSync('views/index.ejs', 'utf-8'), {});
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.write(html);
      res.end();
    }
    /* CHECK IF IT IS A PDF DOWNLOAD REQUEST */
    else if (req.url === '/downloads/resume') {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=AndreiFedotovResume.pdf");
      fs.createReadStream(__dirname + "/public/downloads/AndreiFedotovResume.pdf").pipe(res);
      res.end();
    }
    /* CHECK IF IT IS A FILE ACCESS */
    else if (pathInfo.ext !== '' && pathInfo.ext !== '.html') {
      handleFileRequest(pathInfo, res);
    }
    /* NO RESPONSE */
    else {
      res.statusCode = 404;
      res.end();
    }
  }
});

const handleFileRequest =  async function(pathInfo, res) {
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
