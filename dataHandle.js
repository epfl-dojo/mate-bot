const fs = require('fs')
const usersDataFile = 'users_data.json'
module.exports = {
  createUserList: async function (msg, usersObj) {
    console.log(usersObj)
    if(!usersObj[msg.chat.id][msg.from.id]) {
      usersObj[msg.chat.id][msg.from.id] = {
        'wallet' : 0,
        'username' : msg.from.username,
        'firstname' : msg.from.first_name
      }
        console.debug(usersObj)
        fs.writeFile(usersDataFile, JSON.stringify(usersObj, null, 2), 'utf8', function (err) {
          if (err) {
            return console.log(err)
          }
        })
      }
      return usersObj
    },
  createChatList: async function (msg, usersObj) {
    if (!usersObj[msg.chat.id]) {
      usersObj = {
        [msg.chat.id]: {
        }
      }
      fs.writeFile(usersDataFile, JSON.stringify(usersObj, null, 2), 'utf8', function (err) {
        if (err) {
          return console.log(err)
        }
      })
    }
    console.log(usersObj)
    return usersObj
  },
  doesFileExists: function () {
    console.log('Does', usersDataFile, 'exists ?')
    try {
      if (fs.existsSync(usersDataFile)) {
        console.log(' → yes')
        return true
      } else {
        console.log(' → no')
        return false
      }
    } catch(err) {
      console.error(err)
    }
  },
  readUsersData: function () {
    return fs.readFileSync(usersDataFile, 'utf8')
  },
  createUsersDataFile: function () {
    fs.appendFileSync(usersDataFile, '{}', 'utf8')
    console.log(usersDataFile, 'should exist now...')
  },
  initializeUsers: function () {
    if (!module.exports.doesFileExists()) {
      console.log("File doesn't exist!")
      module.exports.createUsersDataFile()
    }
    return module.exports.readUsersData()
  }
}
