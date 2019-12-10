const TeleBot = require('telebot');
const Secrets = require('./secrets.json')
const bot = new TeleBot(Secrets.BOT_TOKEN);
bot.on('text', (msg) => msg.reply.text(msg.text));

bot.start();
