const constants = require('./util/constants.js');
const common = require('./util/common.js');
const dbManager = require('../controller/databaseManager.js');

module.exports = {
	suco: function(msg, bot){
        if(common.findIfHasRole(msg, msg.author.id, constants.SUCO_ROLE)){
            bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,constants.SUCO_ROLE);
            bot.createMessage(msg.channel.id, "~~Sal~~ Suco role removed");
        }else{
            bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.SUCO_ROLE);
            bot.createMessage(msg.channel.id, 'Suco role added');
        }
	}
}