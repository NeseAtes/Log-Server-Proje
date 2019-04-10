var LogController = require("../controllers/LogController");
var BaseController = require("../controllers/BaseController");
var AppController = require("../controllers/AppController");
var HomeController = require("../controllers/HomeController");
var ESController= require("../controllers/ElasticSearchController");
var AdminController=require("../controllers/AdminController");
var UserController=require("../controllers/UserController");
var ChartController = require("../controllers/ChartController");
var TokenCtrl = require("../controllers/tokenCtrl");
var cookieParser = require('cookie-parser')

module.exports = function(app) {

    app.use(cookieParser())

    app.get('/',HomeController.index);  
    app.post('/login',BaseController.InitSession,UserController.login,BaseController.EndSession);
    app.get('/logout',UserController.logout);  
    app.get('/api/user',TokenCtrl.tokenControl, BaseController.InitSession,UserController.getAllUsers,BaseController.EndSession);
    app.post('/api/user/add',BaseController.InitSession,UserController.addUser,BaseController.EndSession);
    app.get('/api/log',TokenCtrl.tokenControl,BaseController.InitSession, LogController.index, BaseController.EndSession );
    app.post('/api/log/add',TokenCtrl.tokenControl,BaseController.InitSession, LogController.addlog, BaseController.EndSession);
    app.get('/api/log/sayi',TokenCtrl.tokenControl,BaseController.InitSession, LogController.sayi, BaseController.EndSession);

    app.get('/api/log/list',TokenCtrl.tokenControl, BaseController.InitSession, LogController.list, BaseController.EndSession);
    app.get('/api/apps',TokenCtrl.tokenControl, BaseController.InitSession, AppController.index, BaseController.EndSession );
    app.post('/api/apps/list/:app_id',TokenCtrl.tokenControl, BaseController.InitSession, AppController.list, BaseController.EndSession );
    app.post('/api/apps/add',TokenCtrl.tokenControl,BaseController.InitSession, AppController.AddApps,BaseController.EndSession);
    app.post('/api/apps/update/:app_id',TokenCtrl.tokenControl, BaseController.InitSession, AppController.updateApps, BaseController.EndSession);
    app.delete('/api/apps/delete/:app_id',TokenCtrl.tokenControl, BaseController.InitSession, AppController.deleteApps, BaseController.EndSession);
    app.post('/api/log/update/:log_id',TokenCtrl.tokenControl, BaseController.InitSession, LogController.updateLog, BaseController.EndSession);
    app.delete('/api/log/delete/:log_id',TokenCtrl.tokenControl, BaseController.InitSession, LogController.deleteLog, BaseController.EndSession);
    app.post('/api/es/createIndex',  ESController.createIndex);
    app.post('/api/es/addDocument', ESController.addDocument);
    app.post('/api/es/search', TokenCtrl.tokenControl,ESController.search);
    app.get('/api/es/mapping', ESController.mapp);
    app.post('/api/es/update/:id', ESController.update);

    app.get('/api/admin/requests',BaseController.InitSession,AdminController.get_userRequests,BaseController.EndSession);
    app.post('/api/admin/requests/add',BaseController.InitSession,AdminController.add_request,BaseController.EndSession);
    app.delete('/api/admin/requests/negativeReq',BaseController.InitSession,AdminController.negative_answer,BaseController.EndSession);
    app.post('/api/admin/requests/positiveReq',BaseController.InitSession,AdminController.positive_answer,BaseController.EndSession);

    app.post('/api/chart/add',TokenCtrl.tokenControl,BaseController.InitSession,ChartController.chartAdd, BaseController.EndSession);
    //app.post('/api/chart/update/:chart_id',TokenCtrl.tokenControl,BaseController.InitSession,ChartController.chartUpdate, BaseController.EndSession);
    app.post('/api/chart/delete',TokenCtrl.tokenControl,BaseController.InitSession,ChartController.chartDelete, BaseController.EndSession);
    app.get('/api/chart',TokenCtrl.tokenControl,BaseController.InitSession,ChartController.chartList, BaseController.EndSession);
    //app.post('/api/ws/look', WebSocketServerController.dblook);
    //app.post('/api/es/bulk', ESController.bulklama);
    app.get('/tokenControl', TokenCtrl.tokenControl);

    /*var db = require('../lib/mongodb')

    app.get('/', function(req, res, next) {
        var connection = db.getconnection()
        res.send("Hello");
    });*/

    var errorHandler = function(err, req, res, next) {
        if (res.locals.connection) {
            res.locals.connection.close();
        }
        res.json({
            data: null,
            error: err
        });
    };
    app.use(errorHandler);
};

//module.exports = function(wsapp){}