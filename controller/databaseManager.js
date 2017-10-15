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
	        console.log(res.rows[0]);
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
	    console.log(sql);
	    console.log(sqlValues);
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        bot.createMessage(msg.channel.id,"Removing everyones " + type + "s");
	        client.end();
	    });
	},

	createTables: function(msg, bot){
		client = this.connect();
		client.connect();
		//drop = "DROP TABLE perverts;";
		sql = "CREATE TABLE bot(id SERIAL,nickname varchar (255),status varchar (255),last_playing varchar (255),PRIMARY KEY(id));";
		sql2 = "INSERT INTO bot (nickname,status,last_playing) values ($1,$2,$3);"
		sqlValues =["Clarion Mk-II","online","Dies Irae"];
	    console.log(sql);
	    
	    client.query(sql, (err,res) => {
		    if (err) {return console.error(err.message);}
		    console.log("Everything has an beggining Onii-chan!");
		    client.query(sql2, sqlValues, (err,res) => {
		        if (err) {return console.error(err.message);}
		        console.log("Everything has an end Onii-chan!");
		        client.end();
		    });
		});
	},

	increasePervertsLevel: function(msg, bot, type, amount){
		console.log('type ' + type + ' -- amount ' + amount);
	},

	getBotStatus: function(bot){

	}

};