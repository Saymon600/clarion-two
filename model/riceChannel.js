const request = require('request');

module.exports = {

	executeJishoRequest: function(msg, bot, moment){
        var search = msg.content.split(" ").slice(1).join(" ");
        var english = "";
        
        if(search.toLowerCase() === "fowz"){
            search = "unemployed";
        }
        request('http://jisho.org/api/v1/search/words?keyword=' + encodeURI(search), function (error,response,body) {
            if(!error && response.statusCode == 200) {
                var json = JSON.parse(String(body));
                if(json.data[0] !== undefined){
                    var reply = [];
                    for(var b = 0; b < (json.data.length > 3 ? 3: json.data.length); b++){
                        reply[reply.length] = "";
                        reply[reply.length] = "Kanji: " + json.data[b].japanese[0].word;
                        reply[reply.length] = "Reading: " + json.data[b].japanese[0].reading;
                        if(json.data[b].senses[0].english_definitions !== undefined){
                            for(var a = 0; a < json.data[b].senses[0].english_definitions.length; a++){
                                english = english + json.data[b].senses[0].english_definitions[a];
                                if(a + 1 !== json.data[b].senses[0].english_definitions.length){
                                    english = english + ", ";
                                }
                            }
                            reply[reply.length] = "English: " + english;
                        }
                    }
                    bot.createMessage(msg.channel.id, reply.join("\n"));
                }else{
                	bot.createMessage(msg.channel.id, "Didn't find anything, tee hee");
                }
            }else{
            	console.log(moment().format("LLL"),error);
            	bot.createMessage(msg.channel.id, "Didn't find anything, tee hee");
            }
        });
	}

}