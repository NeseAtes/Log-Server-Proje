var conf = require('../config/database');
var mysql = require("mysql");

console.log("es will start");

//var log_id=req.params.log_id;
var param = function(req,res,next){
	var app_name = req.query.app_name;
	var date = req.query.date;
	var log_level = req.query.log_level;
	var log_id = req.params.log_id;
	var fdate = req.query.fdate;
	var edate = req.query.edate;
}

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

var createIndex = function(req,res,next){
	console.log("gelebiliyor");
	client.indices.create({
		index: 'log'
	}).then(function(resp){
		console.log("index created");
		res.status(200)
		return res.json(resp)
	},function(err){
		console.log("index not created");
		res.status(500)
		return res.json(err)
	});
}

var addDocument = function(req,res,next){
	client.index({
		index: 'log',
		type: 'logs',
		id: req.body.id,
		body:{
			app_name: req.body.app_name,
			date: req.body.date,
			description: req.body.description,
        	log_level: req.body.log_level
		}
	}).then(function(resp){
		console.log("add document");
		res.status(200)
		return res.json(resp)
	}, function(err){
		console.log("not add document");
		res.status(500)
		console.log("error: ->" ,err);
		return res.json(err)		
	});
};

var addDocumentInner = function(logObject,cb){
	client.index({
		index: 'log',
		type: 'logs',
		id: logObject.insertId,
		body:{
			user_id: logObject.user_id,
			app_name: logObject.app_name,
			date: logObject.date,
			description: logObject.description,
        	log_level: logObject.log_level
		}
	}).then(function(resp){
		console.log("ES result: ", resp);
		cb(null, true);
	}, function(err){
		console.log("ES err: ", err);
		cb(err, null);
	});
}

/*var search = function(req,res,next){
	var value = req.query.value || req.body.value||'';
	var userid = res.locals.data.data.user_id;
	console.log(value);
	console.log(userid);
	client.search({
    index: 'log',
    type: 'logs',
    body: {
		query: {
			bool: {
				must: {
					multi_match: {
        				query:    value,
        				fields:   ['app_name', 'description' , 'date' , 'log_level']
    				}
				},
				filter: {
					ids: {
						type: 'logs',
						values: userid
					}
    			}
			}  
    	}			
	}
    }).then((body) => {
    	//console.log("result ->", body);
        res.json(body.hits);
    }, (error) => {
        console.trace(error.message);
    });
};  */

var search = function(req,res,next){
	var value = req.query.value || req.body.value||'';
	var userid = res.locals.data.data.user_id;
	console.log(value);
	console.log(userid);
	client.search({
    index: 'log',
    type: 'logs',
    body: {
		query: {
			bool: {
				must: [
				    { "match": { "description": value }},
 				    { "match": { "user_id": userid   }}
  				]
			}  
    	}			
	}
    }).then((body) => {
    	//console.log("result ->", body);
        res.json(body.hits);
    }, (error) => {
        console.trace(error.message);
    });
}; 

var mapp = function(req,res,next){
	client.indices.putMapping({
		index: 'log',
		type: 'logs',
		//_all: { enabled: true },
		body: { 
			logs:{
				properties: {
					log_id: { type: 'integer'},
					app_name: { type: 'text'},
					date: { type: 'date', format: 'strict_date_optional_time||epoch_mill'},
					description: { type: 'text'},
					log_level: { type: 'text'}
				}
			}
		}
	}).then(function(resp){
		console.log("map created");
		res.status(200)
		return res.json(resp)
	},function(err){
		console.log("map not created");
		res.status(500)
		return res.json(err)
	});
}

var update = function(req,res,next){
	client.update({
		index: 'log',
		type: 'logs',
		id: req.params.id,
		body: {
			app_name: req.body.app_name,
			date: req.body.date,
			description: req.body.description,
        	log_level: req.body.log_level
		}
	}).then(function(resp){
		console.log("update document",resp);
		res.status(200)
		return res.json(resp)
	}, function(err){
		console.log("not update document");
		res.status(500)
		console.log("error: ->" ,err);
		return res.json(err)		
	});
}


/*var bulklama = function(req,res,next){
	var bulk = [];
	conf.forEach(app_name=>{
		bulk.push({index:{
			index: 'log',
			type: 'logs'
		}
	})
	bulk.push(app_name)
})
client.bulk({body:bulk}, function(err,res){
	if (err) {
		console.log("basarisiz.",err)
	} else {
		console.log("%s basarili oldu.", conf.length)
	}
});
}*/

module.exports.createIndex=createIndex;
module.exports.addDocument=addDocument;
module.exports.search=search;
module.exports.mapp=mapp;
module.exports.update=update;
module.exports.addDocumentInner=addDocumentInner;
