///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/express/express.d.ts'/>

var passport = require('passport');

var github = require('passport-github').Strategy;
var config = require('config');

var Auth = require('../helper/auth');
var db = require('../models');

export var login = function(req: any, res: any) {
    var user: any = req.user;
    var userName = user.username;
    var userId = user.id;

    //var Referer = req.header('Referer');
    var redirectPath = config.base.path+'/';
    //Login
    db.User.login({ github_id: userId }).then(function(result){
        if(result != null) {
            //Login succeeded.
            console.log("user is found.");
            var auth = new Auth.Auth(req, res);
            console.log(userId);
            console.log(result.name);
            auth.set(userId, result.name);
            console.log("Redirect.");
            throw 'abort chain';
            return null;
        } else {
            //User Registration
            return db.User.create({ name: userName, github_id: userId, password: ''});
        }
    })
    .then(function(result){
        console.log("user created.");
        var auth = new Auth.Auth(req, res);
        auth.set(userId, userName);
        redirectPath += 'register';
    })
    .catch(
    function(error) {
        if(error != 'abort chain') {
            console.log(error);
        }
    })
    .finally(function() {
        res.redirect(redirectPath);
    });
};

export var logout = function(req: any, res: any) {
    console.log('hi logout');
    var auth = new Auth.Auth(req, res);
    auth.clear();
    req.logout();
    res.redirect(config.base.path + '/');
};

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

(() => {
    if (config.passport.github.client_id == '') return;
    console.log(config.passport.host_url + "/login/github/callback");
    passport.use(new github({
        clientID: config.passport.github.client_id,
        clientSecret: config.passport.github.client_secret,
        callbackURL:  config.passport.host_url + "/login/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.error(config.passport.github);
        process.nextTick(function() {
            return done(null, profile);
        });
    }
    ));

})();

exports.passport = passport;
