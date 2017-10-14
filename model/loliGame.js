const constants = require('./util/constants.js');
const dbManager = require('../controller/databaseManager.js');

module.exports = {

	rollLoli: function(msg, bot){
    	var r = Math.floor((Math.random() * 8) + 1);
        roll = r - 1;
    	dbManager.testDB(msg,bot,"loli",roll);
   	}

   	myLoli: function(msg, bot){
    	dbManager.getPervert(msg,bot,"loli");
   	}
}