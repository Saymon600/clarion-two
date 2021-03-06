const fs = require('fs');
const request = require('request');
const constants = require('./../model/util/constants.js');
const common = require('./../model/util/common.js');
const moment = require('moment');

const rice = require('./../model/riceChannel.js');
const autism = require('./../model/autismChannel.js');
const gameboard = require('./../model/gameboardChannel.js');
const mobage = require('./../model/mobageChannel.js');
const fifa = require('./../model/fifaChannel.js');
const suco = require('./../model/sucoChannel.js');
const perv = require('./../model/pervGame.js');
const gacha = require('./../model/gacha.js');
const dbManager = require('./databaseManager.js');


var lastplaying = '';

module.exports = function(app, bot, moment) {

	var autismAction = (msg) =>{

	}

	var fifaAction = (msg) =>{
		if(msg.content.indexOf("shisui") !== -1){
	    	return fifa.shisui(msg, bot, fs);
	    }

	    if(msg.content.indexOf("glamour") !== -1){
	    	return fifa.shisuiRng(msg, bot, fs);
	    }
	}

	var sucoAction = (msg) =>{
		if(msg.content === "!suco"){
	    	return suco.suco(msg, bot);
	    }

	}

	var mobageAction = (msg) =>{

		switch(msg.content){
			case "!giveluck":
				return mobage.giveLuck(msg, bot, fs);
		}

    	if(msg.content.startsWith("!choose")){
    		return mobage.choose(msg, bot);
    	}

    	if(msg.content.startsWith("!ask")){
    		return mobage.ask(msg, bot, fs);
    	}

    	if(msg.content.startsWith("!raid")){
    		return mobage.raid(msg, bot);
    	}

	    if(msg.content.indexOf("rol") !== -1){
	    	return mobage.gudako(msg, bot, fs);
	    }

	    if(msg.content.indexOf("whal") !== -1){
	    	return mobage.whale(msg, bot, fs);
		}

		if(msg.content === "!ubhl"){
    		return mobage.ubhl(msg, bot);
    	}
		
		if(msg.content.startsWith("!lucksack")){
    		return mobage.lucksack(msg, bot);
		}
		
		if(msg.content.startsWith("!check")){
    		return mobage.checkLucksack(msg, bot);
    	}
	}

	var riceAction = (msg) =>{
	    if(msg.content.startsWith("!nanisore")){
    		return rice.executeJishoRequest(msg, bot, moment);
	    }

	}

	var gameboardAction = (msg) =>{

		switch(msg.content){
			case "!ping":
				return bot.createMessage(msg.channel.id, "p-pon!");
			case "!bastao":
				return gameboard.getBastao(msg, bot);
			case "!sem-bastao":
				return gameboard.removeBastao(msg, bot);
			case "!spoiler":
				return gameboard.spoiler(msg, bot);
			case "!pf":
				return gameboard.pf(msg, bot, fs);
			case "!stats":
				return gameboard.stats(msg, bot, moment);
			case "!loli":
				return perv.roll(msg, bot, "loli");
			case "!lolistats":
				return perv.stats(msg, bot, "loli");
			case "!lolirank":
				return perv.rank(msg, bot, "loli");
			case "!futa":
				return perv.roll(msg, bot, "futa");
			case "!futastats":
				return perv.stats(msg, bot, "futa");
			case "!futarank":
				return perv.rank(msg, bot, "futa");
			case "!imouto":
				return perv.roll(msg, bot, "imouto");
			case "!imoutostats":
				return perv.stats(msg, bot, "imouto");
			case "!imoutorank":
				return perv.rank(msg, bot, "imouto");
			case "!changeseason":
				return perv.changeSeason(msg, bot);
			case "!resetimouto":
				return perv.reset(msg, bot, "imouto");
			case "!resetfuta":
				return perv.reset(msg, bot, "futa");
			case "!resetloli":
				return perv.reset(msg, bot, "loli");
			case "!releaseall":
				return perv.releaseAll(msg, bot);
			case "!gacha":
				return gacha.dailyGacha(msg, bot);
			case "!gemgacha":
				return gacha.gemGacha(msg, bot);
			case "!rates":
			case "!rate":
				return gacha.showRates(msg, bot);
			case "!myslots":
			case "!myslot":
				return gacha.showSlots(msg, bot, msg.author.id);
			case "!mystats":
				return gacha.gachaAddictStats(msg, bot);
			case "!help":
				return gameboard.help(msg, bot);
			case "!gachahelp":
				return gacha.gachaHelp(msg, bot);
		}
		if(msg.content.startsWith("!slot") || msg.content.startsWith("!slots")){
			return gacha.showSlots(msg, bot, common.findMemberByName(msg, msg.content.split(" ").splice(1).join(" ")).id);
		}

		if(msg.content.startsWith("!displayslot") || msg.content.startsWith("!showslot")){
			return gacha.displaySlot(msg, bot);
		}

		if(msg.content.startsWith("!releaseslot") || msg.content.startsWith("!freeslot")){
			return gacha.freeSlot(msg, bot);
		}

		if(msg.content.startsWith("!changeslot") || msg.content.startsWith("!swapslot")){
			return gacha.changeSlot(msg, bot);
		}

	    if(msg.content.startsWith("!lastlolis")){
	    	return perv.getLastRolls(msg, bot, "loli");
	    }

	    if(msg.content.startsWith("!lastfutas")){
	    	return perv.getLastRolls(msg, bot, "futa");
	    }

	    if(msg.content.startsWith("!lastimoutos")){
	    	return perv.getLastRolls(msg, bot, "imouto");
	    }

	    if(msg.content.startsWith("!roll")){
	    	return gameboard.rollAction(msg, bot);
	    }

    	if(msg.content.startsWith("!choose")){
    		return mobage.choose(msg, bot);
    	}

    	if(msg.content.startsWith("!ask")){
    		return mobage.ask(msg, bot, fs);
    	}

	    if(msg.content.startsWith("!sorry")){
	    	return perv.sorry(msg, bot);
	    }

	    if(msg.content.startsWith("!cn")){
	    	return gameboard.changeName(msg, bot, fs);
		}
		
	    if(msg.content.startsWith("!cp")){
	    	return gameboard.changePlaying(msg, bot, fs);
		}
		
	    if(msg.content.startsWith("!cs")){
	    	return gameboard.changeStatus(msg, bot, fs);
	    }
	}

	bot.on("messageCreate", (msg) => {

		let channel = msg.channel.id;
		switch(channel){
			case constants.GAMEBOARD_CHANNEL:
				gameboardAction(msg);
			break;
			case constants.MOBAGE_CHANNEL:
				mobageAction(msg);
			break;
			case constants.RICE_CHANNEL:
				riceAction(msg);
			break;
			case constants.AUTISM_CHANNEL:
				autismAction(msg);
			break;
			case constants.FIFA_CHANNEL:
				fifaAction(msg);
			break;
			case constants.SUCO_CHANNEL:
				sucoAction(msg);
			break;
		}

	});

	dbManager.getBotStatus(bot);
};