var express = require('express'),
    path = require('path'),
    http = require('http'),
    icon = require('./routes/icons'),
    user = require('./routes/user'),
    pics = require('./routes/pics');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 61338);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/icons', icon.findAll);
app.get('/icons/:id', icon.findById);
app.post('/icons', icon.addIcon);
app.put('/icons/:id', icon.updateIcon);
app.delete('/icons/:id', icon.deleteIcon);

app.get('/populate', user.populate);
app.get('/login', user.login);
app.get('/users', user.findAll);
app.get('/users/:id', user.findOne);
app.post('/users', user.create);
app.put('/users/:id', user.update);
app.put('/reset', user.reset);
app.delete('/users/:id', user.destroy);
app.post('/pics', pics.upload);
app.get('/pics', pics.find);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
