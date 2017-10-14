const constants = require('./util/constants.js');
const dbManager = require('../controller/databaseManager.js');
const fs = require('fs');

module.exports = {

  	roll: function(msg, bot, type){
      	var r = Math.floor((Math.random() * 8) + 1) - 1;
      	dbManager.rollPervert(msg,bot, type, r, this.informAboutRoll);
 	},

   	stats: function(msg, bot, type){
    	dbManager.getPervert(msg,bot, type);
   	},

    informAboutRoll: function(msg, bot, type, roll, total){
        if(roll === 7){
            let role;
            switch(type){
                case "loli":
                    role = constants.LOLICON_ROLE;
                break;
            }
            var members = msg.channel.guild.members;
            members.forEach(function(member){
                if(member.id === msg.author.id){
                    var roles = member.roles;
                    var hadRole = false;
                    roles.forEach(function(mrole){
                        if(mrole === role){
                            bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id, role);
                            hadRole = true;
                        }
                    });
                    if(!hadRole){
                        bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, role);
                    }
                }
            });
            if(type === "loli"){
                bot.createMessage(msg.channel.id, "I'm giving you " + roll + " lolis and the honorable role of a true Lolicon. You have a total of " + total + " lolis. Sasuga <@" + msg.author.id + ">-sama" );
                return;
            }
        }else if(roll === 0){
            bot.createMessage(msg.channel.id, "I'll not give a "+ type +"s, hmpf. You have a total of " + total + " lolis. Go away weeb <@" + msg.author.id + ">" );
        }else if (roll === 1){
            bot.createMessage(msg.channel.id, "I'm giving you one "+ type +". You have a total of " + total + " "+ type +"s. Sasuga <@" + msg.author.id + ">" );
        }else{
            bot.createMessage(msg.channel.id, "I'm giving you " + roll + " "+ type +"s. You have a total of " + total + " lolis. Sasuga <@" + msg.author.id + ">" );
        }
    },

   	reset: function(msg, bot, type){
   		var status = msg.content.split(" ").slice(1).join(" ");
    	if(msg.author.id === constants.SAYMON_USER || msg.author.id === constants.AUGUSTOP_USER){
    		dbManager.resetPerverts(msg,bot,type);
    	}else{
    		bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
    	}
   	}
}