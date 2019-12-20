const TeleBot = require('telebot')
const Secrets = require('./secrets.json')
const fs = require('fs')
const bot = new TeleBot(Secrets.BOT_TOKEN)
const dh = require('./dataHandle')

var users = dh.initializeUsers()
var prices = dh.initializePrices()

bot.on('text', async (msg) => {
  users = await dh.createChatList(msg, users)
  users = await dh.createUserList(msg, users)
  prices = await dh.createPricesList(msg, prices)
})

var commands = {
  'list': [{
      'name': "start",
      'desc': 'Welcome command'
    },
    {
      'name': "help",
      'desc': 'Shows a list of available commands'
    },
    {
      'name': "setprice",
      'desc': 'Sets the price of a box or a bottle of mate'
    },
    {
      'name': "drink",
      'desc': 'The user drinks a club-mate.'
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

// /setprice command
bot.on([`/${commands.list[2].name}`], (msg) => {
  var args = msg.text.split(" ")

  if (args[1] && args[2]) {
    if (isNaN(args[2])) {
      msg.reply.text("You must type a number!")
    } else {
      switch (args[1]) {
        case "box":
            prices[msg.chat.id].box = parseInt(args[2])

            fs.writeFile('./prices_data.json', JSON.stringify(prices, null, 2), 'utf8', function (err) {
              if (err) {
                return console.log(err)
              }
            })

            msg.reply.text(`The price of a box of mate is now ${prices[msg.chat.id].box} .-`)
          break;
        case "bottle":
            prices[msg.chat.id].bottle = parseInt(args[2])

            fs.writeFile('./prices_data.json', JSON.stringify(prices, null, 2), 'utf8', function (err) {
              if (err) {
                return console.log(err)
              }
            })

            msg.reply.text(`The price of a bottle of mate is now ${prices[msg.chat.id].bottle} .-`)
          break;
        default:
          msg.reply.text(`${args[1]} is invalid!`)
      }
    }
  }
});

// /drink command
bot.on([`/${commands.list[3].name}`], (msg) => {
  msg.reply.text("Cheers " + users[msg.chat.id][msg.from.id].username + "!!")
  console.log(users[msg.chat.id][msg.from.id].wallet);
  users[msg.chat.id][msg.from.id].wallet += 2
  fs.writeFile('./users_data.json', JSON.stringify(users, null, 2), 'utf8', function(err) {
    if (err) {
      return console.log(err)
    }
  })
});

// bot.on(/^\/send(.+)$/, (msg, props) => {
//   const value = props.match[1].trim()
//   console.log(value)
// })

bot.start()
