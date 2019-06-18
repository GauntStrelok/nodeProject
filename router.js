const TextController = require("./controllers/textController")
const databaseManager = require("./controllers/databaseManager")
const userController = require("./controllers/userController")
const filesManager = require("./controllers/filesManager")
let textController = new TextController();

const routes = {
  '/something2' : {
    'GET': textController.showHelloWorld2
  },
  '/something' : {
    'GET': textController.showHelloWorld
  },
  '/initDB': {
    'POST': databaseManager.initDB
  },
  '/login': {
    'POST': userController.login
  },
  '/logout': {
    'POST': userController.logout
  },
  '/register': {
    'POST': userController.register
  },
  '/file': {
    'POST': filesManager.uploadFile,
    'GET': filesManager.downloadFile
  },
  '/files': {
    'GET': filesManager.listFiles
  }
}


class Router {
  navigate (req, res, next) {
    let url = req.url.split('?')[0];
    let functionToCall = routes && routes[url] && routes[url][req.method];
    //console.log(req.url, req.method, routes[req.url], functionToCall);
    if(functionToCall) {
      functionToCall(req, res, next);
    } else {
      console.log("route not found:", url, req.method)
      next(new Error("Route not found"));
    }
  }
}

module.exports = Router
