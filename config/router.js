module.exports = function(app, express) {

	app.get('/', function(req, res) {
		var locals = {
			// name: "Clarion"
		};

        res.render('./website/index', locals);
    });

	app.get('/clarion', function(req, res){
	  	res.render('./website/clarion');
	});

	app.get('/mr-data', function(req, res){
	  	res.sendFile(__dirname + '/views/mr-data/index.html');
	});

};