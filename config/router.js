module.exports = function(app, express) {

	app.get('/', function(req, res) {
		var locals = {
			// name: "Clareon"
		};

        res.render('./website/index', locals);
    });

    //Routes R001
	// app.get('/', function(req, res){
	//   // res.sendFile(__dirname + '/../views/website/index.html');
	//   res.sendFile(__dirname + '/../views/website/a.html');
	// });

	app.get('/clarion', function(req, res){
	  	res.render('./website/clarion');
	});

	app.get('/mr-data', function(req, res){
	  	res.sendFile(__dirname + '/views/mr-data/index.html');
	});

	// //Content routes for mr-data-converter R002
	// app.get('/mr-data/css/converter.css', function(req, res){
	//   res.sendFile(__dirname + '/mr-data/css/converter.css');
	// });
	// app.get('/mr-data/js/jquery.js', function(req, res){
	//   res.sendFile(__dirname + '/mr-data/js/jquery.js');
	// });
	// app.get('/mr-data/js/CSVParser.js', function(req, res){
	//   res.sendFile(__dirname + '/mr-data/js/CSVParser.js');
	// });
	// app.get('/mr-data/js/DataGridRenderer.js', function(req, res){
	//   res.sendFile(__dirname + '/mr-data/js/DataGridRenderer.js');
	// });
	// app.get('/mr-data/js/converter.js', function(req, res){
	//   res.sendFile(__dirname + '/mr-data/js/converter.js');
	// });
	// app.get('/mr-data/js/Controller.js', function(req, res){
	//   res.sendFile(__dirname + '/mr-data/js/Controller.js');
	// });

	//Content routes for Homepage R003
	// app.get('/favicon.png', function(req, res){
	//   res.sendFile(__dirname + '/favicon.png');
	// });

	// app.use("/assets",express.static(__dirname + '/assets'));


};