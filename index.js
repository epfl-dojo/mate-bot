const TeleBot = require('telebot');
const Secrets = require('./secrets.json');
const bot = new TeleBot(Secrets.BOT_TOKEN);

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

});

bot.on([`/${commands.list[1].name}`], (msg) => {
  helpmsg = ''

  for (var i = 0;i < commands.list.length;i++) {
    helpmsg += `/${commands.list[i].name} : ${commands.list[i].desc} \n`
  }

  msg.reply.text(helpmsg)
});

bot.start();
