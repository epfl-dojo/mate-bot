const TeleBot = require('telebot');
const Secrets = require('./secrets.json');
const bot = new TeleBot(Secrets.BOT_TOKEN);
const fs = require('fs')
const usersDataFile = './users_data.json'
var users = {};
if (!doesFileExists(usersDataFile)){
  console.log("File doesn't exist!")
  fs.appendFileSync('users_data.json', '{}', 'utf8');
}
users = fs.readFileSync(usersDataFile, 'utf8')

bot.on('text', (msg) => {
  msg.reply.text(msg.text)
  createChatList(msg)
  createUserList(msg)
})

var commands = {
                  'list': [
                    {
                      'name': "start",
                      'desc': 'Welcome command'
                    },
                    {
                      'name': "help",
                      'desc': 'Shows a list of available commands'
                    }
                  ]
                }

// /start command
bot.on([`/${commands.list[0].name}`], (msg) => {
  msg.reply.text("Hello! I am Club Mate Bot, I'm here to help you manage your mate consumption. Please type '/help' to begin!")
});

// /help command
bot.on([`/${commands.list[1].name}`], (msg) => {
  helpmsg = ''
  for (var i = 0;i < commands.list.length;i++) {
    helpmsg += `${commands.list[i].name} : ${commands.list[i].desc} \n`
  }
  msg.reply.text(helpmsg)
});

bot.start();

function createUserList(msg){
  console.log(users);
  if(!users[msg.chat.id][msg.from.id]) {
    users[msg.chat.id][msg.from.id] = {
      'wallet' : 0,
      'username' : msg.from.username,
      'firstname' : msg.from.first_name
    }
      console.debug(users)
      fs.writeFile(usersDataFile, JSON.stringify(users, null, 2), 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
      })
    }
  }

async function createChatList(msg){
    if (!users[msg.chat.id]) {
      users = {
        [msg.chat.id]: {
        }
      }
      fs.writeFile(usersDataFile, JSON.stringify(users, null, 2), 'utf8', function (err) {
        if (err) {
          return console.log(err);
        }
      })
    }
  console.log(users)
}

function doesFileExists(filePath){
  try {
    if (fs.existsSync(filePath)) {
      return true
    } else {
      return false
    }
  } catch(err) {
    console.error(err)
  }
}
