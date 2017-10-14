const { Client } = require('pg')
var client;
var sql;
var sqlValues;

module.exports = {

	testDB: function(msg, bot, type){
	    client = new Client({
	          user: 'izhdpobumyufya',
	          host: 'ec2-54-221-207-192.compute-1.amazonaws.com',
	          database: 'd5qsftiankav99',
	          password: '32bc5c61e1d03e330f66dbd402ba9628e559e924d82477a847ad2cd99b39174e',
	          port: 5432,
	        });
	    client.connect();
	    sql = "select * from perverts where id = $1 and hentai_type = $2;"
	    sqlValues = [msg.author.id, type]
	    client.query(sql, sqlValues, (err, res) => {
	        if (err) {return console.error(err.message)}
	        console.log('Connected to the database.');
	        if(res.rows[0] === undefined){
	            createPervert(msg, type);
	        }else{
	            // updatePervert(msg, type);
	            bot.createMessage(msg.channel.id, "Pervert already there, お兄様!");
	            client.end();
	        }
	    });
	},

	createPervert: function(msg, bot, type){
	    sql = "insert into perverts (id, hentai_level, last_roll_1, hentai_type, last_roll_date) values ($1, $2, $3, $4, $5)";
	    sqlValues =[msg.author.id, 9, 9, type, moment().format("YYYY-MM-DD")];
	    console.log(sql);
	    console.log(sqlValues);
	    client.query(sql, sqlValues, (err) => {
	        if (err) {return console.error(err.message)}
	        bot.createMessage(msg.channel.id, "Pervert created, お兄様!");
	        client.end();
	    });
	},

	updatePervert: function(msg, bot, type){
		
	}

};