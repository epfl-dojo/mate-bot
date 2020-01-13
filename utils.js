const fs = require('fs')
const usersDataFile = './users_data.json'
const pricesDataFile = './prices_data.json'
module.exports = {
  checkUsername: async function (msg, usersObj) {
    if (msg.from.username !== usersObj[msg.chat.id][msg.from.id].username ||
        msg.from.first_name !== usersObj[msg.chat.id][msg.from.id].firstname ||
        msg.from.last_name !== usersObj[msg.chat.id][msg.from.id].lastname) {
      // Username or first name has changed
      usersObj[msg.chat.id][msg.from.id].username = msg.from.username
      usersObj[msg.chat.id][msg.from.id].firstname = msg.from.first_name
      usersObj[msg.chat.id][msg.from.id].lastname = msg.from.last_name
      module.exports.writeUsersDataToFile(usersObj)
    }
    return usersObj
  },
  createUserList: async function (msg, usersObj) {
    if(!usersObj[msg.chat.id][msg.from.id]) {
      usersObj[msg.chat.id][msg.from.id] = {
        'wallet' : 0,
        'username' : msg.from.username,
        'firstname' : msg.from.first_name,
        'lastname' : msg.from.last_name
      }
      module.exports.writeUsersDataToFile(usersObj)
    }
    return usersObj
  },
  createChatList: function (msg, usersObj) {
    if (!usersObj[msg.chat.id]) {
      usersObj[msg.chat.id] = {}
      module.exports.writeUsersDataToFile(usersObj)
    }
    return usersObj
  },
  createPricesList: function (msg, usersObj) {
    if (!usersObj[msg.chat.id]) {
      usersObj[msg.chat.id] = {
        'box' : 40,
        'bottle' : 2
      }
      module.exports.writePricesDataToFile(usersObj)
    }
    return usersObj
  },
  writeUsersDataToFile: function (items) {
    module.exports.writeFile(usersDataFile, items)
  },
  writePricesDataToFile: function (items) {
    module.exports.writeFile(pricesDataFile, items)
  },
  writeFile: function (filepath, item) {
    fs.writeFile(filepath, JSON.stringify(item, null, 2), 'utf8', function (err) {
      if (err) {
        return console.log(err)
      }
    })
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
    let tmp = fs.readFileSync(pricesDataFile, 'utf8')
    // Let transform the string to an object, see https://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object
    return JSON.parse(tmp)
  },
  createUsersDataFile: function () {
    fs.appendFileSync(usersDataFile, '{}', 'utf8')
    console.log(usersDataFile, 'should exist now...')
  },
  createPricesDataFile: function () {
    fs.appendFileSync(pricesDataFile, '{}', 'utf8')
    console.log(pricesDataFile, 'should exist now...')
  },
  initializeUsers: function () {
    if (!module.exports.doesFileExists(usersDataFile)) {
      console.log("File doesn't exist!")
      module.exports.createUsersDataFile()
    }
    return module.exports.readUsersData()
  },
  initializePrices: function () {
    if (!module.exports.doesFileExists(pricesDataFile)) {
      console.log("File doesn't exist!")
      module.exports.createPricesDataFile()
    }
    return module.exports.readPricesData()
  },
  findUserIdByUsername: function (data, username) {
    return Object.keys(data).find( k => data[k]['username'] === username )
  }
}
