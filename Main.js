const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const Router = require('./router')
const bodyParser = require('body-parser')
const multer  = require('multer')
const upload = multer()

let router = new Router();

//db
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)

//jwt
const jwt = require('jwt-simple');

const userController = require("./controllers/userController")
const filesManager = require("./controllers/filesManager")

//app.get('/something', (req, res) => res.send('Hello World!'))
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


//statics entries
app.use(express.static('static/views'));
app.use('/lib', express.static('static/lib'));

//image upload
app.post('/file', upload.single('file'), function (req, res, next) {
  next('route')
});

//authorization for entries
app.use((req, res, next) => {
  if(req.url === "/login" || req.url === "/register") return next('route'); //the only exception is the login as we need the user to be able to do it any time

  if (!req.headers.authorization) {
    return next(new Error('Call without authorization ' + req.url + '  ' + req.method));
  } else {
    if(userController.validateJsonWebToken(req.headers.authorization, req.query.username || req.body.username)) {
      return next('route');
    } else {
      return res.status(403).send();
    };

  }
});

//router
app.use(function (req, res, next) {
  router.navigate(req, res, next);
  //res.status(404).send("Sorry can't find that!")
});

//calls on next with an error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke:   ' + err.message);
  next(err);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
