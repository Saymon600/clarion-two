const fs = require('fs');
const request = require('request');
const constants = require('./../model/util/constants.js');
const moment = require('moment');

const rice = require('./../model/riceChannel.js');
const autism = require('./../model/autismChannel.js');
const gameboard = require('./../model/gameboardChannel.js');
const mobage = require('./../model/mobageChannel.js');
const perv = require('./../model/pervGame.js');
const dbManager = require('./databaseManager.js');
var lastplaying = '';

module.exports = function(app, bot, moment) {

	var defineAction = (msg, channel) =>{

		//C001
	    if(msg.content === "!ping" && channel === constants.GAMEBOARD_CHANNEL) {
	        return bot.createMessage(channel, "p-pon!");
	    }

	    //C002
	    if(msg.content.startsWith("!nanisore") && (channel === constants.GAMEBOARD_CHANNEL || channel === constants.RICE_CHANNEL)){
    		return rice.executeJishoRequest(msg, bot, moment);
	    }

	    //C003
	    if(msg.content.startsWith("!roll") && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.rollAction(msg, bot);
	    }

    	//C004
    	if(msg.content.startsWith("!choose") && (channel === constants.GAMEBOARD_CHANNEL || channel === constants.MOBAGE_CHANNEL)){
    		return mobage.choose(msg, bot);
    	}

    	//C005
    	if(msg.content.startsWith("!ask") && (channel === constants.GAMEBOARD_CHANNEL || channel === constants.MOBAGE_CHANNEL)){
    		return mobage.ask(msg, bot, fs);
    	}

    	//C006
    	if(msg.content === "!bastao" && channel === constants.GAMEBOARD_CHANNEL) {
    		return gameboard.getBastao(msg, bot);
    	}

		//C007 
		if(msg.content === "!sem-bastao" && channel === constants.GAMEBOARD_CHANNEL) {
			return gameboard.removeBastao(msg, bot);
		}

		//C008
    	if(msg.content.startsWith("!raid") && (channel === constants.GAMEBOARD_CHANNEL || channel === constants.MOBAGE_CHANNEL)){
    		return mobage.raid(msg, bot);
    	}

		//C009
	    if(msg.content === "!spoiler" && channel === constants.GAMEBOARD_CHANNEL) {
	    	return gameboard.spoiler(msg, bot);
		}

	    //C010
	    if(msg.content.startsWith("!cn") && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.changeName(msg, bot, fs);
	    }

	    //C011
	    if(msg.content.startsWith("!cp") && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.changePlaying(msg, bot, fs);
	    }

	    //C012
	    if(msg.content.startsWith("!cs") && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.changeStatus(msg, bot, fs);
	    }

	    //C013
	    if(msg.content.startsWith("!pf") && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.pf(msg, bot, fs);
	    }

	    //C014
	    if(msg.content.startsWith("!stats") && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.stats(msg, bot, moment);
	    }

	    //C015
	    if(msg.content.indexOf("rol") !== -1 && channel == constants.MOBAGE_CHANNEL){
	    	return mobage.gudako(msg, bot, fs);
	    }

   	    //C016
	    if(msg.content.indexOf("whal") !== -1 && channel == constants.MOBAGE_CHANNEL){
	    	return mobage.whale(msg, bot, fs);
	    }

	    //C017
	    if(msg.content === "!loli" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.roll(msg, bot, "loli");
	    }

	    //C018 
	    if(msg.content === "!lolistats" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.stats(msg, bot, "loli");
	    }

	    //C019
	    if(msg.content === "!lolirank" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.rank(msg, bot, "loli");
	    }

	    //C020
	    if(msg.content === "!futa" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.roll(msg, bot, "futa");
	    }

	    //C021 
	    if(msg.content === "!futastats" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.stats(msg, bot, "futa");
	    }

	    //C022
	    if(msg.content === "!futarank" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.rank(msg, bot, "futa");
	    }

	    //C023
	    if(msg.content === "!imouto" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.roll(msg, bot, "imouto");
	    }

	    //C024 
	    if(msg.content === "!imoutostats" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.stats(msg, bot, "imouto");
	    }

	    //C025
	    if(msg.content === "!imoutorank" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.rank(msg, bot, "imouto");
	    }

	    //C026
	    if(msg.content.startsWith("!sorry") && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.sorry(msg, bot);
	    }

	    //C993
	    if(msg.content === "!testSeason" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.testSeason(msg, bot);
	    }


	    //C994
	    if(msg.content === "!changeseason" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.changeSeason(msg, bot);
	    }

	    //C995
	    if(msg.content === "!resetimouto" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.reset(msg, bot, "imouto");
	    }

	    //C996
	    if(msg.content === "!resetfuta" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.reset(msg, bot, "futa");
	    }

	    //C997
	    if(msg.content === "!releaseall" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.releaseAll(msg, bot);
	    }

	    //C998
	    if(msg.content === "!resetloli" && channel === constants.GAMEBOARD_CHANNEL){
	    	return perv.reset(msg, bot, "loli");
	    }

	    //C999
	    if(msg.content === "!help" && channel === constants.GAMEBOARD_CHANNEL){
	    	return gameboard.help(msg, bot);
	    }

	}

	bot.on("messageCreate", (msg) => {

		let channel = msg.channel.id;
		switch(channel){
			case constants.GAMEBOARD_CHANNEL:
				defineAction(msg, channel);
			break;
			case constants.MOBAGE_CHANNEL:
				defineAction(msg, channel);
			break;
			case constants.RICE_CHANNEL:
				defineAction(msg, channel);
			break;
			case constants.AUTISM_CHANNEL:
				defineAction(msg, channel);
			break;
		}

	});

	dbManager.getBotStatus(bot);
};

/*
Table of Contents
C001: ping
C002: nanisore 
C003: roll
C004: choose
C005: ask
C006: bastao
C007: sem-bastao
C008: raid
C009: spoiler
C010: change nick
C011: change playing game
C012: change status
C013: Porra Fowz
C014: stats
C015: roll mobage dock
C016: whale mobage dock 
C999: Help
*/