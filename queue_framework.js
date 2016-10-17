// //queue_framework.js


// function set_led(/*int*/ index,/*bool*/ state){
// 	console.log(index+' switched '+state?'on':'off');
// }
// function set_text(text){
// 	console.log('showing text: ',text);
// }
// function set_color(r, g, b){
// 	console.log('rgb set to ',r,g,b);
// }
// function sleep(ms){
// 	//this will be implemented
// }

// function onButtonPress(cbPressed){
// 	//handler will be called when button is pressed.
// 	setTimeout(handler, Math.random()*5000);
// }




// function handle_queue(order, cbDone){
// 	//todo
// }






// var orders = [
// 	{
// 		delivery:{
// 			'address':'user address',
// 			'name':'user name',
// 			'phone':'user phone'
// 		},
// 		items:[
// 			{
// 				type:'pizza',
// 				size:'medium',//small/medium/large
// 				base:'margeritha',
// 				ingredients_add:[],
// 				price:1.99,
// 				extra_note:''
// 			},
// 			{
// 				type:'pizza',
// 				size:'medium',//small/medium/large
// 				base:'margeritha',
// 				ingredients_add:['basil'],
// 				price:2.19,
// 				extra_note:''
// 			}
// 		],
// 	},

// 	{
// 		delivery:{
// 			'address':'user2 address',
// 			'name':'user2 name',
// 			'phone':'user2 phone'
// 		},
// 		items:[
// 			{
// 				type:'pizza',
// 				size:'medium',//small/medium/large
// 				base:'margeritha',
// 				ingredients_add:[],
// 				price:1.99,
// 				extra_note:''
// 			},
// 			{
// 				type:'pizza',
// 				size:'medium',//small/medium/large
// 				base:'margeritha',
// 				ingredients_add:['basil'],
// 				price:2.19,
// 				extra_note:''
// 			},
// 			{
// 				type:'pizza',
// 				size:'medium',//small/medium/large
// 				base:'margeritha',
// 				ingredients_add:['basil'],
// 				price:2.19,
// 				extra_note:''
// 			},
// 			{
// 				type:'pizza',
// 				size:'medium',//small/medium/large
// 				base:'margeritha',
// 				ingredients_add:['basil'],
// 				price:2.19,
// 				extra_note:''
// 			}
// 		],
// 	}
// ];


// var queue_eater = function(){
// 	if(!orders)setTimeout(queue_eater,500);

// 	order = orders.shift();
// 	handle_queue(order, queue_eater);
// }

// queue_eater();
