const http = require('http')
const Bot = require('messenger-bot')
const chalk = require('chalk')
const bot_handler =require('./bot.js');
const config = require('config.json')
let bot = new Bot(config.bot);



bot.on('error', (err) => {
  console.error(err.message)
})

bot.on('message', (payload, reply) => {
	console.log(chalk.blue(JSON.stringify(payload)));
	bot_handler(payload, (response)=>{
		console.log(chalk.yellow(JSON.stringify(response)) );
		reply( response, (err) => {
			if (err) console.error('ERR',err);
		})
	});
})

http.createServer(bot.middleware()).listen(config.port)
console.log(`Echo bot server running at port ${config.port}.`)

