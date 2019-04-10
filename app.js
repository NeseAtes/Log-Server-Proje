var express = require('express');
var session = require('express-session');
var path = require('path');
var _  = require('lodash');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment');
var bodyParser = require('body-parser');
var appconfig = require('./config/app');
var port = process.env.PORT || appconfig.port;
var app = express();

var ws = require('./WS.js');
ws.init(app);

var db = require('./lib/mongodb')
db.establishConnection();


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*app.use(express.static(path.join(__dirname, 'public')));


app.set('views', 'pug');*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'))




require('./routes/routes.js')(app); 

/*app.use(function(req, res, next) {
  next(createError(404));
});*/

//var es = require('./controllers/ElasticSearchController');

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("req.baseUrl: ", req.baseUrl);
   console.log(err);
  //console.log(res);
  
  res.send(err);
});


app.listen(port);
console.log('The server is on: ' + port);