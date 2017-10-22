const { Client } = require('pg');
var moment = require('moment');
const m = require('moment-timezone');
var client;
var sql;
var sqlValues;

module.exports = {

	connect: async function(){
		client = new Client({
	          user: 'izhdpobumyufya',
	          host: 'ec2-54-221-207-192.compute-1.amazonaws.com',
	          database: 'd5qsftiankav99',
	          password: '32bc5c61e1d03e330f66dbd402ba9628e559e924d82477a847ad2cd99b39174e',
	          port: 5432,
	        });
		await client.connect();
		return client;
	},

	rollPervert: async function(msg, bot, type, roll, callback){
	    this.connect();
	    sql = "select * from perverts where id = $1 and hentai_type = $2;"
	    sqlValues = [msg.author.id, type]
	    try{
	    	const res = await client.query(sql, sqlValues);
	    	if(res.rows[0] === undefined){
	    		return this.createPervert(msg, bot, type, roll, callback);
	    	}
	    	if(res.rows[0].last_roll_date === moment().tz('America/Sao_Paulo').format("YYYY-MM-DD")){
	            bot.createMessage(msg.channel.id, "You already rolled " + type + "s today!");
	            client.end();
	            return;
	    	}
	    	return this.updatePervert(msg, bot, type, roll, res.rows[0].hentai_level, callback);
	    }catch(err) {
	  		console.log(err.stack)
		}
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
		this.connect();
		sql = "SELECT * FROM perverts WHERE id = $1 and hentai_type = $2;";
	    sqlValues =[msg.author.id,type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
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
		this.connect();
		sql = "SELECT * FROM perverts WHERE hentai_type = $1 order by hentai_level desc;";
	    sqlValues =[type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        callback(res.rows);
	        client.end();
	    });
	},

	resetPerverts: function(msg, bot, type){
		this.connect();
		sql = "UPDATE perverts SET last_roll_date = '',hentai_level = 0 WHERE hentai_type = $1;";
		sqlValues =[type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.createMessage(msg.channel.id,"Removing everyones " + type + "s");
	        client.end();
	    });
	},

	increasePervertsLevel: function(msg, bot, type, amount){
		this.connect();
		sql = "UPDATE perverts SET hentai_level = hentai_level + $1 WHERE hentai_type = $2;";
		sqlValues =[amount, type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.createMessage(msg.channel.id,"My master messed up everything so I'm giving everyone " + amount + " "+ type +"s. Sorry for anything 'till now!");
	        client.end();
	    });
	},

	getBotStatus: function(bot){
		this.connect();
		sql = "SELECT * FROM bot where id = $1";
		sqlValues = [1];
		client.query(sql,sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.editStatus(res.rows[0].status,{name:res.rows[0].last_playing});
	        client.end();
	    });
	},

	updateBotStatus: function(msg, bot, status){
		this.connect();
		sql = "UPDATE bot SET status = $1 where id = 1;";
		sqlValues = [status];
		client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.editStatus(status);
	        client.end();
	    });
	},

	updateBotGame: function(msg, bot, last){
		this.connect();
		sql = "UPDATE bot SET last_playing = $1 where id = 1;";
		sqlValues = [last];
		client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.editStatus(bot.status,{name:last});
	        client.end();
	    });
	},

	changeSeason: async function (msg, bot, roles, callback){
		try {
			this.connect();
			sql = "SELECT id,hentai_level FROM perverts WHERE hentai_type = $1 ORDER BY hentai_level desc LIMIT 1";
			sqlValues = ["loli", "futa", "imouto"];
			let message = "Another season ended, here are some notable people:\n";
			let titles = ["Wanted by the FBI", "Most pervert neighbor", "Most creepy siscon"];
			let res;
			for (var i = 0; i < sqlValues.length; i++) {
				res = await client.query(sql, [sqlValues[i]]);
				message = message + titles[i] +": <@" + res.rows[0].id + ">, with  " + res.rows[0].hentai_level + " " + sqlValues[i] +"s\n";	
				bot.addGuildMemberRole(msg.channel.guild.id, res.rows[0].id, roles[i]);
			}
			await client.end();
			bot.createMessage(msg.channel.id,message);
			callback();
	    } catch(err) {
	  		console.log(err.stack)
		}
	}

};