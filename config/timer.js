const constants = require('../model/util/constants.js');
var moment = require('moment');
const m = require('moment-timezone');

module.exports = function(bot, moment) {
	var timer = function(bot, moment){
		setInterval(function(bot,moment){
			var time00 = moment().tz('America/Sao_Paulo').format("HHmm");
			console.log(time00);
			if(time00 === '0000'){
                 bot.createMessage(constants.GAMEBOARD_CHANNEL, "!releaseall");
            }
		},60000)
	}
	timer(bot,moment);
};