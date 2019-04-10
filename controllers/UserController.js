var MongoClient = require("mongodb").MongoClient;
var bcrypt = require("bcrypt");
var mongodb = require("mongodb");
var lib = require('../lib/mongodb');

var addUser=function(req,res,next){
    var connection = res.locals.database;
    var veri = {
        username:req.body.username,
        password:req.body.password,
        role:req.body.role
    };
    if (req.body.username !== "" && req.body.password !== ""){
        connection.collection("users").insertOne(veri, function(err,result){
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
    }   
    else{
        res.locals.data={
            data: false
        }
        next();
    }       
};
var getAllUsers=function(req,res,next){
	var connection = res.locals.database;
	//var user_id=req.query.user_id;
	//var username=req.query.username;
	//var password=req.query.password;
	
    connection.collection("users").find().toArray(function(err,items){
        if (err) {
            next(err);
        } 
        else {
            res.send(items);
        }
        next();
    }); 
};

var TokenCtrl = require("../controllers/tokenCtrl");
var login=function(req,res,next){
	var connection=res.locals.database;
    var username=req.body.username;
    var password=req.body.password;
    var role=req.body.role;
    if (req.body.username !== "" && req.body.password !== "") {
        connection.collection("users").findOne({username},function(err,result){
            if (err) throw err;
            else{
                bcrypt.compare(password,result.password,function(err,isMatch){
                    if (err) {
                        console.log("err",err);
                        throw err;
                    }
                    else if (isMatch){
                        if (err) console.log("err",err);
                        else if (result != null)
                        { //if user is exist
                            var userid = {
                                user_id : result._id,
                                role : result.role
                            };               
                            //token
                            var token=TokenCtrl.token(userid);
                            //save it 
                            res.cookie('auth',token);
                            res.locals.data = {
                                is_user:true,
                                is_admin:result.role=="admin"?true:false,
                                data: token
                            };
                            next();
                        }
                        else{
                            return res.send({is_user:false,message: 'Please check the information' });
                        }
                    }
                }); 
            }           
        });
    }
    else{
        res.locals.data={
            data: false
        }
        next();
    }   
}
var logout=function(req,res,next){
    res.clearCookie('auth');
    res.send({message:'OK'})
}
module.exports.logout=logout;
module.exports.login=login;
module.exports.getAllUsers=getAllUsers;
module.exports.addUser=addUser;