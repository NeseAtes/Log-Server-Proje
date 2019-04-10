var aWss;

var init = function(app){

	var expressWs = require('express-ws')(app);
	var wsapp = expressWs.app;

	wsapp.ws('/', function(ws,req) {
			ws.on('message', function(msg) {
				console.log(msg);
				//ws.send(data);
			});		
	});
	 aWss = expressWs.getWss('/');

}



var veri = function(req,res,next){
	//var data = req.app_name + "\t" + req.date + "\t" + req.description + "\t" + req.log_level;
	var data =JSON.stringify(req);
	broadcast(data);
	console.log(data);
};



var broadcast = function(message){
	console.log('broadcast message',message)
	aWss.clients.forEach(client =>{
	client.send(message);
	});
}



module.exports.veri=veri;
module.exports.init=init;
//require('./routes/routes.js')(wsapp); 