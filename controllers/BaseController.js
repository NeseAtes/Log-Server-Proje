var conf = require('../config/database');
var db = require('../lib/mongodb');

var InitSession = function(req, res, next)
{
    var connection =db.getconnection();
    //console.log(connection);
    res.locals.connection = connection;
    var dbname = 'log';
    res.locals.database = connection.db(dbname);
    next();
   
};

var EndSession = function(req, res, next)
{
    //console.log("EndSession");
    /*if (res.locals.connection) {
        res.locals.connection.close();
    }*/
    if (res.locals.responseType && res.locals.responseType == "xml") {
        res.send(res.locals.data);
        res.end();
    } 
    else if (res.locals.responseType && res.locals.responseType == "file") { 
        res.end();
    } 
    else {
        res.json(res.locals.data);
    }
};

module.exports.InitSession = InitSession;
module.exports.EndSession = EndSession;

