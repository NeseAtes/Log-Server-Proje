var MongoClient = require("mongodb").MongoClient;
var mongodb = require("mongodb");

//var dbconfig = require('../lib/mongodb');

var IndexAction = function(req, res, next) {
    var userid=res.locals.data.data.user_id;  

    var app_id=req.params.app_id||req.body.app_id;
    var app_ip = req.query.app_ip||req.body.app_ip;
    var hostname = req.query.hostname||req.body.hostname;
    var version = req.query.version || req.body.version;
    var connection = res.locals.database;
    function buildConditions()
    {
        var appConditions={user_id:userid};
        if (app_ip !== undefined)
            appConditions["app_ip"]=app_ip;
        if (hostname  !== undefined)
            appConditions["hostname"]=hostname;
        if (version !== undefined)
            appConditions["version"]=version;
        return appConditions;
    };
    var conditions = buildConditions();
    connection.collection("app_detail").find(conditions).toArray(function(err,items){
        if (err) {
            console.log("hata");
            next(err);
        } 
        else {
            res.locals.data={
                data : items
            }
            next();
        }
    });
};

var List = function(req, res, next) {

    var app_id=req.params.app_id;

    var connection = res.locals.database;

    connection.collection("app_detail").findOne({_id: new mongodb.ObjectID(app_id)},function(err,items){
        if (err) {
            next(err);
        } 
        else {
            res.locals.data={
                data : items
            }
            next();
        }

    }); 
};

var AddApps=function(req,res,next){
    var userid=res.locals.data.data.user_id;  
    var appveri={
        app_ip:req.body.app_ip == "" ? null : req.body.app_ip,
        hostname:req.body.hostname,
        version:req.body.version,
        user_id:userid   
    };
    var connection = res.locals.database;

    connection.collection("app_detail").insertOne(appveri, function(err,result){
        //console.log("AddApps ", err, result);
        if (err) {
            console.log("err", err);
            next(err);
        }
        else{
            res.locals.data = {
                data: true
            }
            next();
        }
    });
};

var UpdateApps=function(req,res,next){
    var connection = res.locals.database;
    var app_veri={};
    var app_id = req.params.app_id;
    connection.collection("app_detail").find({_id: new mongodb.ObjectID(app_id)}).toArray(function(err,result){
        if (err) {
            next(err);
        }
        else{
            var app_veri={}
            if (req.body.app_ip == undefined){
                app_veri["app_ip"]=result[0].app_ip;  
                }             
            else{
                app_veri["app_ip"]=req.body.app_ip;
            }

            if (req.body.hostname == undefined)
                app_veri["hostname"]=result[0].hostname;
            else{
                app_veri["hostname"]=req.body.hostname;
            }

            if (req.body.version == undefined)
                app_veri["version"]=result[0].version;
            else{
                app_veri["version"]=req.body.version;
            }
        }
    connection.collection("app_detail").updateOne({_id: new mongodb.ObjectID(app_id)}, {$set: app_veri}, function(err,result){    
        if (err) {
           next(err);
        }
        else{
            res.locals.data ={
                data : true
            };
            next();
        }
    });
    });
};

var DeleteApps=function(req,res,next){
    var connection = res.locals.database;
    var app_id = req.params.app_id;
    connection.collection("app_detail").deleteOne({_id: new mongodb.ObjectID(app_id)}, function(err,result){
        if (err) {
           next(err);
        }
        else{
            res.locals.data ={
                data : true
            };
            next();
        }
    });
    
};

module.exports.index = IndexAction;
module.exports.list = List;
module.exports.AddApps=AddApps;
module.exports.deleteApps=DeleteApps;
module.exports.updateApps=UpdateApps;