var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

var app = express();
var PORT = process.env.PORT || 3000; 

app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static('./public'));
app.use(methodOverride('_method'));

//Initial route to load the page for the Timer, weather information, etc. 
app.get('/', function(req, res){
	res.sendFile('./public/index.html');
});
//Listen to the port.
app.listen(PORT, function(){
	console.log('listening on port '+PORT);
});