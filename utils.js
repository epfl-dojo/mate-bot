const fs = require('fs')
const usersDataFile = './data/data_users.json'
const optionsDataFile = './data/data_options.json'
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
  createOptionsList: function (msg, usersObj) {
    if (!usersObj[msg.chat.id]) {
      usersObj[msg.chat.id] = {
        'box' : 40,
        'bottle' : 2,
        'currency' : '$'
      }
      module.exports.writeOptionsDataToFile(usersObj)
    }
    return usersObj
  },
  writeUsersDataToFile: function (items) {
    module.exports.writeFile(usersDataFile, items)
  },
  writeOptionsDataToFile: function (items) {
    module.exports.writeFile(optionsDataFile, items)
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
  readOptionsData: function () {
    let tmp = fs.readFileSync(optionsDataFile, 'utf8')
    // Let transform the string to an object, see https://stackoverflow.com/questions/45015/safely-turning-a-json-string-into-an-object
    return JSON.parse(tmp)
  },
  createUsersDataFile: function () {
    fs.appendFileSync(usersDataFile, '{}', 'utf8')
    console.log(usersDataFile, 'should exist now...')
  },
  createOptionsDataFile: function () {
    fs.appendFileSync(optionsDataFile, '{}', 'utf8')
    console.log(optionsDataFile, 'should exist now...')
  },
  initializeUsers: function () {
    if (!module.exports.doesFileExists(usersDataFile)) {
      console.log("File doesn't exist!")
      module.exports.createUsersDataFile()
    }
    return module.exports.readUsersData()
  },
  initializeOptions: function () {
    if (!module.exports.doesFileExists(optionsDataFile)) {
      console.log("File doesn't exist!")
      module.exports.createOptionsDataFile()
    }
    return module.exports.readOptionsData()
  },
  findUserIdByUsername: function (data, username) {
    return Object.keys(data).find( k => data[k]['username'] === username )
  }
}
