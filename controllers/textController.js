databaseManager = require("./databaseManager")

module.exports = class TextController {
  constructor(){

  }
  showHelloWorld (req, res) {
    return res.send('Now this is something');
  }

  showHelloWorld2 (req, res) {
    return res.send('Hello World!2');
  }
}
