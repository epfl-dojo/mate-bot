# Mate Bot

[Telegram](https://t.me) bot to manage the consumption of [Club Mate](https://fr.wikipedia.org/wiki/Club-Mate) between different people.

# Setup

1. Communicate with [@BotFather](https://t.me/BotFather) to create a bot
and get the token.
1. Rename `secrets.sample.json` to `secrets.json`.
1. Replace the `BOT_TOKEN` key in the `secrets.json` file with the
   bot token.
1. Use `npm i` to create node module file.
1. Lancer le script `node index.js`.

# Commands

  * `/start` → Welcome :)
  * `/help` → Shows a list of all available commands with their description.
  * `/send [amount]` → Send a specific amount of money to another person.
  * `/balance` → Shows the status of everyone's wallet.
  * `/setprice [item] [amount]` → Change the price of an item (price of box or bottle...).
  * `/price` → List of current prices.
  * `/buybox` → The user buys a case of club-mate.
  * `/drink` → The user drinks a club-mate.
