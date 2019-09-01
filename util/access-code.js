const accessFile = require('../config/access.json');

var access = {};

module.exports = access;

access.codeIsValid = function(code) {
	return (accessFile.access_code === code) ? true : false;
}