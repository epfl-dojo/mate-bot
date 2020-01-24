# Mate Bot

[Telegram](https://t.me) bot to manage the consumption of [Club Mate](https://fr.wikipedia.org/wiki/Club-Mate) between different people.

# Setup

1. Communicate with [@BotFather](https://t.me/BotFather) to create a bot and get the token.
1. Rename `secrets.sample.json` to `secrets.json`.
1. Replace the `BOT_TOKEN` key in the `secrets.json` file with the bot token.
1. Go on [Giphy get api key](https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key) and follow the instructions to get an API key.
1. Replace the `API_KEY` key in the `secrets.json` file with the api key you were provided with.
1. Run `npm i` to install the node dependencies.
1. Run script with `node index.js`.

# Commands

  * `/start` → Welcome :)
  * `/about` → Shows bot version, bug report, etc...
  * `/help` → Shows a list of all available commands with their description.
  * `/send <@username> <amount>` → Send a specific amount of money to another person.
  * `/balance` → Shows the status of everyone's wallet.
  * `/setoption <item> <value>` → Change the value of an item (price of box, bottle, currency...).
  * `/option` → List current options's values.
  * `/buybox` → The user buys a case of club-mate.
  * `/drink` → The user drinks a club-mate.
  * `/charge [@username] <value>`
