const { Client } = require('pg');
var moment = require('moment');
const m = require('moment-timezone');
var client;
var sql;
var sqlValues;

module.exports = {

	connect: function(){
		client = new Client({
	          user: 'izhdpobumyufya',
	          host: 'ec2-54-221-207-192.compute-1.amazonaws.com',
	          database: 'd5qsftiankav99',
	          password: '32bc5c61e1d03e330f66dbd402ba9628e559e924d82477a847ad2cd99b39174e',
	          port: 5432,
	        });
		return client;
	},

	rollPervert: function(msg, bot, type, roll, callback){
	    client = this.connect();
	    client.connect();
	    sql = "select * from perverts where id = $1 and hentai_type = $2;"
	    sqlValues = [msg.author.id, type]
	    client.query(sql, sqlValues, (err, res) => {
	        if (err) {return console.error(err.message)}
	        console.log('Connected to the database.');
	        if(res.rows[0] === undefined){
	            this.createPervert(msg, bot, type, roll, callback);
	        }else if(res.rows[0].last_roll_date == moment().tz('America/Sao_Paulo').format("YYYY-MM-DD")){
	            bot.createMessage(msg.channel.id, "You already rolled " + type + "s today!");
	            client.end();
	            return;
	        }else{
	        	this.updatePervert(msg, bot, type, roll, res.rows[0].hentai_level, callback);
	        }
	    });
	},

	createPervert: function(msg, bot, type, roll, callback){
	    sql = "insert into perverts (id, name, hentai_level, last_roll_1, hentai_type, last_roll_date, last_roll_2,last_roll_3,last_roll_4,last_roll_5) values ($1, $2, $3, $4, $5, $6, 0, 0, 0, 0)";
	    sqlValues =[msg.author.id, msg.author.username, roll, roll, type, moment().tz('America/Sao_Paulo').format("YYYY-MM-DD")];
	    client.query(sql, sqlValues, (err) => {
	        if (err) {return console.error(err.message)}
	       	callback(msg, bot, type, roll, roll)
	        client.end();
	    });
	},

	updatePervert: function(msg, bot, type, roll, total, callback){
		sql = "UPDATE perverts SET last_roll_5 = last_roll_4, last_roll_4 = last_roll_3, last_roll_3 = last_roll_2, last_roll_2 = last_roll_1, last_roll_1 = $1, hentai_level = hentai_level + $2, last_roll_date = $3 WHERE id = $4 and hentai_type = $5";
	    sqlValues =[roll, roll, moment().tz('America/Sao_Paulo').format("YYYY-MM-DD"), msg.author.id, type];
	    client.query(sql, sqlValues, (err) => {
	        if (err) {return console.error(err.message)}
	        callback(msg, bot, type, roll, total + roll);
	        client.end();
	    });
	},

	getPervert: function(msg, bot, type){
		client = this.connect();
		client.connect();
		sql = "SELECT * FROM perverts WHERE id = $1 and hentai_type = $2;";
	    sqlValues =[msg.author.id,type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        //console.log(res.rows[0]);
	        var average = (res.rows[0].last_roll_1 + res.rows[0].last_roll_2 + res.rows[0].last_roll_3 + res.rows[0].last_roll_4 + res.rows[0].last_roll_5)/5;
	        average = average.toFixed(2);
	        var mensagem = "<@" + msg.author.id + ">, you have a total of " + res.rows[0].hentai_level + " " + type + "s\n";
	        mensagem += "Last 5 rolls are: " + parseInt(res.rows[0].last_roll_1) + ", " + parseInt(res.rows[0].last_roll_2) + ", " + parseInt(res.rows[0].last_roll_3) + ", " + parseInt(res.rows[0].last_roll_4) + ", " + parseInt(res.rows[0].last_roll_5) + "\n";
	        mensagem += "Your average is " + average;
	        bot.createMessage(msg.channel.id, mensagem);
	        client.end();
	    });
	},

	getPervertRank: function(msg, bot, type, callback){
		client = this.connect();
		client.connect();
		sql = "SELECT * FROM perverts WHERE hentai_type = $1 order by hentai_level desc;";
	    sqlValues =[type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        callback(res.rows);
	        client.end();
	    });
	},

	resetPerverts: function(msg, bot, type){
		client = this.connect();
		client.connect();
		sql = "UPDATE perverts SET last_roll_date = '',hentai_level = 0 WHERE hentai_type = $1;";
		sqlValues =[type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.createMessage(msg.channel.id,"Removing everyones " + type + "s");
	        client.end();
	    });
	},

	increasePervertsLevel: function(msg, bot, type, amount){
		client = this.connect();
		client.connect();
		sql = "UPDATE perverts SET hentai_level = hentai_level + $1 WHERE hentai_type = $2;";
		sqlValues =[amount, type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.createMessage(msg.channel.id,"My master messed up everything so I'm giving everyone " + amount + " "+ type +"s. Sorry for anything 'till now!");
	        client.end();
	    });
	},

	getBotStatus: function(bot){
		client = this.connect();
		client.connect();
		sql = "SELECT * FROM bot where id = $1";
		sqlValues = [1];
		client.query(sql,sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.editStatus(res.rows[0].status,{name:res.rows[0].last_playing});
	        client.end();
	    });
	},

	updateBotStatus: function(msg, bot, status){
		client = this.connect();
		client.connect();
		sql = "UPDATE bot SET status = $1 where id = 1;";
		sqlValues = [status];
		client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.editStatus(status);
	        client.end();
	    });
	},

	updateBotGame: function(msg, bot, last){
		client = this.connect();
		client.connect();
		sql = "UPDATE bot SET last_playing = $1 where id = 1;";
		sqlValues = [last];
		client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.editStatus(bot.status,{name:last});
	        client.end();
	    });
	},

	changeSeason: function(msg, bot, eternal, pervert, oniichan){
		client = this.connect();
		client.connect();
		sql = "SELECT id,hentai_level FROM perverts WHERE hentai_type = $1 ORDER BY hentai_level LIMIT 1";
		var message = "Another season ended, here are some notable people:\n";
		sqlValues = ["loli"];
		client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        message = message + "Wanted by FBI: <@" + res.rows[0].id + ">, with  " + res.rows[0].hentai_level + sqlValues[0] + "s\n";
	        bot.addGuildMemberRole(msg.channel.guild.id,res.rows[0].id,eternal);
	    });
	    sqlValues = ["futa"];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        message = message + "Most pervert neighbor<@" + res.rows[0].id + ">, with  " + res.rows[0].hentai_level + sqlValues[0] + "s\n";
	        bot.addGuildMemberRole(msg.channel.guild.id,res.rows[0].id,pervert);
	    });
	    sqlValues = ["imouto"];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        message = message + "Most creep siscon: <@" + res.rows[0].id + ">, with  " + res.rows[0].hentai_level + sqlValues[0] + "s\n";
	        bot.addGuildMemberRole(msg.channel.guild.id,res.rows[0].id,oniichan);
	        bot.createMessage(msg.channel.id,message);
	        client.end();
	    });
	}


};