var express = require('express');
var app = express();
var port = process.env.PORT || 3030;
const Eris = require("eris");
const moment = require('moment');
const m = require('moment-timezone');
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
require('./config/timer.js')(bot);
require('./controller/messageController.js')(app, bot, moment);

//init
app.listen(port, function() {
    console.log(moment().format("LLL") + ': Clarion is running on port ' + port);
});

bot.connect();

bot.on("ready", () => {
    console.log("Onii-chan, I'm ready");
});

const { Client } = require('pg');
var test = async () => {
	var client = new Client({
	      user: 'izhdpobumyufya',
	      host: 'ec2-54-221-207-192.compute-1.amazonaws.com',
	      database: 'd5qsftiankav99',
	      password: '32bc5c61e1d03e330f66dbd402ba9628e559e924d82477a847ad2cd99b39174e',
	      port: 5432,
	      ssl: true
    });
	client.connect();
	var sql = "SELECT id,hentai_level FROM perverts WHERE hentai_type = $1 ORDER BY hentai_level desc LIMIT 1";
	var sqlValues = ["loli"];

    try {
	  const res = await client.query(sql, sqlValues)
	  console.log(res.rows[0].id)
	} catch(err) {
	  console.log(err.stack)
	}
}

var test2 = () => {
	test();
   	console.log("Peace Peace");
}

test2();