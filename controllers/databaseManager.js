const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db/db.json')
const db = low(adapter)

module.exports = {
  initDB: (req, res) => {
    let exists = db.get('exists').value();
    if(!exists) {
      db.defaults({exists: true, users: [], stringsCalculated: []}).write();
      res.send('Database created correctly');
    } else {
      res.send('Database already created');
    }
  },
  getDB: () => db
}
