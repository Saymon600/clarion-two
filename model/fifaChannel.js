const constants = require('./util/constants.js');
const common = require('./util/common.js');
module.exports = {

    shisuiRng: function(msg, bot, fs){
      var random = Math.floor((Math.random() * 20) + 1);
      if(random === 3){
        return bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/shisui.jpg"),name:"shisui.jpg"});
      }
    },

    shisui: function(msg, bot, fs){
      return bot.createMessage(msg.channel.id,"",{file:fs.readFileSync(__dirname + "/../views/reaction_images/shisui.jpg"),name:"shisui.jpg"});
    }

}