const databaseManager = require("./databaseManager")
const db = databaseManager.getDB();

const fs = require('fs');

var Minizip = require('minizip-asm.js');

module.exports = {
  uploadFile: (req, res, next) => {
    let fileName = req.body.fileName;
    let username = req.body.username;
    let password = req.body.password;
    let file = req.file;
    file.fieldname = file.originalname;

    let mz = new Minizip();
    mz.append(file.originalname, file.buffer, {
      password: password
    });
    let dir = "./files/" + username;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFile(dir + "/" + file.originalname, new Buffer(mz.zip()), (err) => {
      if(err) return next(err);
      res.send("File saved correctly");
    });

  },
  listFiles: (req, res, next) => {
    let username = req.query.username;

    let dir = "./files/" + username;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.readdir(dir, function (err, files) {
      //handling error
      if (err) {
          next(new Error("Unable to read user directory"))
      }
      let fileNames = [];
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          fileNames.push(file);
      });

      res.send({files: fileNames, message: "correct"});

    });
  },
  downloadFile: (req, res, next) => {
    let username = req.query.username;
    let password = req.query.password;
    let fileName = req.query.fileName;


    let dir = "./files/" + username;
    //TODO replace with async
    let buffer = fs.readFileSync(dir + "/" + fileName);
    let mz = new Minizip(buffer);
    res.send({
      file: mz.extract(fileName, {password: password})
    });
  }
}


/*

const gzip = zlib.createGzip();
const fs = require('fs');
const inp = fs.createReadStream('input.txt');
const out = fs.createWriteStream('input.txt.gz');

inp.pipe(gzip).pipe(out);

*/
