const http = require('http'),
      ejs = require('ejs')
      fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer();

server.on('request', function(req, res) {
  const { headers, method, url } = req;

  res.setHeader('Content-Type', 'text/html');

  if (method === 'GET' && url === '/') {
    const ex = ["httt", "h423", "3232"]
    const html = ejs.render(fs.readFileSync('views/index.ejs', 'utf-8'), {names: ex});
    res.statusCode = 200;
    res.write(html);
    res.end();
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }

});

server.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
