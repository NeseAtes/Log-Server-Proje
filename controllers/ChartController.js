var MongoClient = require("mongodb").MongoClient;
var bcrypt = require("bcrypt");
var mongodb = require("mongodb");
var lib = require('../lib/mongodb');

var chartAdd = function(req,res,next){
	var connection = res.locals.database;
	var veri ={
		app_name:req.body.app_name,
		log_level:req.body.log_level,
		user_id: res.locals.data.data.user_id,
	};
	connection.collection("chartTable").find(veri).toArray(function(err,result){
		if(result.length==0){
			veri["count"]=1;
			connection.collection("chartTable").insertOne(veri,function(err,result){
				if (err) {
					next(err);
				}
				else{
					res.locals.data={
						data: true,
					};
					next();
				}
			})
		}
		else{
			veri["count"]=result[0].count+1;
		    connection.collection("chartTable").update({app_name:veri.app_name, log_level:veri.log_level},veri,function(err,result){
		        if (err) {
		            next(err);
		        }
		        else{
		            res.locals.data={
		                data: true
		            };
		            next();
		        }
		    });
		}
	})
};

var chartDelete = function(req,res,next){
	var connection=res.locals.database;
	var data={
		app_name: req.body.app_name,
		log_level:req.body.log_level,
		user_id: res.locals.data.data.user_id
	};
    connection.collection("chartTable").find(data).toArray(function(err,reslt){
    	if (err) {
    		console.log("err",err)
    		next(err);
    	}
    	if (reslt.length==0) {
    		return res.status(404).send({ data: false });
    	}
    	else{
    		data["count"]=reslt[0].count-1;
    		connection.collection("chartTable").update({user_id:data.user_id,app_name:data.app_name,log_level:data.log_level},data,function(err,result){
		        if(err){
		            next(err);
		        }
		        else{
		            res.locals.data={
		                data: true            
		            };
		            next();
		        }
	    	});
    	}
    })  
}

var chartList = function(req,res,next){
	var userid=res.locals.data.data.user_id;  

    var chart_id=req.params.chart_id||req.body.chart_id;
    var app_name = req.query.app_name||req.body.app_name;
    var log_level = req.query.log_level||req.body.log_level;
    var connection = res.locals.database;
    function buildConditions()
    {
        var logConditions={user_id:userid};
        if (app_name !== undefined)
            logConditions["app_name"]=app_name;
        if (log_level !== undefined)
            logConditions["log_level"]=log_level;
        return logConditions;
    }
    var conditions = buildConditions();
    connection.collection("chartTable").find(conditions).toArray(function(err,items){
        if (err) {
            console.log("err",err);
            next(err);
        } 
        else {
            res.locals.data={
                data : items
            }
            next();
        }
    });
}
module.exports.chartAdd=chartAdd;
module.exports.chartDelete=chartDelete;
module.exports.chartList=chartList;