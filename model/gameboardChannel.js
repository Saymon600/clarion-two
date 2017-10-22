const constants = require('./util/constants.js');
const common = require('./util/common.js');
const dbManager = require('../controller/databaseManager.js');

module.exports = {

	rollAction: function(msg, bot){
	    var dice = msg.content.split(" ").slice(1).join(" ");
	    var split = dice.split("d");
	    var rep = parseInt(split[0]);
	    var sides = parseInt(split[1]);
	    if(rep > 0 && rep < 101){
	        if(sides > 1 && sides < 1001){
	            var rollHist = "("
	            var r = 0;
	            var totalRoll = 0;
	            for(var a = 0; a < rep; a++){
	                if(a > 0 && a < rep){
	                    rollHist = rollHist + " + ";
	                }
	                r = Math.floor((Math.random() * sides) + 1);
	                rollHist = rollHist + r;
	                totalRoll = totalRoll + r;
	            }
	            rollHist = rollHist + ")"
	            return bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "You rolled " + totalRoll + " " + rollHist);
	        }else{
	            if(sides > 1000)
	                return bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "Please choose a smaller dice.");
	            if(sides <= 1)
	                return bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "Are you idiot?");
	        }
	    }else{
	        if(rep > 100)
	            return bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "You can't roll more than 100 dices");
	        if(rep < 1)
	            return bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "Are you idiot?");
	    }
	},

	getBastao: function(msg, bot){
        const firekeeper = common.findMemberWithRole(msg, constants.FIREKEEPER_ROLE);
        if(firekeeper){
        	if(firekeeper.id === msg.author.id){
        		bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,constants.FIREKEEPER_ROLE,"Finished story on bonfire");
        		bot.createMessage(msg.channel.id, "本当にもう終わりなの？");
        		return;
        	}
        	bot.createMessage(msg.channel.id, "We already have a firekeeper, you dumb.");
        	return;
        }
        bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,constants.FIREKEEPER_ROLE,"Starting story on bonfire");
        bot.createMessage(msg.channel.id, 'You are the firekeeper now, make sure to tell us a good story.');
	},

	removeBastao: function(msg, bot){
       	const firekeeper = common.findMemberWithRole(msg, constants.FIREKEEPER_ROLE);
       	if(firekeeper === undefined){
       		bot.createMessage(msg.channel.id, 'There is no firekeeper');
       		return;
       	}
       	bot.removeGuildMemberRole(msg.channel.guild.id, firekeeper.id, constants.FIREKEEPER_ROLE);
       	bot.createMessage(msg.channel.id, 'Storytime is over now.');
   	},

   	spoiler: function(msg, bot){
	   	if(common.findIfHasRole(msg, msg.author.id, constants.SPOILER_ROLE)){
			bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.SPOILER_ROLE);
        	bot.createMessage(msg.channel.id,'Are you sick?');
	   	}else{
    		bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.SPOILER_ROLE);
        	bot.createMessage(msg.channel.id,"Take care!");
	   	}
   	},

   	changeName: function(msg, bot, fs){
    	var nick = msg.content.split(" ").slice(1).join(" ");
    	bot.editNickname(msg.channel.guild.id,nick);
    	var status = msg.content.split(" ").slice(1).join(" ");
    	if(msg.author.id === constants.SAYMON_USER || msg.author.id === constants.AUGUSTOP_USER){
        	bot.createMessage(msg.channel.id, "You have strange tastes...");
    	}else{
    		bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
    	}
   	},

   	changeStatus: function(msg, bot, fs){
    	var status = msg.content.split(" ").slice(1).join(" ");
    	if(msg.author.id === constants.SAYMON_USER || msg.author.id === constants.AUGUSTOP_USER){
    		dbManager.updateBotStatus(msg,bot,status);
    		bot.createMessage(msg.channel.id, "畏まりました");
    	}else{
    		bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
    	}
   	},

   	changePlaying: function(msg, bot, fs){
   		if(msg.author.id !== constants.SAYMON_USER && msg.author.id !== constants.AUGUSTOP_USER){
   			bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/../views/reaction_images/jii.jpg"),name:"jii.jpg"});
   			return;
   		}
    	var game = msg.content.split(" ").slice(1).join(" ");

    	dbManager.updateBotGame(msg,bot,game)
        bot.createMessage(msg.channel.id, "Do I really need to play this? :sick:");
   	},

   	pf: function(msg, bot, fs){
	    var random = Math.floor((Math.random() * 20) + 1);
	    var message = "";
	    if(random === 1){
	        message = [
	            "",
	            "/!\\ /!\\ /!\\",
	            "/!\\ ALERTA /!\\",
	            "LOLICON ENCONTRADO",
	            "/!\\ ALERT /!\\",
	            "LOLICON DETECTED",
	            "/!\\ ご注意ください /!\\",
	            "ロリコン発見",
	            "/!\\ /!\\ /!\\",
	        ].join("\n");
	        bot.createMessage(msg.channel.id,message,{file:fs.readFileSync(__dirname + "/../views/reaction_images/pf.jpg"),name:"pf.jpg"});
	       	if(common.findIfHasRole(msg, msg.author.id, constants.LOLICON_ROLE)){
				bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.LOLICON_ROLE);
	        	bot.createMessage(msg.channel.id, "You're already a lolicon! But hey, you're free now!");
	       	}else{
                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.LOLICON_ROLE);
            	bot.createMessage(msg.channel.id, 'OHOHOHOHO! Enjoy your stay.');
	       	}
	    }else if(random === 11){
	        message = [
	            "",
	            "/!\\ /!\\ /!\\",
	            "/!\\ ALERTA /!\\",
	            "LOLICON ENCONTRADO",
	            "/!\\ ALERT /!\\",
	            "LOLICON DETECTED",
	            "/!\\ ご注意ください /!\\",
	            "ロリコン発見",
	            "/!\\ /!\\ /!\\",
	        ].join("\n");
	       	if(common.findIfHasRole(msg, msg.author.id, constants.LOLICON_ROLE)){
				bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.LOLICON_ROLE);
	        	bot.createMessage(msg.channel.id,message,{file:fs.readFileSync(__dirname + "/../views/reaction_images/free.gif"),name:"free.gif"});
	        	bot.createMessage(msg.channel.id, "You're already a lolicon! But hey, you're free now!");
	       	}else{
                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id, constants.LOLICON_ROLE);
            	bot.createMessage(msg.channel.id,message,{file:fs.readFileSync(__dirname + "/../views/reaction_images/prison.gif"),name:"prison.gif"});
            	bot.createMessage(msg.channel.id, "You're under arrest!");
	       	}
	    }else{
	        bot.createMessage(msg.channel.id,'Porra Fowz');
	    }
   	},

   	zeroPad: function(num,size){
		var zero = size - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
   	},

   	stats: function(msg, bot, moment){
   		var message = "その指は鉄、その髪は檻、その囁きは甘き毒。これがわたし\n";
    	// var message = "Clarion current stats:\n";

    	var uptime = moment.duration(bot.uptime);
    	var strUptime = this.zeroPad(uptime.hours(),2) + ":" + this.zeroPad(uptime.minutes(),2) + ":" + this.zeroPad(uptime.seconds(),2);

    	message = message + "Uptime: " + strUptime + "\n";

    	bot.createMessage(msg.channel.id,message);
   	},

   	help: function(msg, bot){

   		/*msg.channel.guild.roles.forEach(function(role){
   			console.log(role.name + ": " + role.id);
   		});*/

    	var message = "<@" + msg.author.id + ">, ";
    	message = message + "Clarion commands:\n";
    	message = message + "!ping: 10ms\n";
    	message = message + "!nanisore: search something in Jisho database\n";
    	message = message + "!roll: roll dices for you (number of dices + 'd' + dice sides, ex.: 1d6)\n";
    	message = message + "!choose: make a choice for you (separate choices with , please)\n";
    	message = message + "!ask: ask me something and I'll answer with yes or no\n";
    	message = message + "!bastao: Tell a story in bonfire, my friend\n";
    	message = message + "!sem-bastao: remove firekeepers from bonfire.\n";
    	message = message + "!raid: idk what is this, but they'll ping you with some strange gbf raid code\n";
    	message = message + "!spoiler: access the secret park\n";
    	message = message + "!cn: Change my nick in this server.\n";
    	message = message + "!cp: Change my playing game name.\n";
    	message = message + "!cs: you can't change my status, dummy\n";
    	message = message + "!pf: Prato feito or something like that\n";
    	message = message + "!stats: my stats\n";

    	bot.createMessage(msg.channel.id, message);
   	}

}