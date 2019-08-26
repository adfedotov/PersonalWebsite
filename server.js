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

const defaultHeaders = { /* MOVE IT TO NGINX */
  "X-XSS-Protection": "1; mode=block",
  "x-frame-options": "SAMEORIGIN",
  "x-content-type-options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}

server.on('request', function(req, res) {

  if (req.method === 'GET') {
    const pathInfo = path.parse(req.url);
    if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200, defaultHeaders);
      getContent(function(err, content) {
        if (err) {
          console.error("getContent Error: \n" + err);
        } else {
          const html = ejs.render(fs.readFileSync('views/index.ejs', 'utf-8'), {about: content.about, projects: content.projects});
          res.end(html);
        }
      });
      console.log(`[${new Date().toTimeString()}] ${req.headers["x-real-ip"]} - ${req.url} - ${res.statusMessage} ${res.statusCode}`);
    }
    /* CHECK IF IT IS A PDF DOWNLOAD REQUEST */
    else if (req.url === '/downloads/resume') {
      console.log(`${req.connection.remoteAddress} - ${req.url}`);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=AndreiFedotovResume.pdf");
      res.writeHead(200, defaultHeaders);
      fs.createReadStream(__dirname + "/public/downloads/AndreiFedotovResume.pdf").pipe(res);
      console.log(`[${new Date().toTimeString()}] ${req.headers["x-real-ip"]} - ${req.url} - ${res.statusMessage} ${res.statusCode}`);
    }
    /* CHECK IF IT IS A FILE ACCESS */
    else if (pathInfo.ext !== '' && pathInfo.ext !== '.html') {
      handleFileRequest(pathInfo, res);
    }
    /* NO RESPONSE */
    else {
      res.writeHead(404, defaultHeaders);
      res.end();
    }
  }
  // console.log(`${req.url}`);
});

const handleFileRequest = function(pathInfo, res) {
  if (pathInfo.dir === filePaths[pathInfo.ext]) {
    const filePath = __dirname + filePaths[pathInfo.ext] + "/" + pathInfo.base;
    fs.readFile(filePath, function(err, data) {
      if (err) {
        console.error("Read File Error: " + err);
        res.writeHead(404, defaultHeaders);
        res.end();
      } else {
        res.setHeader("Content-Type", contentTypes[pathInfo.ext]);
        res.writeHead(200, defaultHeaders);
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, defaultHeaders);
    res.end();
  }
}

const getContent = function(callback) {
  fs.readFile("content/content.json", function(err, data) {
    if (err) {
      console.error("Read File Error: \n" + err);
      callback(err);
      return;
    }
    try {
      const content = JSON.parse(data);
      callback(null, content);
    } catch(err) {
      console.error("Parse JSON Error: \n" + err);
      callback(err);
    }
  });
}

server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
