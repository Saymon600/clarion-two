var express = require('express');
var app = express();
var port = process.env.PORT || 3030;
const Eris = require("eris");
const moment = require('moment');
var bot = new Eris("MzYzODQ1NTI2NzExNTY2MzM2.DLMrYg.zG28pp2E8PR43uY3subsXrzFblI");

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

require('./config/router.js')(app, express);
require('./controller/msgController.js')(app, bot, moment);



//init
app.listen(port, function() {
    console.log(moment().format("LLL") + ': Clarion is running on port ' + port);
});

// bot.connect();

bot.on("ready", () => {
    console.log("Onii-chan, I'm ready");
});


