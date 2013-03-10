passport = require('passport');
playlyfe = require('playlyfe-passport-oauth');

CoreController = function(app) {

  app.get('/auth', passport.authenticate('playlyfe'), function(req, res, next) {
    res.redirect('/pomodoro');
  });

  app.all('/api/*', playlyfe.proxy());

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/pomodoro');
  });
};

module.exports = CoreController;
