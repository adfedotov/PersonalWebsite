const path = require('path'),
	  fs = require('fs');

const mimeTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".jpg": "image/jpg",
  ".png": "image/png",
  ".ico": "image/ico",
  ".woff": "font/woff",
  ".pdf": "application/pdf"
}

const defaultDirectory = require('../config/config.json').public_directory;

module.exports = sendFile;

function sendFile(res, pathToFile, pipe=false) {

	const directory = defaultDirectory;
	const fileInfo = path.parse(pathToFile);

	// If accessed file is not supported, return
	if (!(fileInfo.ext in mimeTypes)) {
		res.writeHead(404);
		res.end("Page Not Found");
		return false;
	}

	if (arguments.length === 1) {
		directory = arguments[0];
	}

	const fullPath = "./" + directory + pathToFile;

	if (pipe === false) {
		fs.readFile(fullPath, function(err, data) {
			if (err) {
				console.error("servefile ReadFile: " + err);
				res.writeHead(404, {});
				res.end();
			} else {
				res.writeHead(200, {"Content-Type": mimeTypes[fileInfo.ext]});
				res.end(data);
			}
		});
	} else {
		try {
			res.setHeader("Content-Type", mimeTypes[fileInfo.ext]);
      		res.setHeader("Content-Disposition", "attachment; filename=" + fileInfo.base);
			fs.createReadStream(fullPath).pipe(res);
		} catch(err) {
			res.writeHead(404, {});
			res.end();
			console.error("servefile ReadSream: " + err);
		}
	}
}