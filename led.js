var execFile = require('child_process').execFile;

module.exports = {
	setLed: (pin, state)=>{
		pin = +pin;
		state = state?1:0;
		execFile('./setLed.py',[pin,state], function callback(error, stdout, stderr){
			if(error)
				console.log(error, stdout, stderr);
		});

	},
	setText: (text)=>{
		execFile('./setText.py',[text], function callback(error, stdout, stderr){
			if(error)
				console.log(error, stdout, stderr);
		});

	},
	setTextColor: (r, g, b)=>{
		execFile('./setText.py',[r, g, b], function callback(error, stdout, stderr){
			if(error)
				console.log(error, stdout, stderr);
		});

	}

}
