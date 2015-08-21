var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User');

module.exports = function(passport, config) {

  // serialize sessions
  passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser");
    User.findOne({
      _id: id
    }, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(function(username, password, done) {
    console.log("LocalStrategy");
    User.findOne({
      username: username
    }, function(err, user) {
      //      console.log(user);
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      console.log("验证密码...");
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }));
};