passport = require('passport');

CoreController = function(app) {

    app.get('/auth', function(req, res, next) {
      passport.authenticate('playlyfe', {}, function (err, user, info){
        if (!user) res.redirect('/pomodoro');
        if (err) res.redirect('/pomodoro');
        else next();
      })(req, res, next);
    }, function(req, res, next) {
      res.redirect('/pomodoro');
    }, function(err, req, res, next) {
      console.log(err);
      res.redirect('/pomodoro');
    });

    // Proxy requests to playlyfe server.
    app.all('/api/*', function(req, res) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.header("Pragma", "no-cache");
      res.header("Expires", 0);
      req.playlyfe.api(
        req.params[0],
        req.route.method.toUpperCase(),
        req.body,
        function(err, result, response) {
          if(err) {
            if(err.error === 'bad_response') {
              return res.send(err.statusCode, 'An error occured while contacting playlyfe.com');
            } else {
              return res.json(err.statusCode, err.data);
            }
          }
          res.json(result);
        }
      );
    });

    app.get('/logout', function (req, res) {
      req.logout();
      req.playlyfe.logout('http://games.playlyfe.com/pomodoro');
    });
};

module.exports = CoreController;
