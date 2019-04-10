const path  = require('path');
const VIEWS = path.join(__dirname, '../public');

var IndexAction = function (req,res,next) {
	res.sendFile('app.html', { root : VIEWS }); 
};

module.exports.index = IndexAction;