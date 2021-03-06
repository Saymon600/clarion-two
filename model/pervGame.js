const constants = require('./util/constants.js');
const common = require('./util/common.js');
const dbManager = require('../controller/databaseManager.js');
const fs = require('fs');

module.exports = {

  	roll: function(msg, bot, type){
        var r;
        switch(type){
            case "loli":
                r = Math.floor(Math.random() * 8);
            break;
            case "futa":
                r = Math.floor(Math.random() * 13);
                r = r - Math.floor(Math.random() * 4);
            break;
            case "imouto":
                r = Math.floor(Math.random() * 101);
            break;
        }
      	dbManager.rollPervert(msg,bot, type, r, this.informAboutRoll);
 	},

   	stats: function(msg, bot, type){
    	dbManager.getPervertRolls(msg, bot, type, null);
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
            if(!common.findIfHasRole(msg, msg.author.id, role)){
                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, role);
            }
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
            bot.createMessage(msg.channel.id, "I'll not give a "+ type +", hmpf. You have a total of " + total + " "+ type +"s. Go away weeb <@" + msg.author.id + ">" );
            bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/smug.gif"),name:"smug.gif"});
        }else if (roll === 1){
            bot.createMessage(msg.channel.id, "I'm giving you one "+ type +". You have a total of " + total + " "+ type +"s. "+ politeness +" <@" + msg.author.id + ">" );
        }else if (roll < 0){
            bot.createMessage(msg.channel.id, "I'm taking "+ roll +" "+ type +"s from you OHOHOHOHO! You have a total of " + total + " "+ type +"s. "+ politeness +" <@" + msg.author.id + ">" );
        }else{
            bot.createMessage(msg.channel.id, "I'm giving you " + roll + " "+ type +"s. You have a total of " + total + " " + type + "s. "+ politeness +" <@" + msg.author.id + ">" );
        }
    },

    rank: function(msg, bot, type){
        bot.createMessage(msg.channel.id, "パーッとパーッと晴れやかに\n咲かせましょう\n花のように");
        dbManager.getPervertRank(msg, bot, type, (rows) =>{
            let message = [];
            message.push("List of some awesome people:");
            let member;
            for(var a = 0; a < rows.length; a++){
                if(rows[a].last_roll_date === ''){
                    continue;
                }
                member = common.findMember(msg, rows[a].id);
                message.push((a + 1) + ") " + ((member.nick === null) ? member.username : member.nick) + ": " + rows[a].hentai_level + " "+ type +"s. Last played: " + rows[a].last_roll_date);
            }

            bot.createMessage(msg.channel.id, message.join("\n"));
        });
    },

   	reset: function(msg, bot, type){
   		var status = msg.content.split(" ").slice(1).join(" ");
    	if(msg.author.id === constants.SAYMON_USER || msg.author.id === constants.AUGUSTOP_USER || msg.author.id === constants.CLARION_USER){
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
        const params = msg.content.split(" ").slice(1);
        if(params[0] === undefined || params[1] === undefined　|| Number.isNaN(parseInt(params[1]))){
            bot.createMessage(msg.channel.id, "わからない、お兄ちゃん");
            return;
        }
        dbManager.increasePervertsLevel(msg, bot, params[0], params[1]);
    },

    getLastRolls: function(msg, bot, type){
        const name = msg.content.replace(/\s+/, '\x01').split('\x01').slice(1).join();
        if(name === ''){
            bot.createMessage(msg.channel.id, "Onii-chan, specify an user please~~");
            return;
        }
        const member = common.findMemberByName(msg, name);
        if(member === undefined){
            bot.createMessage(msg.channel.id, "Didn't find the user\nTeehee~");
            return;
        }
        dbManager.getPervertRolls(msg, bot, type, member);
    },

    changeSeason: function(msg, bot){
        if(msg.author.id !== constants.SAYMON_USER && msg.author.id !== constants.AUGUSTOP_USER && msg.author.id !== constants.CLARION_USER){
            bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
            return;
        }
        dbManager.changeSeason(msg, bot, [constants.ETERNAL_ROLE, constants.PERVERT_ROLE, constants.ONIICHAN_ROLE], function(){
            bot.createMessage(constants.GAMEBOARD_CHANNEL, "Onii-chan, peace peace~");
            bot.createMessage(constants.GAMEBOARD_CHANNEL, "!resetloli");
            bot.createMessage(constants.GAMEBOARD_CHANNEL, "!resetfuta");
            bot.createMessage(constants.GAMEBOARD_CHANNEL, "!resetimouto");
        });
    }

}