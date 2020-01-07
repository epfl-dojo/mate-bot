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
			'desc': 'Welcome command.'
		},
		{
			'name': "help",
			'desc': 'Shows a list of available commands.'
		},
		{
			'name': "setprice",
			'desc': 'Sets the price of a box or a bottle of mate.'
		},
		{
			'name': "drink",
			'desc': 'The user drinks a club-mate.'
		},
		{
			'name': "buybox",
			'desc': 'The user buys a box of club mate.'
		},
		{
			'name': "balance",
			'desc': 'Shows the status of everyone\'s wallet.'
		},
		{
			'name': "send",
			'desc': 'Send money to another person!'
		}
	]
}

// /start command
bot.on(`/${commands.list[0].name}`, (msg) => {
  msg.reply.text("Hello! I am Club Mate Bot, I'm here to help you manage your mate consumption. Please type '/help' to begin!")
})

// /help command
bot.on(`/${commands.list[1].name}`, (msg) => {
  helpmsg = ''
  for (var i = 0;i < commands.list.length;i++) {
    helpmsg += `/${commands.list[i].name} : ${commands.list[i].desc} \n`
  }
  msg.reply.text(helpmsg)
})

// /setprice command
bot.on(`/${commands.list[2].name}`, (msg) => {
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
})

// /drink command
bot.on(`/${commands.list[3].name}`, (msg) => {
  msg.reply.text("Cheers " + users[msg.chat.id][msg.from.id].username + "!!")
  console.log(users[msg.chat.id][msg.from.id].wallet);
  users[msg.chat.id][msg.from.id].wallet += 2
  fs.writeFile('./users_data.json', JSON.stringify(users, null, 2), 'utf8', function(err) {
    if (err) {
      return console.log(err)
    }
  })
})

// /buybox command
bot.on(`/${commands.list[4].name}`, (msg) => {
  users[msg.chat.id][msg.from.id].wallet -= parseInt(prices[msg.chat.id].box)
  fs.writeFile('./users_data.json', JSON.stringify(users, null, 2), 'utf8', function(err) {
    if (err) {
      return console.log(err)
    }
  })
  msg.reply.text(`Thanks ${users[msg.chat.id][msg.from.id].username} just bought a box of club-mate ! :)\nYou currently have ${users[msg.chat.id][msg.from.id].wallet} in your wallet!`)
})

// /balance command
bot.on(`/${commands.list[5].name}`, (msg) => {
  let tmpMsg = ""
  Object.values(users[msg.chat.id]).forEach(element =>
    tmpMsg += `@${element.username} → ${element.wallet}.-\n`
  )
  msg.reply.text(tmpMsg)
})

// /send command
bot.on(new RegExp('^\/'+`${commands.list[6].name}`+' (@.+) (\\d+)'), (msg, props) => {
  let user = props.match[1].trim().substring(1)
  let amount = props.match[2].trim()
  let userid = dh.findUserIdByUsername(users[msg.chat.id], user)

  console.log(user, amount)

  if (amount > 0) {
    try {
      users[msg.chat.id][userid].wallet += parseInt(amount)
      users[msg.chat.id][msg.from.id].wallet -= parseInt(amount)

      fs.writeFile('./users_data.json', JSON.stringify(users, null, 2), 'utf8', function(err) {
        if (err) {
          return console.log(err)
        }
      })
      msg.reply.text(`@${users[msg.chat.id][msg.from.id].username} gave ${amount} CHF to @${users[msg.chat.id][userid].username}`)
    } catch (err) {
      msg.reply.text(`${user} is not a user in your group/chat!`)
    }
  } else {
    msg.reply.text(`${amount} is an insufficient/invalid amount`)
  }



})



bot.start()
