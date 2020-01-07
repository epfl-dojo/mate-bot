const TeleBot = require('telebot')
const Secrets = require('./secrets.json')
const fs = require('fs')
const ascii = require('ascii-table')
const bot = new TeleBot(Secrets.BOT_TOKEN)
const utils = require('./utils')
const table = new ascii().setHeading("Users", "Wallets");

var users = utils.initializeUsers()
var prices = utils.initializePrices()

bot.on('text', async (msg) => {
  users = await utils.createChatList(msg, users)
  users = await utils.createUserList(msg, users)
  prices = await utils.createPricesList(msg, prices)
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
		},
		{
			'name': "charge",
			'desc': 'Charge amount on someone'
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
            utils.writePricesDataToFile(prices)
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
  utils.writeUsersDataToFile(users)
})

// /buybox command
bot.on(`/${commands.list[4].name}`, (msg) => {
  users[msg.chat.id][msg.from.id].wallet -= parseInt(prices[msg.chat.id].box)
  utils.writeUsersDataToFile(users)
  msg.reply.text(`Thanks ${users[msg.chat.id][msg.from.id].username} just bought a box of club-mate ! :)\nYou currently have ${users[msg.chat.id][msg.from.id].wallet} in your wallet!`)
})

// /balance command
bot.on(`/${commands.list[5].name}`, (msg) => {
  let tmpMsg = ""
  Object.values(users[msg.chat.id]).forEach(element =>
    table.addRow(`@${element.username}`, `${element.wallet}`)
)
  bot.sendMessage(msg.chat.id, '```\n' + table.toString() + '\n```', {parseMode: 'Markdown'})
})

// /send command
bot.on(new RegExp('^\/'+`${commands.list[6].name}`+' (@.+) (\\d+)'), (msg, props) => {
  let user = props.match[1].trim().substring(1)
  let amount = props.match[2].trim()
  let userid = utils.findUserIdByUsername(users[msg.chat.id], user)

  if (amount > 0) {
    try {
      users[msg.chat.id][userid].wallet += parseInt(amount)
      users[msg.chat.id][msg.from.id].wallet -= parseInt(amount)
      utils.writeUsersDataToFile(users)
      msg.reply.text(`@${users[msg.chat.id][msg.from.id].username} gave ${amount} CHF to @${users[msg.chat.id][userid].username}`)
    } catch (err) {
      msg.reply.text(`@${user} is not a user in your group/chat!`)
    }
  } else {
    msg.reply.text(`${amount} is an insufficient/invalid amount`)
  }
})

//

// /charge
bot.on([new RegExp('^\/'+`${commands.list[7].name}`+' (@.+) (-?\\d+)'), new RegExp('^\/'+`${commands.list[7].name}`+' (-?\\d+)')], (msg, props) => {
  if (props.match[2]) {
    let user = props.match[1].trim().substring(1)
    let amount = props.match[2].trim()
    let userid = utils.findUserIdByUsername(users[msg.chat.id], user)

    if (amount != 0) {
      try {
        users[msg.chat.id][userid].wallet += parseInt(amount)
        utils.writeUsersDataToFile(users)
        let walletOperationMesage = ''
        if (amount > 0) {
          walletOperationMesage = `@${users[msg.chat.id][msg.from.id].username} has deposited ${amount} CHF into @${users[msg.chat.id][userid].username}'s wallet`
        } else {
          walletOperationMesage = `@${users[msg.chat.id][msg.from.id].username} has withdrawn ${amount.substring(1)} CHF from @${users[msg.chat.id][userid].username}'s wallet`
        }
        walletOperationMesage += `\nYou can use /balance to see wallets statuses`
        msg.reply.text(walletOperationMesage)
      } catch (err) {
        msg.reply.text(`@${user} is not a user in your group/chat!`)
      }
    } else {
      msg.reply.text(`${amount} is an invalid amount`)
    }
  } else {
    let amount = props.match[1].trim()
    if (amount != 0) {
        users[msg.chat.id][msg.from.id].wallet += parseInt(amount)
        utils.writeUsersDataToFile(users)
        msg.reply.text(`@${users[msg.chat.id][msg.from.id].username} charged himself ${amount} CHF`)
    } else {
      msg.reply.text(`${amount} is an invalid amount`)
    }
  }
})
bot.start()
