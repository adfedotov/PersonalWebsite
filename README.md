## This is my personal website -> [link](https://andreifedotov.com)

- Node.js with no frameworks
- EJS for templating
- Mocha & Chai for tests
- Deployed on AWC EC2
- Behind NGINX

All of the content is kept in a JSON file. When request is made, EJS renders the webpage using the content provided. 
When you log in to the admin panel, you are redirected to the edit panel (not set up yet) and assigned an 'SID' token (generated using Node.js's crypto module). 
I want to make an admin panel where I can make changes to the website in real time. (Make it sort of like a constructor where I can add fields, blocks, etc.)

## To start
### 1. Get dependencies
```
npm install OR npm install --production (if you don't want dev dependencies)
```

### 2. Start the server
```
npm start OR node server.js OR node server.js host port
```
Default address: http://127.0.0.1:3000
Admin panel: http://127.0.0.1:3000/admin

## Tests
```
npm test
```
##### *Requires you to run the server on default host and port.*

- Content can be found in config/content.json
- All public/static files can be found in public/
- Access code can be changed in config/config.json

*Note: All of the security headers and SSL certificates are setup in NGINX*