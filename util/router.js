const url = require('url');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const content = require('./content');
const serveFile = require('./serve-file');
const session = require('./session');
const log = require('./logger');

const handleRequest = {};

module.exports = handleRequest;

/**
 * Handle GET request
 */
handleRequest.get = function(req, res) {
  const path = url.parse(req.url).path;
  
  if (!isFile(req.url)) {
    switch (path) {
      case '/':
      case '/index.html':
        renderPage('./views/index.ejs', res, content());
        break;
      case '/downloads/resume':
        serveFile(res, url.parse('/assets/pdf/AndreiFedotovResume.pdf').pathname, true);
        break;
      case '/admin':
        // If logged in, redirect to edit page
        if (session.isLoggedIn(req)) {
          redirect(res, '/admin/edit');
        } else {
          renderPage('./views/admin.ejs', res);
        }
        break;
      case '/admin/edit':
        if (session.isLoggedIn(req)) {
          renderPage('./views/edit.ejs', res, content());
        } else {
          redirect(res, '/admin');
        }
        break;
      default:
        res.writeHead(404);
        res.end();
    }

    // Log request Note: statusCode is wrong
    log(req, res);
  } else {
    // if it is file, serve it
    serveFile(res, path);
  }
}

/**
 * Handle POST request
 */
handleRequest.post = function(req, res) {
  const path = url.parse(req.url).pathname;

  switch (path) {
    case '/login':
      session.handleLogin(req, res);
      break;
    case '/admin/edit':
      break;
    case '/logout':
      session.handleLogout(req, res);
      break;
    default:
      res.writeHead(400);
      res.end();
  }

  // Log request
  log(req, res);
}

/**
 * Render EJS
 */
function renderPage(path, res, pageContent={}) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  try {
    const html = ejs.render(fs.readFileSync(path, 'utf-8'), pageContent);
    res.write(html);
  } catch(err) {
    console.error(err);
    res.writeHead(404);
  }
  res.end();
}

/**
 * Check if it is a file. Accepts URL object
 */
function isFile(url) {
  return (path.parse(url).ext === '') ? false : true;
}

/**
 * Redirect to page
 */
function redirect(res, url) {
  res.writeHead(302, {'Location': url});
  res.end();
}
