module.exports = function(req, res) {
	console.log(`[${new Date().toTimeString()}] ${req.headers["x-real-ip"]} - ${req.url} - ${res.statusMessage} ${res.statusCode}`);
}