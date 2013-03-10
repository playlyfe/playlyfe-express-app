express = require('express');
passport = require('passport');
playlyfe = require('playlyfe-passport-oauth');

app = express();
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'playlyfe'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.use(express.errorHandler({
  dumpException: true,
  showStack: true
}));

playlyfe.initialize(passport, {
  clientID: 'YjFmYzg4ZGQtNDI5Yi00ZDY2LWE3OTQtOGM2N2NmMGIwZTFl',
  clientSecret: 'YzVlYjI2ZmQtYzAwNi00OWZhLTkyYWMtYzNhODdlN2EzMWFhMTc0YzI4YjAtODhlZC0xMWUyLThlMWUtNDE4ZTM0OThkMmRh',
  redirectURI: 'http://games.playlyfe.com/pomodoro/auth'
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

[
  'core'
].map(function(controllerName){
  controller = require('./controllers/' + controllerName);
  controller(app);
});

app.listen(3000);
