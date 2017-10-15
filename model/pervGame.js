const constants = require('./util/constants.js');
const dbManager = require('../controller/databaseManager.js');
const fs = require('fs');

module.exports = {

  	roll: function(msg, bot, type){
        var r;
        switch(type){
            case "loli":
                r = Math.floor((Math.random() * 7) + 1);
            break;
            case "futa":
                r = Math.floor((Math.random() * 12) + 1);
                r = r - Math.floor((Math.random() * 3) + 1);
            break;
            case "imouto":
                r = Math.floor((Math.random() * 100) + 1);
            break;
        }
      	dbManager.rollPervert(msg,bot, type, r, this.informAboutRoll);
 	},

   	stats: function(msg, bot, type){
    	dbManager.getPervert(msg,bot, type);
   	},

    informAboutRoll: function(msg, bot, type, roll, total){
        let politeness = "Sasuga";
        if(msg.author.id === constants.R0X_USER){
            politeness = "Very r0x";
        }
        if(msg.author.id === constants.SAYMON_USER){
            politeness = "さすが我が主";
        }
        if((roll === 7 && type === "loli") || (roll === 12 && type === "futa" || (roll === 100 && type === "imouto"))){
            let role;
            switch(type){
                case "loli":
                    role = constants.LOLICON_ROLE;
                break;
                case "futa":
                    role = constants.FUTALOVER_ROLE;
                break;
                case "imouto":
                    role = constants.SISCON_ROLE;
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
                bot.createMessage(msg.channel.id, "I'm giving you " + roll + " lolis and the honorable role of a true Lolicon. You have a total of " + total + " lolis. "+ politeness +" <@" + msg.author.id + ">-sama" );
                return;
            }
            if(type === "futa"){
                bot.createMessage(msg.channel.id, "I'm giving you " + roll + " futas and the honorable role of a true pervert. You have a total of " + total + " futas. "+ politeness +" <@" + msg.author.id + ">-sama" );
                return;
            }
            if(type === "imouto"){
                bot.createMessage(msg.channel.id, "I'm giving you " + roll + " imoutos and the honorable role of a true siscon. You have a total of " + total + " imoutos. "+ politeness +" <@" + msg.author.id + ">-sama" );
                return;
            }
        }else if(roll === 0){
            bot.createMessage(msg.channel.id, "I'll not give a "+ type +", hmpf. You have a total of " + total + " lolis. Go away weeb <@" + msg.author.id + ">" );
        }else if (roll === 1){
            bot.createMessage(msg.channel.id, "I'm giving you one "+ type +". You have a total of " + total + " "+ type +"s. "+ politeness +" <@" + msg.author.id + ">" );
        }else if (roll < 0){
            bot.createMessage(msg.channel.id, "I'm taking "+ roll +" "+ type +"s from you OHOHOHOHO! You have a total of " + total + " "+ type +"s. "+ politeness +" <@" + msg.author.id + ">" );
        }else{
            bot.createMessage(msg.channel.id, "I'm giving you " + roll + " "+ type +"s. You have a total of " + total + " " + type + "s. "+ politeness +" <@" + msg.author.id + ">" );
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
        rankedMembers = rankedMembers.sort(function compare(a,b) {
          return b.total > a.total
        });
        return rankedMembers;
    },

    rank: function(msg, bot, type){
        dbManager.getPervertRank(msg, bot, type, (rows) =>{
            let message = [];
            message.push("List of some awesome people:");
            var ranked = this.rankNames(msg, rows);
            for(var a = 0; a < ranked.length; a++){
                if(ranked[a].lastDate === ''){
                    continue;
                }
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
   	},

    releaseAll: function(msg, bot){

        if(msg.author.id !== constants.SAYMON_USER && msg.author.id !== constants.AUGUSTOP_USER && msg.author.id !== constants.CLARION_USER){
            bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
            return;
        }
        var members = msg.channel.guild.members;
        members.forEach(function(member){
            var roles = member.roles;
            roles.forEach(function(role){
                if(role === constants.LOLICON_ROLE){
                    bot.removeGuildMemberRole(msg.channel.guild.id, member.id,constants.LOLICON_ROLE);
                }
                if(role === constants.FUTALOVER_ROLE){
                    bot.removeGuildMemberRole(msg.channel.guild.id, member.id,constants.FUTALOVER_ROLE);
                }
                if(role === constants.SISCON_ROLE){
                    bot.removeGuildMemberRole(msg.channel.guild.id, member.id,constants.SISCON_ROLE);
                }
            });
        });
        bot.createMessage(msg.channel.id, "Releasing some filthy weebs");
    },

    sorry: function(msg, bot){
        if(msg.author.id !== constants.SAYMON_USER && msg.author.id !== constants.AUGUSTOP_USER && msg.author.id !== constants.CLARION_USER){
            bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
            return;
        }
        var params = msg.content.split(" ").slice(1);
        db.increasePervertsLevel(msg, bot, params[0], params[1]);
    }
}