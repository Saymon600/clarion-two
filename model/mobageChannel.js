const constants = require('./util/constants.js');
const common = require('./util/common.js');
const dbManager = require('../controller/databaseManager.js');

module.exports = {

	choose: function(msg, bot){
        var message = msg.content.split(" ").slice(1).join(" ");
        message = message.split(",");
        if(message.length > 1){
            var r = Math.floor((Math.random() * message.length));
            bot.createMessage(msg.channel.id,"<@" + msg.author.id + ">, " + "I think " + message[r] + " is the best.")
        }else{
        	bot.createMessage(msg.channel.id,"<@" + msg.author.id + ">, " + "I need options, but c-can I choose you?")
        }
	},

	ask: function(msg, bot, fs){
        var message = msg.content.split(" ").slice(1).join(" ");
       	var r = Math.floor((Math.random() * 7)) + 1;
       	switch(r){
       		case 1:
       			bot.createMessage(msg.channel.id, ":thinking:\nNo.");
       			break;
       		case 2:
       			bot.createMessage(msg.channel.id, ":thinking:\nYes.");
       			break;
       		case 3:
       			bot.createMessage(msg.channel.id, "lmao\nOf course not.");
       			break;
       		case 4:
       			bot.createMessage(msg.channel.id, "Y-yeah.",{file:fs.readFileSync(__dirname + "/../views/reaction_images/ehh.png"),name:"ehh.png"});
       			break;
       		case 5:
       			bot.createMessage(msg.channel.id, "Nope.");
       			break;
       		case 6:
       			bot.createMessage(msg.channel.id, "", {file:fs.readFileSync(__dirname + "/../views/reaction_images/gowild.png"),name:"gowild.png"});
       			break;
       		case 7:
       			bot.createMessage(msg.channel.id, "Don't ask me this.");
       			break;
       	}
	},

	raid: function(msg, bot){
        if(common.findIfHasRole(msg, msg.author.id, constants.RAID_ROLE)){
            bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,constants.RAID_ROLE);
            bot.createMessage(msg.channel.id, "Raid role removed");
        }else{
            bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.RAID_ROLE);
            bot.createMessage(msg.channel.id, 'Raid role added');
        }
	},

    gudako: function(msg, bot, fs){
        var random = Math.floor((Math.random() * 20) + 1);
        var random2 = Math.floor((Math.random() * 7) + 1);
        if(random === 3){
            switch(random2){
                case 1:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/01.gif"),name:"01.gif"});
                break;
                case 2:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/02.gif"),name:"02.gif"});
                break;
                case 3:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/03.jpg"),name:"03.jpg"});
                break;
                case 4:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/04.png"),name:"04.png"});
                break;
                case 5:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/05.jpg"),name:"05.jpg"});
                break;
                case 6:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/06.png"),name:"06.png"});
                break;
                case 7:
                bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/07.jpg"),name:"07.jpg"});
                break;
            }
        }
    },

    whale: function(msg, bot){
        var random = Math.floor((Math.random() * 20) + 1);
        var random2 = Math.floor((Math.random() * 2) + 1);
        if(random === 12){
            if(random2 === 1){
                //mastodon
                bot.createMessage(msg.channel.id,"https://www.youtube.com/watch?v=v-Su1YXQYek");
            }else{
                bot.createMessage(msg.channel.id,"https://www.youtube.com/watch?v=xwNYc01qY2k");
            }
        }
    },

    giveLuck: function(msg, bot, fs){
        dbManager.getWhale(msg, msg.author.id, (alreadyRolled) =>{
            if(alreadyRolled){
                return bot.createMessage(msg.channel.id,"You already rolled today, onii-chan");
            }
            var random = Math.floor(Math.random() * 11);
            if(random === 0){
                return bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/07.jpg"),name:"07.jpg"});
            }
            if(random >= 1 && random <= 5){
                return bot.createMessage(msg.channel.id,"Prepare to be spooked",{file:fs.readFileSync(__dirname + "/../views/reaction_images/kirei.png"),name:"kirei.png"});
            }
            return bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/failLuck.png"),name:"failLuck.png"});
        });
    }

}