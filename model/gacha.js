const constants = require('./util/constants.js');
const common = require('./util/common.js');
const dbManager = require('../controller/databaseManager.js');
const fs = require('fs');
const RATES = {
	SSR: 5,
	SR: 15,
	R: 80
};

module.exports = {

	dailyGacha: async function (msg, bot){
		try{
			let addict = await dbManager.getGachaAddict(msg.author.id);
			if(addict.rolled){
				return bot.createMessage(msg.channel.id, 'Already rolled your free roll today, onii-chan');
			}
			let slots = await dbManager.getSlots(msg.author.id);
			if(addict.data !== undefined && slots.length >= addict.data.maximum_slot_number){
				return bot.createMessage(msg.channel.id, 'Your slots are full, onii-chan.\n Try again after releasing a servant or buying a slot!');
			}
			this.rollGacha(msg, bot, addict, slots);
		} catch (err){
			console.log(err.stack);
		}
	},

	findFreeSlot: function (slots){
		let newSlot = 1
		if(slots.length > 0){
			for (var i = 0; i < slots.length; i++) {
				if(i + 1 !== slots[i].slot_number){
					return i + 1;
				}
			}
			newSlot = slots[slots.length - 1].slot_number + 1;
		}
		return newSlot;
	},

	// Rate up later
	rollGacha: async function (msg, bot, addict, slots){
		let newSlot = this.findFreeSlot(slots);
		let random = Math.floor(Math.random() * 101);
		let possibleServants;
		let rarity = '';
		if (random < RATES.SSR){
			possibleServants = await dbManager.getServantsByRarity(5);
		} else if(random >= RATES.SSR && random < (RATES.SR + RATES.SSR)){
			possibleServants = await dbManager.getServantsByRarity(4);
		} else {
			possibleServants = await dbManager.getServantsByRarity(3);
		}
		random = Math.floor(Math.random() * possibleServants.length);
		const newServant = possibleServants[random]
		for (var i = 0; i < parseInt(newServant.rarity); i++) {
			rarity += ':star:';
		}
		bot.createMessage(msg.channel.id,`You rolled **${newServant.name}** from ${newServant.original}! Rarity: ${rarity} Class: **${newServant.class}** (Slot ${newSlot})`);
		if(addict.data === undefined){
			await dbManager.createGachaAddict(msg);
		}
		dbManager.updateGachaAddict(msg.author.id, newServant.id, newSlot);
	},

	prepareSlotsMessage: function (msg, userId, slots){
		let rarity = '';
		let message = common.findMember(msg, userId).username + " Servants:\n";
		let count = 1;
		for (var i = 0; i < slots.length; i++) {
			if(slots[i].slot_number !== count){
				message += `Slot ${count}: <Empty>\n`;
				count++;
				i--;
				continue;
			}
			for (var j = 0; j < parseInt(slots[i].rarity); j++) {
				rarity += ':star:';
			}
			message += `Slot ${slots[i].slot_number}: **${slots[i].name}** from ${slots[i].original}. Rarity: ${rarity} Class: **${slots[i].class}**`;
			if(i !== slots.length - 1){
				message += '\n';
			}
			rarity = '';
			count++;
		}
		return message;
	},

	showSlots: async function (msg, bot, userId){
		try{
			if(userId === undefined){
				return bot.createMessage(msg.channel.id, "Didn't find the user, onii-chan!");
			}
			let slots = await dbManager.getSlots(userId, "slotData");
			if(slots.length === 0){
				return bot.createMessage(msg.channel.id, "No servants were found, o-onii-chan...");
			}
			bot.createMessage(msg.channel.id, this.prepareSlotsMessage(msg, userId, slots));
		} catch (err){
			console.log(err.stack);
		}
	},

	displaySlot: async function (msg, bot){
		try{
	        const params = msg.content.split(" ").slice(1);
	        if(params[0] === undefined 　|| Number.isNaN(parseInt(params[0]))){
	            return bot.createMessage(msg.channel.id, "eeh, which slot?");
	        }
	        const slot = await dbManager.getSlots(msg.author.id, {option: 'singleSlot', slotNumber: params[0]});
	        if(slot[0] === undefined){
	            return bot.createMessage(msg.channel.id, "Sorry, didn't find the slot " + params[0]);
	        }
	        bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/FGO_gacha/"+ slot[0].imagename),name: slot[0].imagename});
		} catch (err){
			console.log(err.stack);
		}
	},

	freeSlot: function (msg, bot){
        let params = msg.content.split(' ').slice(1).join(" ").replace(/\s/g,'').split(",");
        if(params[0] === undefined 　|| Number.isNaN(parseInt(params[0]))){
            return bot.createMessage(msg.channel.id, "eeh, which slot?");
        }
        for (var i = 0; i < params.length; i++) {
        	if(Number.isNaN(parseInt(params[i]))){
        		return console.log('Something went wrong with slot ' + params[i]);
        	} 
        }
        dbManager.removeSlot(msg, bot, msg.author.id, params);
	},

	changeSlot: function (msg, bot){
        let params = msg.content.split(' ').slice(1).join(" ").replace(/\s/g,'').split(",");
        if(params.length !== 2 ){
            return bot.createMessage(msg.channel.id, "I need 2 slots to swap. No more, no less");
        }
        if(params[0] === undefined 　|| Number.isNaN(parseInt(params[0])) || params[1] === undefined 　|| Number.isNaN(parseInt(params[1]))){
            return bot.createMessage(msg.channel.id, "eeh, which slot?");
        }
        dbManager.changeSlots(msg, bot, params);
	},

	// Rate up later
	showRates: function (msg, bot){
		let message = "<@" + msg.author.id + ">\n";
    	message += ":star::star::star::star::star:: 5%\n";
		message += ":star::star::star::star:: 15%\n";
		message += ":star: to :star::star::star:: 80%\n";
		bot.createMessage(msg.channel.id, message);
	},

	gachaHelp: function (msg, bot){
    	let message = "<@" + msg.author.id + ">, ";
    	message += "Command List:\n";
		message += "gacha: your daily free servant roll\n";
		message += "myslot: show your servants (alt: myslots)\n";
		message += "slot: (+ username) show his servants (alt: slots)\n";
		message += "displayslot: A pic of your servant might show up. (alt.: showslot)\n";
		message += "freeslot: (+ slot numbers separated by ',') free your slots releasing the servant. You'll receive some gems, I guess (alt: releaseslot)\n";
		message += "changeslot: (+ 2 slot numbers. Use , to separate the options) swap those 2 slots. (alt.: swapslot)\n";
		// message += "\n";
		// message += "\n";
		message += "rates: show the current roll rates\n";
		message += "Use ! to call commands, p-please\n";
    	bot.createMessage(msg.channel.id, message);
	}

}