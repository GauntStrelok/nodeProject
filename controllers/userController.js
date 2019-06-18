const databaseManager = require("./databaseManager")
const db = databaseManager.getDB();

const jwt = require('jwt-simple');

const crypto = require('crypto');





module.exports = {
  login: (req, res) => {
    let body = req.body;
    //get username

    let user = db.get('users').find({username: body.username}).value();
    if(!user) return res.status('500').send({message: 'user not found'});//this can be an exploit to get usernames
    let hmac = crypto.createHmac('sha256', 'applicationSecret');
    let hash = hmac.update(body.password).digest('hex');



    if(user.password === hash) {

      let random = Math.random() * new Date().getTime();
      random = random.toString();
      db.get('users').find({username: body.username}).assign({jwt: random}).write();
      res.cookie('secret', random);
      res.send(random);
      /*db.get('posts')
    .find({ title: 'low!' })
    .assign({ title: 'hi!'})
    .write()*/
    } else {
      res.status('500').send({message: 'incorrect password'});//this can be a exploit to get usernames
    }
  },
  register: (req, res) => {
    let body = req.body;

    let user = db.get('users').find({username: body.username}).value();
    if(user) return res.status('500').send({message: 'There is a user with that name already'});

    let hmac = crypto.createHmac('sha256', 'applicationSecret');
    let hash = hmac.update(body.password).digest('hex');

    let random = Math.random() * new Date().getTime();
    random = random.toString();

    db.get('users').push({
      username: body.username,
      password: hash,
      jwt: random,
      files: []
    }).write();

    res.send(random);
  },

  logout: (req, res) => {
    let body = req.body;
    db.get('users').find({username: body.username}).assign({jwt: ""}).write();
    res.send("ok")
  },

  validateJsonWebToken: (auth, username) => {
    let user = db.get('users').find({username: username}).value();
    try {
      var decoded = jwt.decode(auth, user.jwt);
      return decoded.username === user.username;
    } catch (e) {
      return false;
    }
  }
}
