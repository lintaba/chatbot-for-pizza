const botBuilder = require('claudia-bot-builder');
const Bot = require('messenger-bot');
const fbTemplate = botBuilder.fbTemplate;
const _ = require('lodash');

const eater = require('./eater.js');

return module.exports = {

	welcome(env){ return new Promise(function(resolve, reject) {
		let options = {
			ORDER_PIZZA:{text: "Order a pizza", context:{state: 'newItem', type: 'pizza'}},
			ORDER_COFFEE:{text: "Order a coffee", context:{state: 'newItem', type: 'coffee'}},
		};
		let message = 'Welcome!'
		if(env.context.items){
			message += `\nThere is ${env.context.items.length} items in the cart.`;
			options.ORDER_FINISH = {text: "Continue", context:{state: 'setAddress'}};
		}


		if(env.message && env.message.quick_reply && options[env.message.quick_reply.payload]){
			let option = options[env.message.quick_reply.payload];
			env.context = _.merge(env.context,option.context);
			delete env.message;
			return module.exports[env.context.state](env).then(_env=>resolve(_env));
		}

		env.message = message;
		env.options = options;

		return resolve(env);
	}); },

	newItem(env){ return new Promise(function(resolve, reject) {

		env.context.ingredients_add= [];
		env.context.size = 'medium'
		env.context.price = Math.random()*4+1;
		env.context.base = 'plain'
		env.context.extra_note = ''


		env.context.state = 'modifyItem';
		return module.exports[env.context.state](env).then((_env)=>{
			console.log(arguments);
			_env.message = `New ${env.context.type} created`;
			return resolve(_env)
		});
		// env.message = `Make your own ${env.context.type}! (add {topping}, remove {topping})`;

		// let options = {
		// 	MODIFY_OK:{text: "Done", message:'done'},
		// 	MODIFY_DELETE:{text: "Remove", message:'cancel'},
		// };
		// if(env.context.size != 'small'){
		// 	options.MODIFY_SMALL = {text: "Small size", message:'make it small'};
		// }
		// if(env.context.size != 'medium'){
		// 	options.MODIFY_MEDIUM = {text: "Medium size", message:'make it medium'};
		// }
		// if(env.context.size != 'big'){
		// 	options.MODIFY_BIG = {text: "Big size", message:'make it big'};
		// }
		// env.options = options;

		// return resolve(env);
	}); },

	modifyItem(env){ return new Promise(function(resolve, reject) {
		let message = '';

		let options = {
			// MODIFY_ADD_VEGIE : {text: "Add vegies", message:'show vegie'},
			// MODIFY_ADD_CHEESE : {text: "Add cheese", message:'show cheese'},
			// MODIFY_ADD_MEAT : {text: "Add meat", message:'show meat'},
			// MODIFY_ADD_DAIRY : {text: "Add dairy", message:'show dairy'},
			// MODIFY_ADD_SWEETENER : {text: "Add sweetener", message:'show sweetener'},
			// MODIFY_ADD_MEAT : {text: "Add meat", message:'show meat'},
			MODIFY_OK:{text: "Done", message:'done'},
			MODIFY_DELETE:{text: "Remove", message:'cancel'},
			MODIFY_SMALL : {text: "Small size", message:'make it small'},
			MODIFY_MEDIUM : {text: "Medium size", message:'make it medium'},
			MODIFY_BIG : {text: "Big size", message:'make it big'},
		}



		if(env.message && env.message.quick_reply && options[env.message.quick_reply.payload]){
			let option = options[env.message.quick_reply.payload];
			env.message.text = option.message;
		}else
		if(env.message && env.message.quick_reply && !env.message.text){
			env.message.text = env.message.quick_reply.payload;
		}

		var m,n;

		if(env.message && env.message.text){
			m = env.message.text.toLowerCase();
			m = m.match(/^(show|add|cancel|with|without|no|remove|ready|ok|done|make it)\s*(.*)$/i);
		}

		if(!m){
			message = `Make your own ${env.context.type}! (add {topping}, remove {topping})`;
		}else
		switch(m[1]){
			case 'show':
			// case 'meat':
			// case 'vegie':
			// case 'cheese':
			// case 'dairy':
			// case 'sweetener':
			// 	if(!env.context.ingredients_add)
			// 		env.context.ingredients_add = [];
			// 	let items = {
			// 		pizza:{
			// 			meat:['fish', 'another fish'],
			// 			vegie:['bean', 'tomato', 'mushroom'],
			// 			cheese:['mozzorella', 'parmezan'],
			// 		},
			// 		coffee:
			// 		{
			// 			dairy:['foam', 'milk'],
			// 			sweetener:['sugar','brown sugar'],
			// 		}
			// 	};
			// 	let options = [];
			// 	let my_items = items[env.context.type][m[2]];
			// 	for(let i=0;i<Math.min(10, my_items.length);i++){
			// 		let has = -1 === env.context.ingredients_add.indexOf(my_items[i]);
			// 		let cmd = (has?'remove':'add')+' '+my_items[i];
			// 		options['CMD_'+i] = {text: cmd, message: cmd};
			// 	}

			// 	env.options = options;

			// 	env.message = 'What do you want to add?';


			// 	return resolve(env);
			// break;
			case 'add':
			case 'with':
				if(!env.context.ingredients_add)
					env.context.ingredients_add = [];
				env.context.ingredients_add.push(m[2]);
				env.context.ingredients_add = _.sortedUniq(env.context.ingredients_add);
				env.context.price+=.2;
				message = `${m[2]} added.`;
			break;
			case 'no':
			case 'without':
			case 'remove':
				if(!env.context.ingredients_add)
					env.context.ingredients_add = [];
				env.context.ingredients_add = _.without(env.context.ingredients_add, m[2]);
				env.context.price-=.2;
				message = `${m[2]} removed.`;
			break;

			case 'ready':
			case 'ok':
			case 'done':
			if(!env.context.items)env.context.items=[];
				env.context.items.push( {
					ingredients_add: env.context.ingredients_add,
					size: env.context.size,
					price: env.context.price,
					base: env.context.base,
					extra_note: env.context.extra_note,
				} );
			case 'cancel':
				delete env.message;
				delete env.options;

				env.context.state = 'welcome';
				console.log(env);
				return module.exports[env.context.state](env).then(_env=>{
					_env.message += 'Added to the cart.';
					return resolve(_env);
				});
			break;
			case 'make it':
				switch(m[2]){
					case "big":
					case "small":
					case "medium":
						env.context.size = m[2];
						message = `Will be ${m[2]}.`;
					break;
					default:
						env.context.extra_note = m[2];
						message = `Okay, we noted: ${m[2]}`;
				}
			break;
		}

		 options = {
			MODIFY_OK:{text: "Done", message:'done'},
			MODIFY_DELETE:{text: "Remove", message:'cancel'}
		};
		// if(env.context.type == 'pizza'){
		// 	options.MODIFY_ADD_VEGIE = {text: "Add vegies", message:'show vegie'};
		// 	options.MODIFY_ADD_CHEESE = {text: "Add cheese", message:'show cheese'};
		// 	options.MODIFY_ADD_MEAT = {text: "Add meat", message:'show meat'};
		// }else{
		// 	options.MODIFY_ADD_DAIRY = {text: "Add dairy", message:'show dairy'};
		// 	options.MODIFY_ADD_SWEETENER = {text: "Add sweetener", message:'show sweetener'};
		// }

		if(env.context.size != 'small'){
			options.MODIFY_SMALL = {text: "Small size", message:'make it small'};
		}
		if(env.context.size != 'medium'){
			options.MODIFY_MEDIUM = {text: "Medium size", message:'make it medium'};
		}
		if(env.context.size != 'big'){
			options.MODIFY_BIG = {text: "Big size", message:'make it big'};
		}
		env.options = options;

		env.message = message + `\nCurrent ${env.context.size} ${env.context.type}: `+(env.context.ingredients_add.join(',')||'as usual')+', price: '+Math.round(env.context.price*100)/100;


	    // env.exactMessage = new fbTemplate.generic()
	    //   .addBubble('Claudia.js', 'Deploy Node.js microservices to AWS easily')
	    //     .addUrl('https://claudiajs.com')
	    //     .addImage('https://github.com/claudiajs/claudiajs.com/blob/master/assets/claudiajs.png')
	    //     .addButton('Say hello', 'HELLO')
	    //     .addButton('Go to Github', 'https://github.com/claudiajs/claudia')
	    //   .addBubble('Claudia Bot Builder')
	    //     .addImage('https://github.com/claudiajs/claudiajs.com/blob/master/assets/claudia-bot-builder-video.jpg')
	    //     .addButton('Go to Github', 'https://github.com/claudiajs/claudia-bot-builder')
	    //   .get();



		return resolve(env);
	}); },
	setAddress(env){ return new Promise(function(resolve, reject) {
		if(env.message && env.message.attachments){
			for(var i=0;i<env.message.attachments.length;i++){
				var attachment = env.message.attachments[i];
				if(attachment.type == 'location')
					env.context.geo = attachment.payload.coordinates.lat+', '+attachment.payload.coordinates.long;

			}
		}
		if(env.context.geo){
			env.context.delivery={address: env.context.geo};
			env.context.state = 'setPayment';
			delete env.message;
			return module.exports[env.context.state](env).then(_env=>{_env.message = 'Address had been set by the coordinates.\n'+_env.message;return resolve(_env)});
		}
		if(env.message && env.message.text){
			env.context.delivery={address: env.message.text};

			env.context.state = 'setPayment';
			delete env.message;
			return module.exports[env.context.state](env).then(_env=>{_env.message = 'Address had been set.\n'+_env.message;return resolve(_env)});
		}

		env.message = 'Please specify a delivery address!';
		return resolve(env);
	}); },
	setPayment(env){ return new Promise(function(resolve, reject) {
		let options = {
			'http://www.mbills.si/'  : {text: "Hal mBills", context:{state: 'finalize', paymode: 'mBills'   }},
			// PAY_MBILLS  : {text: "Hal mBills", context:{state: 'finalize', paymode: 'mBills'   }},
			PAY_PAYPAL  : {text: "Paypal",     context:{state: 'finalize', paymode: 'paypal'   }},
			PAY_BITCOIN : {text: "Bitcoin",    context:{state: 'finalize', paymode: 'bitcoin'  }},
			PAY_CC      : {text: "Credit card",context:{state: 'finalize', paymode: 'cc'       }},
			PAY_CASH    : {text: "Cash",       context:{state: 'finalize', paymode: 'cash'     }},
		};
		let message = 'How would you like to pay?'

		if(env.message && env.message.quick_reply && options[env.message.quick_reply.payload]){
			let option = options[env.message.quick_reply.payload];
			context = _.merge(env.context,option.context);
			delete env.message;
			return module.exports[env.context.state](env).then(_env=>resolve(_env));
		}

		env.message = message;
		env.options = options;

		return resolve(env);
	}); },
	finalize(env){ return new Promise(function(resolve, reject) {

		var final = {
			items: env.context.items,
			delivery:env.context.delivery
		};
		console.log('delivering:',final);
		eater.eat(final);

		let options = {
			FINISH_NEW:{text: "Thanks dear!", context:{state: 'welcome'}},
		};
		env.options = options;
		if(env.message && env.message.quick_reply && options[env.message.quick_reply.payload]){
			let option = options[env.message.quick_reply.payload];
			env.context = option.context;
			delete env.message;
			return module.exports[env.context.state](env).then(_env=>resolve(_env));
		}
		env.message = 'The order is on its way.';

		return resolve(env);
	}); },

};


