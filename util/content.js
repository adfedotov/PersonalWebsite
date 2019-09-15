const fs = require('fs');

module.exports = getContent;

function getContent() {
  try {
    const content = JSON.parse(fs.readFileSync('./config/content.json'));
    return content;
  } catch (err) {
    console.log(err);
  }
  
  return {};
}