var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');

// -------------- serve static folders -------------- //
app.use('/js', express.static(path.join(__dirname, 'js')))

// -------------- variable definition -------------- //

// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    console.log('no sub-page');
    res.sendFile(__dirname + '/index.html');
});


// -------------- listener -------------- //
var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});