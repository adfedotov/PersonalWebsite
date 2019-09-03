const accessFile = require('../config/config.json');

var access = {};

module.exports = access;

access.codeIsValid = function(code) {
	return (accessFile.access_code === code) ? true : false;
}