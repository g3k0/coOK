/*jshint esversion: 6*/
/*
 * Class dependencies
 */
var Log = require('log');
var log = new Log('info');
//-------------------------------------------------------------------------------------------

var Logger = function Logger () {
	
};

Logger.prototype.info = function info (msg) {
	return log.info(msg);
};

Logger.prototype.warn = function warn (msg) {
	return log.debug(msg);
};

Logger.prototype.error = function error (msg) {
	return log.error(msg);
};

var logging = new Logger();

module.exports = logging;