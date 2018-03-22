var colors = require('colors');

const full = 40;
const hundred = 30;

module.exports = function(value, max){
	var v = max / hundred;
	var text = "|";
	for  (i = 1; i < full; i++){
		if (value > i * v) {
			text += "▓";
		} else {
			text += " ";
		}
		if (i==hundred)
		text += "|";
	}
	return text + "|";
};