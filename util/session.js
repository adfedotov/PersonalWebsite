const accessFile = require('../config/config.json');
const crypto = require('crypto');
const cookie = require('./cookie');

const session = {};

// Temporary holder for sessions
let sessions = {};

module.exports = session;

session.handleLogin = function(req, res) {
  var code = '';

  // TODO: Checks on data
  req.on('data', function(data) {
    code += data;
  });

  req.on('end', function() {
    // Check if code is valid
    if (session.codeIsValid(code)) {
      // If access code is valid, create new session
      createSession(req, res, function(err, session_id) {
        if (err) {
          console.error(err);
          return;
        }
        res.writeHead(200);
        res.end();
      });
    } else {
      // if code is wrong and there are cookies in request, clear them
      clearCookies(req, res);
      res.writeHead(401);
      res.end();
    }
  });
}

session.handleLogout = function(req, res) {
  if (session.isLoggedIn(req)) {
    const sid = cookie.parse(req.headers.cookie)['SID'];
    clearCookies(req, res);
    delete sessions[sid];
    res.writeHead(200);
  } else {
    res.writeHead(401);
  }

  res.end();
}

/**
 * Check if user is logged in
 */
session.isLoggedIn = function(req) {
  // check if cookie exists
  if (req.headers.cookie == null) {
    return false;
  }

  const cookies = cookie.parse(req.headers.cookie);

  // compare with cookie record on server
  if (cookies['SID'] in sessions) {
    const cookieExpires = Date.parse(cookies['Expires']);
    if (
      (cookieExpires - Date.parse(sessions[cookies['SID']])) === 0
      && (new Date() - cookieExpires <= 0)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Check if code provided is equal to code set in config
 */
session.codeIsValid = function(code) {
  return (accessFile.access_code === code) ? true : false;
}

/**
 * Clear all cookies
 */
function clearCookies(req, res) {
  // Check if there are any cookies
  if (req.headers.cookie == null) {
    return;
  }

  const cookies = cookie.parse(req.headers.cookie);
  
  let resetCookies = [];
  for (let key in cookies) {
    if (cookies[key] != null)
      resetCookies.push(`${key}=${cookies[key]}; Expires=${new Date(1).toGMTString()}`);
    else
      resetCookies.push(`${key}; Expires=${new Date(1).toGMTString()}`);
  }

  res.setHeader('Set-Cookie', resetCookies);
}

/**
 * Create new session, set cookies
 * generates random session ID 
 */
function createSession(req, res, callback) {
  // Get max age - 24 hours
  let expires = new Date();
  expires.setDate(expires.getDate() + 1);

  // generate session id
  crypto.randomBytes(256, function(err, buffer) {
    if (err) {
      console.error('Unable to genereate randomBytes');
      return;
    }
    let session_id = crypto.createHash('sha256');
    session_id.update(buffer);
    session_id = session_id.digest('hex');

    // assign to cookie
    res.setHeader('Set-Cookie', [cookie.serialize('SID', session_id), cookie.serialize('Expires', expires.toGMTString())]);

    sessions[session_id] = expires;
    callback(undefined, session_id);
  });
}
