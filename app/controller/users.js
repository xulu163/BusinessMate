/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserRole = mongoose.model('UserRole'),
  generator = require('../generator/generator'),
  util = require('../util/common');

exports.index = function(req, res) {
  console.log("user index");
  var user_menu = req.query.user_menu; //user_menu=1-->修改密码，需要解密密码
  var user = new User();
  if (user_menu == 1) {
    user.checkUserInfo(function(data) {
      for (var i = 0; i < data.length; i++) {
        // 密码解密
        var crypto = require('crypto');
        var key = "asdhjwheru*asd123-123"; //加密的秘钥
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var dec = decipher.update(data[i].password, 'hex', 'utf8');
        dec += decipher.final('utf8'); //解密之后的值
        data[i].password = dec;
      }
      res.send(data);
    });
  } else {
    user.checkUserInfo(function(data) {
      res.send(data);
    });
  }
};

exports.pagesel = function(req, res) {
  console.log("pagesel");
  var index = req.body.index; //拿到第几页
  var item = req.body.item; //拿到每页多少条
  var begin = item * (index - 1); //
  var end = item * index - 1;
  var user = new User();
  var newData = [];
  var m = 0;
  user.checkUserInfo(function(data) {
    var sendData = [];
    var k = 0;
    for (var i = begin; i < end + 1; i++) {
      if (i < data.length) {
        sendData[k] = data[i];
        k++;
      }
    }
    console.log("========sendData========");
    console.log(sendData);
    var getSendData = {
      count: data.length,
      data: sendData
    };
    res.send(getSendData);
  });
};

exports.signin = function(req, res) {};

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

/**
 * check username
 */
exports.check = function(req, res) {
  var user = new User();
  console.log(req.body.username);
  user.checkUsername(req.body.username, function(data) {
    console.log(data);
    if (data != "")
      res.send("false");
    else
      res.send("true");
  });
};

/**
 * Show login form
 */
exports.login = function(req, res) {

  console.log('login', req.user);
  if (req.user != null || req.user != undefined) {
    return res.redirect('/desktop');
  } else {
    res.send(generator.generate('login', {
      username: 'Justin'
    }));
  }
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
  res.send(generator.generate('login', {
    username: 'Justin'
  }));
};

/**
 * Logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */
exports.session = function(req, res) {
  var user = req.body;
  var username = user.username;
  var status = user.status;
  var userrole = new UserRole();
  userrole.checkRoleName(username, function(data) {
    console.log("www", data);
    var flag = false;
    //如果选择销售角色，判断该用户有没有销售角色
    if (status == "salers") {
      for (var i = 0; i < data.length; i++) {
        if (data[i] == "salers") {
          flag = true;
        }
      }
      console.log("flag:::", flag);
      //如果该用户有销售角色，吧该角色放进cookie
      if (flag) {
        req.session.status = status;
        res.send("success");
      } else {
        req.logout();
        res.send("error");
      }
    } else {
      var simbol = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "salers") {
          simbol = true;
        }
      }
      if (simbol) {
        req.session.status = status;
        res.send("success");
      } else {
        req.logout();
        res.send("error");
      }
    }
  });
};

/**
 * Create user
 */
exports.create = function(req, res) {
  console.log(req.body);
  if (req.body['password'] != req.body['password2']) {
    req.flash("password error");
    return res.redirect('/login');
  }
  var rdata = req.body;
  var user = new User();
  var userRole = new UserRole();
  //密码加密
  var crypto = require('crypto');
  var key = "asdhjwheru*asd123-123"; //加密的秘钥
  var cipher = crypto.createCipher("aes-256-cbc", key)
  var crypted = cipher.update(rdata.password, 'utf8', 'hex');
  crypted += cipher.final('hex');
  rdata.password = crypted; //加密之后的值

  user.getUnique(function(data) { //生成唯一用户id
    console.log(data);
    var getUser = {
      uid: data,
      realname: rdata.realname,
      username: rdata.username,
      email: rdata.email,
      password: rdata.password,
      regin: rdata.regin
    };
    var getUserRole = {
      uid: data,
      username: rdata.username,
      realname: rdata.realname,
      role: rdata.role
    };
    user = new User(getUser);
    user.save(function(err) {
      if (err) {
        return res.send("fail insertUser");
      } else {
        userRole = new UserRole(getUserRole);
        userRole.save(function(error) {
          if (error) {
            return res.send("fail insertUserRole");
          }
          return res.send('success insertUser and insertUserRole');
        });
      }
    });
  });
};

/**
 *  Show profile
 */
exports.show = function(req, res) {
  var user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

exports.destroy = function(req, res, next) {
  var rdata = req.body;
  var user = new User();
  var userRole = new UserRole();
  var uid = rdata.uid;
  user.removeUserData(uid, function(data) {
    console.log("remove user successfully");
    userRole.removeData(uid, function(data) {
      console.log("remove user-role successfully");
      res.send("result:" + data);
    });
  });
};

exports.update = function(req, res, next) {
  var rdata = req.body;
  var user = new User();
  var userRole = new UserRole();
  var uid = rdata.uid;
  if (rdata.pwdChange == 1) {
    console.log("修改用户时修改过密码");
    var crypto = require('crypto');
    var key = "asdhjwheru*asd123-123"; //加密的秘钥
    var cipher = crypto.createCipher("aes-256-cbc", key)
    var crypted = cipher.update(rdata.password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    rdata.password = crypted; //加密之后的值
  }

  var getUser = {
    uid: rdata.uid,
    realname: rdata.realname,
    username: rdata.username,
    email: rdata.email,
    password: rdata.password,
    regin: rdata.regin
  };
  var getUserRole = {
    uid: rdata.uid,
    username: rdata.username,
    realname: rdata.realname,
    role: rdata.role
  };
  user.updateUser(uid, getUser, function(result1) {
    console.log("update user successfully");
    console.log(result1);
    userRole.updateUserRole(uid, getUserRole, function(result2) {
      console.log("update user-role successfully");
      console.log(result2);
      res.send("result:" + result2);
    });
  });
};

exports.findByUsername = function(req, res) {
  var username = req.params['username'];
  console.log(username);
  var user = new User();
  user.checkUsername(username, function(data) {
    console.log(data);
    res.send(data);
  });
};

exports.pwdUpdate = function(req, res) {
  var uid = req.params['id'];
  var crypto = require('crypto');
  var key = "asdhjwheru*asd123-123"; //加密的秘钥
  var cipher = crypto.createCipher("aes-256-cbc", key)
  var crypted = cipher.update(req.body.password, 'utf8', 'hex');
  crypted += cipher.final('hex');
  var newpwd = crypted;
  console.log('newpwd');
  console.log(req.body.password);
  var getUser = {
    uid: uid,
    username: req.body.username,
    realname: req.body.realname,
    email: req.body.email,
    password: newpwd,
    regin: req.body.regin
  };
  var user = new User();
  user.updateUser(uid, getUser, function(result1) {
    res.send("update successfully");
  });
};