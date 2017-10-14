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



    rankNames: function(msg, rows){
        var members = msg.channel.guild.members;
        var rankedMembers = [];
        members.forEach(function(member){
            for (var i = 0; i < rows.length; i++) {
                if(member.id === rows[i].id){
                    rankedMembers.push({
                        name: member.username,
                        lastDate: rows[i].last_roll_date,
                        total: rows[i].hentai_level
                    })
                    break;
                }
            }
        });
        // rankedMembers = rankedMembers.sort(function compare(a,b) {
        //   return b.total < a.total
        // });
        return rankedMembers;
    },

    rank: function(msg, bot, type){
        dbManager.getPervertRank(msg, bot, type, function(rows){
            let message = [];
            message.push("List of some awesome people:");
            let ranked = this.rankNames(msg, rows);
            for(var a = 0; a < ranked.length; a++){
                // var split = lolitas[a].last.split("-");
                // last_data = split[2] + "/" + split[1] + "/" + split[0];
                message.push((a + 1) + ") " + ranked[a].name + ": " + ranked[a].total + " "+ type +"s. Last played: " + ranked[a].lastDate);
            }
            bot.createMessage(msg.channel.id, message.join("\n"));
        });
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