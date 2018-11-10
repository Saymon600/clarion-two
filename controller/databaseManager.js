const { Client } = require('pg');
var moment = require('moment');
const m = require('moment-timezone');
var client;
var sql;
var sqlValues;

module.exports = {

	connect: async function(){
		client = new Client({
			user: process.env.awsDB_User,
			host: process.env.awsDB_Host,
			database: process.env.awsDB_Name,
			password: process.env.awsDB_Password,
	        port: 5432,
	        ssl: true
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

	getPervertRolls: function(msg, bot, type, anotherMember){
		this.connect();
		sql = "SELECT * FROM perverts WHERE id = $1 and hentai_type = $2;";
	    sqlValues = (anotherMember === null) ? [msg.author.id,type] : [anotherMember.id,type];
	    client.query(sql, sqlValues, (err,res) => {
	        if (err) {return console.error(err.message);}
	        var average = (res.rows[0].last_roll_1 + res.rows[0].last_roll_2 + res.rows[0].last_roll_3 + res.rows[0].last_roll_4 + res.rows[0].last_roll_5)/5;
	        average = average.toFixed(2);
	        if(anotherMember){
	        	var mensagem = ((anotherMember.nick === null) ? anotherMember.username : anotherMember.nick) + " has a total of " + res.rows[0].hentai_level + " " + type + "s\n";
	        }else{
	        	var mensagem = "<@" + msg.author.id + ">, you have a total of " + res.rows[0].hentai_level + " " + type + "s\n";
	        }
	        mensagem += "Last 5 rolls are: " + parseInt(res.rows[0].last_roll_1) + ", " + parseInt(res.rows[0].last_roll_2) + ", " + parseInt(res.rows[0].last_roll_3) + ", " + parseInt(res.rows[0].last_roll_4) + ", " + parseInt(res.rows[0].last_roll_5) + "\n";
	        mensagem += "Average is " + average;
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
	},	

	getWhale: async function (msg, id, callback){
		try{
			this.connect();
			sql = "SELECT last_roll_date FROM whales WHERE id = $1";
			sqlValues = [id];
			let res = await client.query(sql, sqlValues);
			const now = moment().tz('America/Sao_Paulo').format("YYYY-MM-DD");
			if(res.rows[0] !== undefined && res.rows[0].last_roll_date === now){
				client.end();
				return callback(true)
			}
			callback(false);
			sql = (res.rows[0] === undefined) ? "insert into whales (id, last_roll_date) values ($1, $2)" 
											  : "update whales set last_roll_date = $2 where id = $1";
			sqlValues.push(now);
			await client.query(sql, sqlValues);
			client.end();
		} catch(err) {
	  		console.log(err.stack);
		}
	},

	getGachaAddict: async function (id){
		try{
			this.connect();
			sql = "SELECT * FROM gacha_addicts WHERE id = $1";
			sqlValues = [id];
			let res = await client.query(sql, sqlValues);
			client.end();
			return (res.rows[0].last_roll_date === moment().tz('America/Sao_Paulo').format("YYYY-MM-DD")) 
				   ? {rolled: true, data: res.rows[0]} 
			       : {rolled: false, data: res.rows[0]};
		} catch(err) {
			console.log(err.stack);
		}
	},

	createGachaAddict: async function (msg){
		try{
			this.connect();
			sql = "insert into gacha_addicts (id, name, gems, maximum_slot_number, last_roll_date) values ($1, $2, $3, $4, $5)";
			sqlValues = [msg.author.id, msg.author.username, 0, 20, moment().tz('America/Sao_Paulo').format("YYYY-MM-DD")];
			await client.query(sql, sqlValues);
			client.end();
		} catch(err) {
			console.log(err.stack);
		}
	},

	updateGachaAddict: async function (addictId, newServantId, newSlot, updateRollDate){
		try{
			this.connect();
			if(updateRollDate){
				sql = 'update gacha_addicts set last_roll_date = $1 where id = $2';
				sqlValues = [moment().tz('America/Sao_Paulo').format("YYYY-MM-DD"), addictId];
				await client.query(sql, sqlValues);
			}
			sql = 'insert into fgo_slots (id_addict, id_servant, slot_number) values ($1, $2, $3)'
			sqlValues = [addictId, newServantId, newSlot];
			await client.query(sql, sqlValues);
			client.end();
		} catch(err) {
			console.log(err.stack);
		}
	},

	getServantsByRarity: async function (rarity){
		try{
			this.connect();
			sql = "SELECT * FROM fgo_servants WHERE rarity = $1";
			if(rarity === '3'){
				sql = "SELECT * FROM fgo_servants WHERE rarity <= $1";
			}
			sqlValues = [rarity];
			let res = await client.query(sql, sqlValues);
			client.end();
			return res.rows;
		} catch(err) {
			console.log(err.stack);
		}
	},

	getSlots: async function (id, slotOptions){
		try{
			this.connect();
			sql = "SELECT * FROM fgo_slots WHERE id_addict = $1 order by slot_number";
			sqlValues = [id];
			if(slotOptions === 'slotData'){
				sql = "SELECT * FROM fgo_slots f join fgo_servants s on (f.id_servant = s.id) WHERE f.id_addict = $1 order by f.slot_number";
			}
			if(slotOptions !== undefined && slotOptions.option === 'singleSlot'){
				sql = "SELECT * FROM fgo_slots f join fgo_servants s on (f.id_servant = s.id) WHERE f.id_addict = $1 and f.slot_number = $2";
				sqlValues.push(slotOptions.slotNumber);
			}
			let res = await client.query(sql, sqlValues);
			client.end();
			return res.rows;
		} catch(err) {
			console.log(err.stack);
		}
	},

	removeSlot: async function (msg, bot, id, selectedSlots){
		try{
			this.connect();
			for (var i = 0; i < selectedSlots.length; i++) {			
				sql = "delete from fgo_slots where id_addict = $1 and slot_number = $2";
				sqlValues = [id, selectedSlots[i].number];
				await client.query(sql, sqlValues);
				sql = 'update gacha_addicts set gems = gems + $2 where id = $1';
				sqlValues = [id, selectedSlots[i].valour];
				await client.query(sql, sqlValues);
			}
			bot.createMessage(msg.channel.id, 'Slots deleted, nii-nii~');
			client.end();
		} catch(err){
			console.log(err.stack);
		}
	},

	decreaseGemsFromAddict: async function (id){
		try{
			this.connect();
			sql = 'update gacha_addicts set gems = gems - 15 where id = $1';
			sqlValues = [id]
			await client.query(sql, sqlValues);
			client.end();
		} catch(err){
			console.log(err.stack);
		}
	},

	changeSlots: async function (msg, bot, slots){
		try{
			this.connect();
			sql = "select * from gacha_addicts where id = $1";
			sqlValues = [msg.author.id];
			let res = await client.query(sql, sqlValues);
			if(res.rows[0] !== undefined && (res.rows[0].maximum_slot_number < slots[0] || res.rows[0].maximum_slot_number < slots[1])){
				return bot.createMessage(msg.channel.id, "Can't do that, nii-nii... your highest available slot is " + res.rows[0].maximum_slot_number);
			}
			sql = 'update fgo_slots set slot_number = case when slot_number = $2 then $3 when slot_number = $3 then $2 else slot_number end where id_addict = $1';
			sqlValues = [msg.author.id, slots[0], slots[1]];
			await client.query(sql, sqlValues);
			bot.createMessage(msg.channel.id, 'Slots swapped, nii-nii!');
			client.end();
		}catch(err){
			console.log(err.stack);
		}
	},

	registerLucksack: async function(msg, bot){
		try{
			if(msg.mentions.length < 1){
				bot.createMessage(msg.channel.id,"Onii-chan... I need you to mention some scum lucksack.");
			}
			this.connect();
			let sql = "select * from lucksacks where id = $1";
			let sqlValues = [msg.mentions[0].id];
			let brunada = 1;
			let timestamp = moment().tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss");
			let res = await client.query(sql,sqlValues);
			if(res.rows[0] !== undefined){
				brunada = parseInt(res.rows[0].brunada) + 1;
				sql = "update lucksacks set brunada = $1,date = $2 WHERE id = $3";
				message = "Lucksack updated!";
			}else{
				sql = "insert into lucksacks (brunada,date,id) values ($1,$2,$3)";
				message = "Lucksack registered!";
			}
			sqlValues = [brunada,timestamp,msg.mentions[0].id];
			await client.query(sql,sqlValues);
			bot.createMessage(msg.channel.id,message);
			client.end();
		}catch(err){
			console.log(err.stack);
		}
	},
	
	checkLucksack: async function(msg, bot){
		try{
			this.connect();
			if(msg.mentions.length < 1){
				bot.createMessage(msg.channel.id,"Onii-chan... I need you to mention someone or your drop rates will get worse");
			}
			let sql = "select * from lucksacks where id = $1";
			let sqlValues = [msg.mentions[0].id];
			let res = await client.query(sql,sqlValues);
			if(res.rows[0] !== undefined){
				let timestamp = moment(res.rows[0].date).format("DD/MM/YYYY HH:mm:ss");
				let brunadas = res.rows[0].brunada + " times";
				if(parseInt(res.rows[0].brunada) === 1){
					brunadas = "1 time";
				}
				message = "Onii-chan... This person lucksacked " + res.rows[0].brunada + " and the last time was at " + timestamp ;
				if(parseInt(res.rows[0].brunada === 10)){
					message = message + "\nI thinl this person should be purged.";
				}
			}else{
				message = "Onii-chan, I didn't find anyone. This must be a sign.";
			}
			bot.createMessage(msg.channel.id,message);
			client.end();
		}catch(err){
			console.log(err.stack);
		}
	}

};