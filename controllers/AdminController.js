var UserCtrl=require('./UserController')
//var db = require("../lib/mongodb");
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');


var get_userRequests=function(req,res,next){
    var connection = res.locals.database;

    connection.collection("user_register_requests").find({}).toArray(function(err,items){
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
var add_request=function(req,res,next){
	var connection = res.locals.database;
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    connection.collection("users").findOne({username},function(err,result){
        if (result) {
            console.log("Farklı kullanıcı adı deneyiniz!!");
            return res.status(404).send({ data: false });
        }
        else{
            connection.collection("user_register_requests").findOne({username},function(err,result){
                if (result) {
                    console.log("Farklı kullanıcı adı deneyiniz!!");
                    return res.status(404).send({ data: false });
                }
                else{
                    if (req.body.username !== "" && req.body.password !== ""){
                        bcrypt.genSalt(12, function(err, salt){
                            bcrypt.hash(password, salt, function(err,hash){
                                password=hash;
                                //console.log("hash",hash);
                                connection.collection("user_register_requests").insertOne({username,password,role},function(err,result){
                                    if (err) {
                                        console.log("err",err);
                                        next(err);
                                    }
                                    else{
                                        res.locals.data={
                                            data:true
                                        }
                                        next();
                                    }
                                });
                            });   
                        });
                    }
                    else{
                        res.locals.data={
                            data: false
                        }
                        next();
                    }
                }
            })
        }  
    })
}
var positive_answer=function(req,res,next){
	var connection = res.locals.database;
	var req_id=req.query.req_id;
	connection.collection("user_register_requests").findOne({_id:new mongodb.ObjectId(req_id)},function(err,result){
		if(err) throw err;
		req.body=result;
        console.log(req.body);
		UserCtrl.addUser(req,res,next);
		connection.collection("user_register_requests").deleteOne({_id:new mongodb.ObjectId(req_id)},function(err,obj){
        if(err) throw err;
        else{
            res.locals.data={
                data: true            
            };
            next();
        }
    });
	});
}
var negative_answer=function(req,res,next){
	var connection = res.locals.database;
    var req_id = req.query.req_id;
	connection.collection("user_register_requests").deleteOne({_id: new mongodb.ObjectID(req_id)},function(err,obj){
        if(err) throw err;
        else{
            res.locals.data={
                data: true            
            };
            next();
        }
    });    
}
module.exports.get_userRequests=get_userRequests;
module.exports.add_request=add_request;
module.exports.positive_answer=positive_answer;
module.exports.negative_answer=negative_answer;