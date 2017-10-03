const Eris = require("eris");
var moment = require('moment');
var fs = require('fs');
var request = require('request');

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var autismbox = "87350922878922752";
var gameboard = "141583443896041472";
var mobagedock = "198225182639259649";
var ricefields = "170203812273848320";
var Saymon = "87554809212727296";

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/mr-data', function(req, res){
  res.sendFile(__dirname + '/public/mr-data/index.html');
});
app.listen(port, function() {
    console.log(moment().format("LLL") + ': Clarion is running on port ' + port);
});


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

});


bot.connect();