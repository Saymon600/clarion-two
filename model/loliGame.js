const constants = require('./util/constants.js');
const dbManager = require('../controller/databaseManager.js');
const fs = require('fs');

module.exports = {

	rollLoli: function(msg, bot){
    	var r = Math.floor((Math.random() * 8) + 1);
        roll = r - 1;
    	dbManager.rollPervert(msg,bot,"loli",roll);
   	},

   	statsLoli: function(msg, bot){
    	dbManager.getPervert(msg,bot,"loli");
   	},

   	reset: function(msg, bot){
   		var status = msg.content.split(" ").slice(1).join(" ");
    	if(msg.author.id === constants.SAYMON_USER || msg.author.id === constants.AUGUSTOP_USER){
    		dbManager.resetPerverts(msg,bot,"loli");
    	}else{
    		bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
    	}
   	}
}