const sleep = require('sleep').usleep
const led = require('./led.js')


//queue_framework.js
const LED_ON = 1;
const LED_OFF = 0;

const LED_1 = 8;
const LED_2 = 7;
const LED_3 = 2;
const LED_4 = 4;

const BUZZER = 3;
const ms = 1000;

function set_led(/*int*/ index,/*bool*/ state){
	console.log('set_led', arguments)
    led.setLed(index, state);
}
function set_text(text){
	console.log('set_text', arguments)
    led.setText(text);
}
function set_color(r, g, b){
	console.log('set_color', arguments)
    led.setTextColor(r, g, b);
}
var levenshtein = function(a, b){
    if(!a || !b) return (a || b).length;
    var m = [];
    for(var i = 0; i <= b.length; i++){
        m[i] = [i];
        if(i === 0) continue;
        for(var j = 0; j <= a.length; j++){
            m[0][j] = j;
            if(j === 0) continue;
            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1) ? m[i - 1][j - 1] : Math.min(
                m[i-1][j-1] + 1,
                m[i][j-1] + 1,
                m[i-1][j] + 1
            );
        }
    }
    return m[b.length][a.length];
};





function handle_queue(order, cbDone){
	//basil - 0, tomato - 1, mushroom - 2, cheese - 3
    var order_address = order.delivery.address || '';
    var order_name = order.delivery.name || '';
    var order_phone = order.delivery.phone || '';
    var numItems = order.items.length;
    var totalPrice = 0;

    set_text("New order: " + numItems);
    set_color(255,255,0)

    for (var i = 0; i < numItems; i++) {

        // set_text((i+1) + ". order: ");
        var order_type = order.items[i].type || '';
        var order_size = order.items[i].size || '';
        var order_base = order.items[i].base || '';
        var ingredients = order.items[i].ingredients_add || [];
        var order_price = order.items[i].price || 0;
        var extraNote = order.items[i].extra_note || '';

        if(extraNote)
        	extraNote = '\nNote:'+extraNote;

        // set_text(order_type.toUpperCase() + " " + order_base.toUpperCase() + ", size: " + order_size.toUpperCase() + ", price: " + order_price + " €");
        totalPrice += order_price;

        if(ingredients.length){
            for (var j in ingredients) {
                var ingredient = ingredients[j];

                if (levenshtein(ingredient,  "mushroom") < 3) {
                    set_led(LED_1, LED_ON);
                }else if (levenshtein(ingredient,  "tomato") < 3) {
                    set_led(LED_2, LED_ON);
                }else if (levenshtein(ingredient,  "tuna") < 2) {
                    set_led(LED_3, LED_ON);
                }else if (levenshtein(ingredient,  "cheese") < 3) {
                    set_led(LED_4, LED_ON);
                }

            }
            set_text("\nExtras: "+ingredients.join(', ') + extraNote)
        } else {
            set_text("\nNo extra ingredients." + extraNote);
        }
    }
    setTimeout(()=>{
	// set_text("Starting to prepare order...");
    set_color(0,255,0)
    set_text("Order is ready!");
    set_led(LED_1, LED_OFF);
    set_led(LED_2, LED_OFF);
    set_led(LED_3, LED_OFF);
    set_led(LED_4, LED_OFF);
    setTimeout(()=>{
    set_text("N: " + order_name.toUpperCase()+"\n"+
    		 "A: " + order_address.toUpperCase());
    // sleep(2000 * ms)
    // set_text("Phone number: " + order_phone);
    // sleep(2000 * ms)
    // set_text("Total price to pay: " + Math.round(totalPrice*100)/100);
    setTimeout(()=>{
    	set_text("                                ");
	    set_color(0,0,0)
		cbDone();
	},3000);
	},3000);
	},5000);
}



var orders = [];
var running = false;

var queue_eater = function(){
	if(orders.length == 0 || running){
		return;
	}
    running = true;

	var order = orders.shift();
	handle_queue(order, ()=>{running=false;queue_eater()});
}

queue_eater();

module.exports = {
	eat(order){
		orders.push(order);
        queue_eater();
	}
}
