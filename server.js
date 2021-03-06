var express = require('express');
var app = express();
var port = process.env.PORT || 3030;
const Eris = require("eris");
const moment = require('moment');
const m = require('moment-timezone');
var bot = new Eris(process.env.TOKEN);


app.set('view engine', 'pug');

app.use(express.static(__dirname + '/'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

require('./config/router.js')(app, express);
require('./config/timer.js')(bot);
require('./controller/messageController.js')(app, bot, moment);

//init
app.listen(port, function() {
    console.log(moment().format("LLL") + ': Clarion is running on port ' + port);
});

bot.connect();

bot.on("ready", () => {
    console.log("Onii-chan, I'm ready");
    // bot.createMessage("141583443896041472", "サービス開始。クラリオン、参ります");
});