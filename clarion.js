const Eris = require("eris");
const moment = require('moment');
const fs = require('fs');
const request = require('request');

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var autismbox = "87350922878922752";
var gameboard = "141583443896041472";
var mobagedock = "198225182639259649";
var ricefields = "170203812273848320";
var firekeeper = "87350922878922752";
var Saymon = "87554809212727296";

var bot = new Eris("MzYzODQ1NTI2NzExNTY2MzM2.DLMrYg.zG28pp2E8PR43uY3subsXrzFblI");

bot.on("ready", () => {
    console.log("Onii-chan, I'm ready");
});

bot.on("messageCreate", (msg) => {

    if(msg.content === "!ping" && msg.channel.id === gameboard) {
        bot.createMessage(msg.channel.id, "p-pon!");
    }

    if(msg.content === "!pin2") {
        bot.createMessage(msg.channel.id, "p-pon!");
        console.log(moment().format("LLL"));
    }

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

    if(msg.content === "!bastao" && msg.channel.id === gameboard) {
        var roles = msg.channel.guild.roles;
        var a = 0;
        roles.forEach(function(role){
        	if(a == 0)
        		console.log(role);
        	a++;
        })
        /*for(var a in roles){
        	console.log(roles[a]["name"]);
            if(roles[a]['name'] === 'Firekeeper'){
            	console.log("1");
                var fire = msg.channel.guild.members;
                for(var b in fire){
                	if(fire[b].id == msg.author.id){
                		var hadRole = false;
	                	for(var c = 0; c < fire[b].roles.length; c++){
	                		if(fire[b].roles[c] == roles[a].id){
	                			bot.removeGuildMemberRole(msg.channel.guild.id,msg.author.id,roles[a].id,"Finished story on bonfire");
	                			bot.createMessage(msg.channel.id, "本当にもう終わりなの？");
	                			hadRole = true;
	                		}
	                	}
	                	if(!hadRole){
	                		bot.addGuildMemberRole(msg.channel.guild.id,msg.author.id,roles[a].id,"Starting story on bonfire");
	                		bot.createMessage(msg.channel.id, 'You are the firekeeper now, make sure to tell us a good story.');
                		}
                	}
                }
            }
        }*/
    }

    if(msg.content === "!sem-bastao" && msg.channel.id === gameboard) {
        var roles = msg.channel.guild.roles;
        for(var a = 0; a < roles.length; a++){
            if(roles[a].name === 'Firekeeper'){
                var fire = msg.channel.guild.members;
                for(var b = 0; b < fire.length; b++){
	                for(var c = 0; c < fire[b].roles.length; c++){
	                	if(fire[b].roles[c] == roles[a].id){
	                		bot.removeGuildMemberRole(msg.channel.guild.id,fire[b].id,roles[a].id,"Finished story on bonfire");
	                	}
	                }
                }
            }
        }
    }

});

//Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/mr-data', function(req, res){
  res.sendFile(__dirname + '/mr-data/index.html');
});

//Content routes
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

app.listen(port, function() {
    console.log(moment().format("LLL") + ': Clarion is running on port ' + port);
});

bot.connect();