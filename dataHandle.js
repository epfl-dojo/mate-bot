const fs = require('fs')
const usersDataFile = './users_data.json'
const usersPricesFile = './prices_data.json'
module.exports = {
  createUserList: async function (msg, usersObj) {
    if(!usersObj[msg.chat.id][msg.from.id]) {
      usersObj[msg.chat.id][msg.from.id] = {
        'wallet' : 0,
        'username' : msg.from.username,
        'firstname' : msg.from.first_name
      }
        fs.writeFile(usersDataFile, JSON.stringify(usersObj, null, 2), 'utf8', function (err) {
          if (err) {
            return console.log(err)
          }
        })
      }
      return usersObj
    },
  createChatList: function (msg, usersObj) {
    if (!usersObj[msg.chat.id]) {
      usersObj[msg.chat.id] = {}
      fs.writeFileSync(usersDataFile, JSON.stringify(usersObj, null, 2), 'utf8', function (err) {
        if (err) {
          return console.log(err)
        }
      })
    }
    return usersObj
  },
  createPricesList: function (msg, usersObj) {
    if (!usersObj[msg.chat.id]) {
      usersObj[msg.chat.id] = {
        'box' : 40,
        'bottle' : 2
      }
      fs.writeFileSync(usersPricesFile, JSON.stringify(usersObj, null, 2), 'utf8', function (err) {
        if (err) {
          return console.log(err)
        }
      })
    }
    return usersObj
  },
    doesFileExists: function (filePath){
     try {
       if (fs.existsSync(filePath)) {
         return true
       } else {
         return false
       }
     } catch(err) {
       console.error(err)
     }
   },
  readUsersData: function () {
    let tmp = fs.readFileSync(usersDataFile, 'utf8')
    // Let transform the string to an object, see https://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object
    return JSON.parse(tmp)
  },
  readPricesData: function () {
    let tmp = fs.readFileSync(usersPricesFile, 'utf8')
    // Let transform the string to an object, see https://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object
    return JSON.parse(tmp)
  },
  createUsersDataFile: function () {
    fs.appendFileSync(usersDataFile, '{}', 'utf8')
    console.log(usersDataFile, 'should exist now...')
  },
  createPricesDataFile: function () {
    fs.appendFileSync(usersPricesFile, '{}', 'utf8')
    console.log(usersPricesFile, 'should exist now...')
  },
  initializeUsers: function () {
    if (!module.exports.doesFileExists(usersDataFile)) {
      console.log("File doesn't exist!")
      module.exports.createUsersDataFile()
    }
    return module.exports.readUsersData()
  },
  initializePrices: function () {
    if (!module.exports.doesFileExists(usersPricesFile)) {
      console.log("File doesn't exist!")
      module.exports.createPricesDataFile()
    }
    return module.exports.readPricesData()
  },
}
