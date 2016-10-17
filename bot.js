const botBuilder = require('claudia-bot-builder');
const Bot = require('messenger-bot');
const fbTemplate = botBuilder.fbTemplate;
const states = require('./states.js');


var Filejson = require("filejson");
var file1 = new Filejson();

file1.load("../storage.json", proceed); // file1.json contains {}

Object.prototype[Symbol.iterator] = function*() { for(let key of Object.keys(this)) {yield([ key, this[key] ])} }


var storage;
function proceed(error, _file) {
	if (error) {
		console.error(error);
		return;
	}
	storage = _file;
}
var userStates = {};

var getCheatFn=(env)=>{
	let fns = {
		'!RESET':env=>{env.context={};return env;},
		'!WELCOME':env=>{env.context.state='welcome';return env;},
	};
	if(env.message.text && fns[env.message.text])
 		return (env)=>new Promise(function(resolve, reject) {
			return resolve(fns[env.message.text](env));
	}); };

return module.exports = (request, cb) => {
	setImmediate(function(){storage.save(_=>_);})

	if(!storage.contents){console.error('db not loaded');return {text:'internal error, db not loaded'}}
	if(!request.sender){console.error(request);return {text:'missing sender'};}

	user = storage.contents[request.sender.id]
	if(!user) user = storage.contents[request.sender.id] = {context: {state: 'welcome'}, access:0};
	user.access++;

	var obj = {
		request: request,
		message:request.message,
		context:user.context,
		entities: [],
	};
	const cheat = getCheatFn(obj);

	console.log(`for user ${request.sender.id} status IS ${user.context.state}`);
	return (cheat || states[user.context.state] || states.welcome)(obj).then((response)=>{
		user.context = response.context;
		// let message = new fbTemplate.text(`[ ${user.context.state} ] ${response.message}`);
		if(response.exactMessage)
			return cb(response.exactMessage);
		let message = new fbTemplate.text(response.message);
		if(response.options){
			for(let [key,val] of response.options){
				message = message.addQuickReply(val.text, key);
			}
			message = message.get();
		}
		return cb(message);
	}).catch((err)=>console.error(err));


};
