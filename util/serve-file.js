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

module.exports = sendFile;

function sendFile(res, pathToFile, pipe=false) {

	const directory = "";
	const fileInfo = path.parse(pathToFile);

	if (arguments.length === 1) {
		directory = arguments[0];
	}

	const fullPath = "./" + directory + pathToFile;

	if (pipe === false) {
		fs.readFile(fullPath, function(err, data) {
			if (err) {
				console.error("servefile ReadFile: " + err);
				res.writeHead(404, {});
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
			console.error("servefile ReadSream: " + err);
		}
	}
}