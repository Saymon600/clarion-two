const Eris = require("eris");
const moment = require('moment');
const fs = require('fs');
const request = require('request');

var express = require('express');
var app = express();
var port = process.env.PORT;

var autismbox = "87350922878922752";
var gameboard = "141583443896041472";
var mobagedock = "198225182639259649";
var ricefields = "170203812273848320";
var firekeeper = "161808148804403200";
var raid = "212177339298086915";
var spoiler = "201814052769366017";
var lolicon = "151401843530924032";
var futalover = "185157123129344000";
var siscon = "205716683992727552";
var Saymon = "87554809212727296";

var bot = new Eris("MzYzODQ1NTI2NzExNTY2MzM2.DLMrYg.zG28pp2E8PR43uY3subsXrzFblI");


bot.on("ready", () => {
    console.log("Onii-chan, I'm ready");
});

bot.on("messageCreate", (msg) => {

	//C001
    if(msg.content === "!ping" && msg.channel.id === gameboard) {
        bot.createMessage(msg.channel.id, "p-pon!");
    }

    //C002
    if(msg.content === "!pin2") {
        bot.createMessage(msg.channel.id, "p-pon!");
    }

    //C003
    if(msg.content.startsWith("!nanisore") && msg.channel.id === gameboard ||
       msg.content.startsWith("!nanisore") && msg.channel.id === ricefields){
        var kanji = "";
        var reading = "";
        var english = "";
        var search = msg.content.split(" ").slice(1).join(" ");
        if(search.toLowerCase() === "fowz"){
            search = "unemployed";
        }
        request('http://jisho.org/api/v1/search/words?keyword=' + encodeURI(search), function (error,response,body) {
            if(!error && response.statusCode == 200) {
                var json = JSON.parse(String(body));
                if(typeof json.data[0] != "undefined"){
                    var len = 0;
                    if(json.data.length >= 3){
                        len = 3
                    }else{
                        len = json.data.length;
                    }
                    var reply = [];
                    for(var b = 0; b < len; b++){
                        kanji = json.data[b].japanese[0].word;
                        reading = json.data[b].japanese[0].reading;
                        if(typeof json.data[b].senses[0].english_definitions != "undefined"){
                            for(var a = 0; a < json.data[b].senses[0].english_definitions.length; a++){
                                english = english + json.data[b].senses[0].english_definitions[a];
                                if(a+1 !== json.data[b].senses[0].english_definitions.length){
                                    english = english + ", ";
                                }
                            }
                            reply[reply.length] = "";
                            reply[reply.length] = "Kanji: " + kanji;
                            reply[reply.length] = "Reading: " + reading;
                            reply[reply.length] = "English: " + english;
                        }else{
                            reply[reply.length] = "";
                            reply[reply.length] = "Kanji: " + kanji;
                            reply[reply.length] = "Reading: " + reading;
                        }
                    }
                    bot.createMessage(msg.channel.id,reply.join("\n"));
                }else{
                	bot.createMessage(msg.channel.id, "Didn't find anything, tee hee");
                }
            }else{
            	bot.createMessage(msg.channel.id, "Didn't find anything, tee hee");
                console.log(moment().format("LLL"),error);   
            }
        });
    }

    //C004
    if(msg.content.startsWith("!roll") && msg.channel.id === gameboard) {
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
                bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "You rolled " + totalRoll + " " + rollHist);
            }else{
                if(sides > 1000)
                    bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "Please choose a smaller dice.");
                if(sides <= 1)
                    bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "Are you idiot?");
            }
        }else{
            if(rep > 100)
                bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "You can't roll more than 100 dices");
            if(rep < 1)
                bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "Are you idiot?");
        }
    }

    //C005
    if(msg.content.startsWith("!choose") && msg.channel.id === gameboard ||
       msg.content.startsWith("!choose") && msg.channel.id === mobagedock) {
        var message = msg.content.split(" ").slice(1).join(" ");
        message = message.split(",");
        if(message.length > 1){
            var r = Math.floor((Math.random() * message.length));
            bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "I think " + message[r] + " is the best.");
        }else{
            bot.createMessage(msg.channel.id, "<@" + msg.author.id + ">, " + "I need options, but c-can I choose you?");
        }
    }

    //C006
    if(msg.content.startsWith("!ask") && msg.channel.id === gameboard ||
       msg.content.startsWith("!ask") && msg.channel.id === mobagedock) {
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
       			bot.createMessage(msg.channel.id, "Y-yeah.",{file:fs.readFileSync(__dirname + "/ask/ehh.png"),name:"ehh.png"});
       			break;
       		case 5:
       			bot.createMessage(msg.channel.id, "Nope.");
       			break;
       		case 6:
       			bot.createMessage(msg.channel.id, "", {file:fs.readFileSync(__dirname + "/ask/gowild.png"),name:"gowild.png"});
       			break;
       		case 7:
       			bot.createMessage(msg.channel.id, "Don't ask me this.");
       			break;
       	}
    }

    //C007
    if(msg.content === "!bastao" && msg.channel.id === gameboard) {
        var members = msg.channel.guild.members;
        var hadRole = false;
        members.forEach(function(member){
        	var roles = member.roles;
        	roles.forEach(function(role){
	        	if(role == firekeeper && member.id == msg.author.id){
	        		bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,firekeeper,"Finished story on bonfire");
	                bot.createMessage(msg.channel.id, "本当にもう終わりなの？");
	                hadRole = true;
	        	}else if(role == firekeeper){
	        		bot.createMessage(msg.channel.id, "We already have a firekeeper, you dumb.");
	        		hadRole = true;
	        	}
	        });
       	});
       	if(!hadRole){
	        bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,firekeeper,"Starting story on bonfire");
	        bot.createMessage(msg.channel.id, 'You are the firekeeper now, make sure to tell us a good story.');
        }
    }

    //C008
    if(msg.content === "!sem-bastao" && msg.channel.id === gameboard) {
        var members = msg.channel.guild.members;;
        members.forEach(function(member){
        	var roles = member.roles;
        	roles.forEach(function(role){
	        	if(role == firekeeper){
	        		bot.removeGuildMemberRole(msg.channel.guild.id,member.id,firekeeper);
	        	}
	        });
       	});
       	bot.createMessage(msg.channel.id, 'Storytime is over now.');
    }

    //C009
    if(msg.content === "!raid" && msg.channel.id === gameboard ||
       msg.content === "!raid" && msg.channel.id === mobagedock) {
        var members = msg.channel.guild.members;
        members.forEach(function(member){
        	if(member.id == msg.author.id){
        		var roles = member.roles;
	        	var hadRole = false;
	        	roles.forEach(function(role){
	        		if(role == raid){
	        			bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,raid);
	                	bot.createMessage(msg.channel.id, "Raid role removed");
	                	hadRole = true;
	        		}
	        	});
	        	if(!hadRole){
	                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,raid);
	                bot.createMessage(msg.channel.id, 'Raid role added');
               	}
        	}
       	});
    }

    //C010
    if(msg.content === "!spoiler" && msg.channel.id === gameboard) {
        var members = msg.channel.guild.members;
        members.forEach(function(member){
        	if(member.id == msg.author.id){
        		var roles = member.roles;
	        	var hadRole = false;
	        	roles.forEach(function(role){
	        		if(role == spoiler){
	        			bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,spoiler);
	                	bot.createMessage(msg.channel.id,'Are you sick?');
	                	hadRole = true;
	        		}
	        	});
	        	if(!hadRole){
	                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,spoiler);
	                bot.createMessage(msg.channel.id,"Take care!");
               	}
        	}
       	});
    }

    //C011
    if(msg.content.startsWith("!cn") && msg.channel.id === gameboard){
    	var nick = msg.content.split(" ").slice(1).join(" ");
    	bot.editNickname(msg.channel.guild.id,nick);
        bot.createMessage(msg.channel.id, "You have strange tastes...");
    }

    //C012
    if(msg.content.startsWith("!cp") && msg.channel.id === gameboard){
    	var game = msg.content.split(" ").slice(1).join(" ");
    	fs.writeFile(__dirname + "/lastplaying.txt", game, function(err) {
            if(err){
                console.log(moment().format("LLL"),err);
            }
        });
    	bot.editStatus(bot.status,{name:game});
        bot.createMessage(msg.channel.id, "Do I really need to play this? :sick:");
    }

    //C013
    if(msg.content.startsWith("!cs") && msg.channel.id === gameboard){
    	var status = msg.content.split(" ").slice(1).join(" ");
    	if(msg.author.id == Saymon){
    		bot.editStatus(status);
    		bot.createMessage(msg.channel.id, "畏まりました");
    	}else{
    		bot.createMessage(msg.channel.id, "",{file:fs.readFileSync(__dirname + "/img/jii.jpg"),name:"jii.jpg"});
    	}
    }

    //C014
    if(msg.content === "!pf" && msg.channel.id === gameboard) {
        var random = Math.floor((Math.random() * 20) + 1);
        var message = "";
        if(random == 1){
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
            bot.createMessage(msg.channel.id,message,{file:fs.readFileSync(__dirname + "/img/pf.jpg"),name:"pf.jpg"});
	        var members = msg.channel.guild.members;
	        members.forEach(function(member){
	        	if(member.id == msg.author.id){
	        		var roles = member.roles;
		        	var hadRole = false;
		        	roles.forEach(function(role){
		        		if(role == lolicon){
		        			bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,lolicon);
		                	bot.createMessage(msg.channel.id, "You're already a lolicon! But hey, you're free now!");
		                	hadRole = true;
		        		}
		        	});
		        	if(!hadRole){
		                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,lolicon);
		                bot.createMessage(msg.channel.id, 'OHOHOHOHO! Enjoy your stay.');
	               	}
	        	}
	       	});
        }else if(random == 11){
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
            bot.createMessage(msg.channel.id,message);
            var members = msg.channel.guild.members;
	        members.forEach(function(member){
	        	if(member.id == msg.author.id){
	        		var roles = member.roles;
		        	var hadRole = false;
		        	roles.forEach(function(role){
		        		if(role == lolicon){
		        			bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,lolicon);
		        			message = "You're free to go!";
		                	bot.createMessage(msg.channel.id,message,{file:fs.readFileSync(__dirname + "/img/free.gif"),name:"free.gif"});
		                	hadRole = true;
		        		}
		        	});
		        	if(!hadRole){
		                bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,lolicon);
		                message = "You're under arrest!";
                        bot.createMessage(msg.channel.id,message,{file:fs.readFileSync(__dirname + "/img/prison.gif"),name:"prison.gif"});
	               	}
	        	}
	       	});
        }else{
            bot.createMessage(msg.channel.id,'Porra Fowz');
        }
    }

    if(msg.content ==="!stats" && msg.channel.id === gameboard){
    	var message = "Clarion current stats:\n";

    	var uptime = moment.duration(bot.uptime);
    	var strUptime = zeroPad(uptime.hours(),2) + ":" + zeroPad(uptime.minutes(),2) + ":" + zeroPad(uptime.seconds(),2);

    	message = message + "Uptime: " + strUptime + "\n";

    	bot.createMessage(msg.channel.id,message);
    }

    //C999
    if(msg.content ==="!help" && msg.channel.id === gameboard){
    	var message = "<@" + msg.author.id + ">, ";
    	message = message + "Clarion commands:\n";
    	message = message + "!ping: :zulul:\n";
    	message = message + "!nanisore: search something in Jisho database\n";
    	message = message + "!roll: roll dices for you (number of dices + 'd' + dice sides, ex.: 1d6)\n";
    	message = message + "!choose: make a choice for you (separate choices with , please)\n";
    	message = message + "!ask: ask me something and I'll answer with yes or no\n";
    	message = message + "!bastao: Tell a story in bonfire, my friend\n";
    	message = message + "!sem-bastao: remove firekeepers from bonfire :lul:\n";
    	message = message + "!raid: idk what is this, but they'll ping you with some strange gbf raid code\n";
    	message = message + "!spoiler: access the secret park\n";
    	message = message + "!cn: Change my nick in this server.\n";
    	message = message + "!cp: Change my playing game name.\n";
    	message = message + "!cs: you can't change my status, dummy\n";
    	message = message + "!pf: Prato feito or something like that\n";
    	message = message + "!stats: my stats\n";

    	bot.createMessage(msg.channel.id,message);
    }



C011: change nick
C012: change playing game
C013: change status
C014: Porra Fowz
C015: stats

    	bot.createMessage(msg.channel.id,message);
    }

});

//Routes R001
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/mr-data', function(req, res){
  res.sendFile(__dirname + '/mr-data/index.html');
});

//Content routes for mr-data-converter R002
app.get('/mr-data/css/converter.css', function(req, res){
  res.sendFile(__dirname + '/mr-data/css/converter.css');
});
app.get('/mr-data/js/jquery.js', function(req, res){
  res.sendFile(__dirname + '/mr-data/js/jquery.js');
});
app.get('/mr-data/js/CSVParser.js', function(req, res){
  res.sendFile(__dirname + '/mr-data/js/CSVParser.js');
});
app.get('/mr-data/js/DataGridRenderer.js', function(req, res){
  res.sendFile(__dirname + '/mr-data/js/DataGridRenderer.js');
});
app.get('/mr-data/js/converter.js', function(req, res){
  res.sendFile(__dirname + '/mr-data/js/converter.js');
});
app.get('/mr-data/js/Controller.js', function(req, res){
  res.sendFile(__dirname + '/mr-data/js/Controller.js');
});

//Functions Util F001
function zeroPad(num,size){
	var zero = size - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

//init
var lastplaying = '';
fs.readFile(__dirname + "/lastplaying.txt",function (err,data){
    if(err){
        console.log(moment().format("LLL"),err);
    }
    lastplaying = data.toString();
});
app.listen(port, function() {
    console.log(moment().format("LLL") + ': Clarion is running on port ' + port);
});
bot.connect();

/*
Table of Contents
C001: ping
C002: pin2
C003: nanisore
C004: roll
C005: choose
C006: ask
C007: bastao
C008: sem-bastao
C009: raid
C010: spoiler
C011: change nick
C012: change playing game
C013: change status
C014: Porra Fowz
C015: stats
C999: Help
*/