const Eris = require("eris");

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