var express = require('express'),
	resource = require('express-resource'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	auth = require('./config/middlewares/authorization'),
	http = require('http');

//引入配置文件
var env = process.env.NODE_ENV || 'development',
	config = require('./config/config')[env];

//启动数据库连接
mongoose.connect(config.db);

//引入所有model
var models_path = config.root + '/app/model';
fs.readdirSync(models_path).forEach(function(file) {
	if (file != 'middleModel')
		require(models_path + '/' + file);
});

//passport config
require('./config/passport')(passport, config);

//引入配置文件、环境设置、路由
var app = express();

//引入配置文件、环境设置
var setting = require('./config/setting')(app, config, passport, auth);

//记录日志中间件
var log = require('./config/middlewares/log');

//用户权限中间件
var notify = require('./config/middlewares/notify');

var notifyApi = require('./config/middlewares/notifyApi');

var dataAuth = require('./config/middlewares/dataAuth');

var callAuth = require('./config/middlewares/callAuth');
//引入路由
var router = require('./config/router')(app, passport, auth, log, notify, notifyApi, callAuth, dataAuth);

//启动服务器
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});