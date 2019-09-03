const url = require('url'),
	  ejs = require('ejs'),
	  fs = require('fs'),
	  path = require('path'),
	  content = require('./content'),
	  serveFile = require('./serve-file'),
	  access = require('./access-code'),
	  logger = require('./logger');

var handleRequest = {};

module.exports = handleRequest;

handleRequest.get = function(req, res) {
	const path = url.parse(req.url).path;
	
	if (!isFile(req.url)) {
		switch (path) {
			case "/":
			case "/index.html":
				renderPage("./views/index.ejs", res, content());
				break;
			case "/downloads/resume":
				serveFile(res, url.parse("/assets/pdf/AndreiFedotovResume.pdf").pathname, true);
				break;
			case "/admin":
				renderPage("./views/admin.ejs", res);
				break;
			case "/admin/edit": // Not setup yet
				// renderPage("./views/edit.ejs", res);
				res.writeHead(404);
				res.end();
				break;
			default:
				res.writeHead(404);
				res.end();
		}
		logger(req, res);
	} else {
		serveFile(res, path);
	}
}

handleRequest.post = function(req, res) {
	const path = url.parse(req.url).pathname;

	switch (path) {
		case "/admin":
			handleLogin(req, res);
			break;
		case "/admin/edit":
			break;
		default:
			res.writeHead(400);
	}
}

function renderPage(path, res, pageContent={}) {
	res.writeHead(200, {"Content-Type": "text/html"});

	try {
		const html = ejs.render(fs.readFileSync(path, "utf-8"), pageContent);
		res.write(html);
	} catch(err) {
		console.error(err);
	}

	res.end();
}

function isFile(url) {
	return (path.parse(url).ext === '') ? false : true;
}

/* Need to implement limited number of tries.
 * Hashtable? might be bad if ddos
 * store in json? { "ip": numberOfTries }
*/
function handleLogin(req, res) {
	let code = "";
	req.on('data', function(data) {
		code += data;
		if (access.codeIsValid(code)) {
  			res.writeHead(200);
  			res.end();
		} else {
			res.writeHead(400);
			res.end();
		}
	});
}