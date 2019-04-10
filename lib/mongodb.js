var MongoClient = require('mongodb').MongoClient;
//var conf = require('../config/database');

var url = 'mongodb://localhost:27017';
var dbname = 'log';
var connection=[];


establishConnection = function(callback){
	console.log("evet");
    MongoClient.connect(url, { poolSize: 20 },function(err, db) {
        //assert.equal(null, err);    
        connection = db
        var dab= connection.db(dbname);
        if(typeof callback === 'function' && callback)
            callback(connection)
        console.log("connection succesful");

	  	dab.createCollection("logs", function(err, res) {
	    	if (err) throw err;
	    		console.log("Collection logs created!");
	  	});
	  	dab.createCollection("app_detail", function(err,res){
	  		if (err) throw err;
	  		console.log("Collection app_detail created!")
	  	});
	  	dab.createCollection("users", function(err,res){
	  		if (err) throw err;
	  		console.log("Collection users created!")
	  	});
	  	dab.createCollection("user_register_requests", function(err,res){
	  		if (err) throw err;
	  		console.log("Collection user_register_requests created!")
	  	});
	  	dab.createCollection("chartTable", function(err,res){
	  		if (err) throw err;
	  		console.log("Collection chartTable created!")
	  	});
    })    
};
  
function getconnection(){
    return connection;
}
      
module.exports = {
  
    establishConnection:establishConnection,
    getconnection:getconnection
}

/*MongoClient.connect(url, {useNewUrlParser: true, poolSize : 1}, (err, client) => {
	process.on('aaaa', err => console.log(err.stack))
	if (err) console.log("err",err);

	var dab= client.db(dbname);
	console.log("Database created");
	dab.createCollection("logs", function(err,res){
		process.on('unhandledRejection', err => console.log(err.stack))
		if (err) throw err;
	console.log("Database logs collection");
	});

	dab.createCollection("app_detail", function(err,res){
		if (err) throw err;
	console.log("Database apps collection");
	});

	dab.createCollection("users", function(err,res){
		if (err) throw err;
	console.log("Database users collection");
	});
	client.close();
});*/

/*exports.getConnection = function(callback) {
  MongoClient.connect(url, function(err, client) {
    if(err) {
    	console.log("shs",err);
      return callback(err);
    }
    callback(err, client);
  });
};*/
