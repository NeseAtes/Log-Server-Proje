var moment = require("moment");
var esController = require("./ElasticSearchController");
var mongodb = require("mongodb");
var chartSer= require('./ChartController');

var IndexAction = function(req, res, next) {
    var userid=res.locals.data.data.user_id;  

    var log_id=req.params.log_id||req.body.log_id;
    var app_name = req.query.app_name||req.body.app_name;
    var date = req.query.date||req.body.date;
    var log_level = req.query.log_level||req.body.log_level;
    var connection = res.locals.database;
    function buildConditions()
    {
        var logConditions={user_id:userid};
        if (app_name !== undefined)
            logConditions["app_name"]=app_name;
        if (date  !== undefined)
            logConditions["date"]=date;
        if (log_level !== undefined)
            logConditions["log_level"]=log_level;
        return logConditions;
    }
    var conditions = buildConditions();
    connection.collection("logs").find(conditions).toArray(function(err,items){
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
};

var list = function(req,res,next){
    var userid=res.locals.data.data.user_id;  
    var connection = res.locals.database;

    connection.collection("logs").find({user_id:userid}).limit(5).sort({_id: -1}).toArray(function(err,items){
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
}

var sayi = function(req,res,next){
    var database=res.locals.database;
    var userid=res.locals.data.data.user_id;  
    database.collection("logs").find({user_id:userid}).count(function(err,result){
        if(err) throw err;
        else{
            res.locals.data={
                data: result
            };
            next();
        }
    });
}

var logSer = require('../WS');
var AddLog=function(req,res,next){
    var connection = res.locals.database;
    var logObj = {
        app_name: req.body.app_name == "" ? null : req.body.app_name,
        date: req.body.date == "" ? null : moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        description: req.body.description,
        log_level: req.body.log_level,
        user_id: res.locals.data.data.user_id
    };
    connection.collection("logs").insertOne(logObj, function(err,result) {
        if (err) {
            console.log("err",err);
            next(err);
        } 
        else {
            //console.log("db insert result: ", result);
            chartSer.chartAdd(req,res,next);
            logObj.insertId = result.insertId;
            esController.addDocumentInner(logObj, function(error, result){
                console.log("addDocumentInner: ", error, result);
                if(error) {
                    res.locals.data = {
                        data: false,
                        error: error
                    }
                    next();
                }else {
                    /*res.locals.data = {
                        data: true
                    }
                    next();*/
                }
                logSer.veri(logObj);
            });
        }
    });
};

var UpdateLog=function(req,res,next){
    var connection = res.locals.database;
    var log_id = req.params.log_id;
    var newVal={};

    connection.collection("logs").find({_id: new mongodb.ObjectID(log_id)}).toArray(function(err,result){
        if (err) {
            next(err);
        }
        newVal["app_name"]=req.body.app_name==undefined?result[0].app_name:req.body.app_name;
        newVal["date"]=req.body.date==undefined?result[0].date:moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD');
        newVal["description"]=req.body.description==undefined?result[0].description:req.body.description;
        newVal["log_level"]=req.body.log_level==undefined?result[0].log_level:req.body.log_level;
        newVal["user_id"]=result[0].user_id;
        /*else{
            var newVal={};
            console.log("AA",result);
            if (req.body.app_name == undefined){
                newVal["app_name"]=result[0].app_name;  
            }             
            else{
                newVal["app_name"]=req.body.app_name;
            }

            if (req.body.date == undefined)
                newVal["date"]=result[0].date;
            else{
                newVal["date"]=req.body.date;
            }

            if (req.body.description == undefined)
                newVal["description"]=result[0].description;
            else{
                newVal["description"]=req.body.description
            }
                    
            if (req.body.log_level == undefined)
                newVal["log_level"]=result[0].log_level;
            else{
                newVal["log_level"]=req.body.log_level
            }
            console.log("BB",newVal);
        }*/
        console.log("object",newVal);
        connection.collection("logs").updateOne({_id: new mongodb.ObjectID(log_id)}, {$set: newVal}, function(err,result){
            if (err) {
                next(err);
            }
            else{
               /* res.locals.data={
                    data: true
                };
                next();*/
            }
        });
        if(req.body.log_level!=undefined){
            var data={body:newVal};
            chartSer.chartAdd(data,res,next);
            data.body.log_level=result[0].log_level;
            chartSer.chartDelete(data,res,next);
        } 
        if (req.body.app_name!=undefined) {
            var data={body:newVal};
            chartSer.chartAdd(data,res,next);
            data.body.app_name=result[0].app_name;
            chartSer.chartDelete(data,res,next);
        } 

    });
};
var DeleteLog=function(req,res,next){
    var connection=res.locals.database;
    var log_id = req.params.log_id;
    connection.collection("logs").find({_id: new mongodb.ObjectID(log_id)}).toArray(function(err,result){
        if(err) throw err;
        console.log(result)
        req.body=result[0];
        chartSer.chartDelete(req,res,next);
    });
    connection.collection("logs").deleteOne({_id: new mongodb.ObjectID(log_id)},function(err,result){
        console.log("girmiyor");
        if(err){
            next(err);
        }
        else{
            /*res.locals.data={
                data: true            
            };
            next();*/
        }
    });


};
  
module.exports.index = IndexAction;
module.exports.list= list;
module.exports.addlog = AddLog;
module.exports.updateLog= UpdateLog;
module.exports.deleteLog=DeleteLog;
module.exports.sayi=sayi;