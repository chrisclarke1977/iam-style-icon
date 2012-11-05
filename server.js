var express = require('express'),
    path = require('path'),
    http = require('http'),
    icon = require('./routes/icons');
    fileup = require('./fileupload/lib/fileupload.js');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/icons', icon.findAll);
app.get('/icons/:id', icon.findById);
app.post('/icons', icon.addIcon);
app.put('/icons/:id', icon.updateIcon);
app.delete('/icons/:id', icon.deleteIcon);



http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
