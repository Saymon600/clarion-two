const constants = require('../model/util/constants.js');
var moment = require('moment');
const m = require('moment-timezone');

module.exports = function(bot) {
	var timer = function(bot,moment){
		setInterval(function(){
			var checkMidnight = moment().tz('America/Sao_Paulo').format("HHmm");
			var day = moment().tz('America/Sao_Paulo').format("DD");
			var month = moment().tz('America/Sao_Paulo').format("MM");
			var checkMonth = parseInt(month) % 2;
			//console.log(checkMonth);
			if(checkMidnight === '0000'){
                bot.createMessage(constants.GAMEBOARD_CHANNEL, "!releaseall");
                if(checkMonth === 0 && day === "01"){
                	bot.createMessage(constants.GAMEBOARD_CHANNEL, "!changeseason");
                }
            }
		},60000)
	}
	timer(bot,moment);
};