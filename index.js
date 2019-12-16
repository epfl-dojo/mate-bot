const TeleBot = require('telebot');
const Secrets = require('./secrets.json');
const bot = new TeleBot(Secrets.BOT_TOKEN);
const fs = require('fs')
const usersDataFile = './users_data.json'
var users = "";
DoFileExists()
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

bot.on([`/${commands.list[0].name}`], (msg) => {
  msg.reply.text("Hello! I am Club Mate Bot, I'm here to help you manage your mate consumption. Please type '/help' to begin!")
  CreateChatList(msg)
  CreateUserList(msg)
});

bot.on([`/${commands.list[1].name}`], (msg) => {
  helpmsg = ''

  for (var i = 0;i < commands.list.length;i++) {
    helpmsg += `${commands.list[i].name} : ${commands.list[i].desc} \n`
  }

  msg.reply.text(helpmsg)
});

bot.start();

function CreateUserList(msg){
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

async function CreateChatList(msg){
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

function DoFileExists(usersDataFile){
  try {
    if (fs.existsSync('users_data.json')) {
      console.log("File exists!")
    } else {
      fs.appendFileSync('users_data.json', '{}', 'utf8');
    }
    users = fs.readFileSync(usersDataFile, 'utf8')
  } catch(err) {

  }
}
function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}
