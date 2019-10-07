exports.parse = parse;
exports.serialize = serialize;

/**
 * parse() returns a dictionary of cookies
 * based on passed in cookie string
 */
function parse(cookies) {
  if (typeof cookies !== 'string')
    throw new TypeError('Argument has to be a string');

  let cookieDict = {};

  cookies.split(';').forEach(function(cookie) {
    let parts = cookie.split('=');
    cookieDict[parts[0].trim()] = parts[1] || null;
  });

  return cookieDict;
}

/**
 * serialize() returns a cookie string
 * based on passed name and value
 */
function serialize(name, value) {
  if (typeof name !== 'string' || typeof value !== 'string')
    throw new TypeError('Arguments have to be strings');

  let cookie = '';

  cookie += name + '=' + value;
  cookie += '; HttpOnly';
  return cookie;
}