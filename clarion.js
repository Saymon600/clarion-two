const Eris = require("eris");

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.get('*', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});


var bot = new Eris("MzYzODQ1NTI2NzExNTY2MzM2.DLMrYg.zG28pp2E8PR43uY3subsXrzFblI");
bot.on("ready", () => {
    console.log("Ready!");
});
bot.on("messageCreate", (msg) => {
    if(msg.content === "!ping") {
        bot.createMessage(msg.channel.id, "Pong!");
    }
});
bot.connect();