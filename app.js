express = require('express');
passport = require('passport');
PlaylyfeOAuth2Strategy = require('passport-playlyfe');
RedisStore = require('connect-redis')(express);
Playlyfe = require('playlyfe-node-sdk');

// This must be changed for other applications.
var config = {
  clientID: 'YjFmYzg4ZGQtNDI5Yi00ZDY2LWE3OTQtOGM2N2NmMGIwZTFl',
  clientSecret: 'YzVlYjI2ZmQtYzAwNi00OWZhLTkyYWMtYzNhODdlN2EzMWFhMTc0YzI4YjAtODhlZC0xMWUyLThlMWUtNDE4ZTM0OThkMmRh',
  redirectURI: 'http://games.playlyfe.com/pomodoro/auth'
};

app = express();
app.set('domain', 'games.playlyfe.com');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser());
app.use(express.session({
  domain: { path: '/pomodoro' },
  secret: 'playlyfe',
  store: new RedisStore({ db: 1 })
}));
app.use(passport.initialize());
app.use(passport.session());

// use playlyfe middleware

app.use(new Playlyfe(config).connect());

app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.use(express.errorHandler({
  dumpException: true,
  showStack: true
}));

passport.use(new PlaylyfeOAuth2Strategy(config, function(accessToken, refreshToken, profile, done) {
  done(null, profile);
}));

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
