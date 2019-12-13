const TeleBot = require('telebot');
const Secrets = require('./secrets.json');
const bot = new TeleBot(Secrets.BOT_TOKEN);

bot.on(['/start'], (msg) => {

  msg.reply.text("Hello! I am Club Mate Bot, I'm here to help you manage your mate consumption. Please type '/help' to begin!")

});

bot.start();
