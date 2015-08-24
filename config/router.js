var async = require('async'),
	resource = require('express-resource'),
	generator = require('../app/generator/generator'),
	mongoose = require('mongoose'),
	express = require('express'),
	flash = require('connect-flash'),
	nodeExcel = require('excel-export');

////////contract-router
module.exports = function(app, passport, auth, log, notify, notifyApi, callAuth, dataAuth) {

	///合同操作接口
	var contract = require('../app/controller/contract');
	var apiUser = require('../app/controller/apiUser');
	app.get('/api/contracts', contract.index);
	app.get('/api/contract', dataAuth.desktop, contract.indexDesktop);
	app.post('/api/authorize', apiUser.authApi);
	app.get('/api/test/contracts', callAuth.authpass, contract.index);
	app.get('/api/contracts/:id/query', contract.query);
	app.get('/api/contracts/:id', callAuth.authpass, contract.rout);
	app.post('/api/contracts', notify.pass, log.show, contract.create);
	app.put('/api/contracts/:id', notify.pass,log.show, contract.update);
	app.del('/api/contracts/:id', notify.pass, contract.destroy);  //删除操作不用中间件,而是进入接口获取信息
	app.get('/api/contracts/tests', contract.test); //测试接口
	app.get('/api/contracts/:id/excel', notify.pass,contract.exportExcel);
  app.get('/api/contracts/page',notify.pass, contract.pageData); // 基于分页
	app.get('/api/contracts/:info/search',notify.pass, dataAuth.data, contract.pageSearch); // 基于搜索
	app.get('/api/contracts/:postJson/partyB/excel',notify.pass,contract.pieExcel); //饼状图链接乙方公司信息表格导出
	app.get('/api/contracts/:postJson/partyA/excel',notify.pass,contract.pieExcel); //饼状图链接甲方公司信息表格导出
	app.get('/api/contracts/excel/:keywords',notify.pass,dataAuth.data, contract.testExcel) //导出所有合同基本信息列表
	app.get('/api/contracts/statistical/:year',notify.pass,dataAuth.desktop,contract.statistical);
	app.get('/api/contracts/statistical/:year/:month/:type',notify.pass, dataAuth.desktop, contract.monthDetail);
	app.get('/api/test/saveAll', contract.saveAll);
	app.get('/api/test/updateAll', contract.updateAll);


	///合同模版接口
	var template = require('../app/controller/template');

	app.get('/api/templates', template.index);
	app.get('/api/templates/:id', template.show);
	app.post('/api/templates', template.create);
	app.put('/api/templates/:id', template.update);
	app.del('/api/templates/:id', template.destroy);


	///待办任务处理接口
	var task = require('../app/controller/task');

	app.get('/api/contracts/tasks/desktop', dataAuth.data, task.index);
	app.get('/api/contracts/:id/tasks/business',task.show); //单份合同查询待办任务的业务数据
	app.get('/api/contracts/tasks/graph/:startDate/:endDate', dataAuth.desktop, task.graphics);  //参数放在请求url里面
	app.put('/api/contracts/:id/tasks', log.show, task.update);
	app.get('/api/contracts/tasks/dones', dataAuth.data, task.done);  //查询过去7天已完成事件
	app.get('/api/contracts/tasks/tests', task.count);  //测试接口
	app.get('/api/contracts/tasks/return/:postData', notify.pass, dataAuth.data, task.testReturn);
	app.get('/api/contracts/tasks/wait/:postData', notify.pass, dataAuth.data, task.testWait);
	app.get('/api/contracts/tasks/unreturn/:postData',notify.pass, dataAuth.data, task.testUnreturn);
	app.get('/api/test/getEvents', task.getEvents);
	//业务测试接口

	//饼图明细分页接口
	var pieChart = require('../app/controller/pieChart');
	app.get('/api/pieDetail/:postData', dataAuth.data, pieChart.detail);


	//导出应收款表格
	app.get('/api/contracts/should/excel/:keywords',notify.pass,task.funShouldExport);
	//导出待收款表格
	app.get('/api/contracts/wait/excel/:keywords',notify.pass, task.funWaitExport);
	//导出已收款表格
	app.get('/api/fun', task.funExport);
	//导出已回款表格--按照搜索结果导出
	app.get('/api/contracts/return/excel/:keywords',notify.pass,task.funExport);

	//文件操作接口
	var files = require('../app/controller/file');

	app.get('/test', files.test);
	app.get('/files/download', files.download);
	app.get('/files/show/:id', files.show);
	app.post('/files/upload', files.upload);
	app.del('/files/destroy', files.destroy);
	app.get('/files/show/company/:id',files.showComp);
	////////////用户 接口
	var users = require('../app/controller/users');
    
  app.get('/api/users',notify.pass,users.index);
	app.get('/login', users.login);
	app.get('/signup', users.signup);
	app.get('/logout', users.logout);
	app.get('/api/users/:username', users.findByUsername);
	app.post('/api/users',notify.pass, users.create);
	app.put('/api/users', notify.pass,users.update);
	app.put('/api/users/:id',notify.pass,users.pwdUpdate);
	app.del('/api/users',notify.pass,users.destroy);
	app.post('/username', users.check);
	app.post('/users/session', passport.authenticate('local', {

		failureRedirect: '/login',
		failureFlash: 'Invalid email or password.'

	}), users.session);
	app.post('/api/paginator',users.pagesel);//分页查询用户信息

	/////用户-角色分配接口  //app.post('/api/roles/:roleId/users', );...?
	var userRoles = require('../app/controller/user-role');

  app.get('/api/testcontracts', notify.requireTest, contract.index);
  app.get('/api/role/tests', auth.requiresLogin, userRoles.test);
	app.get('/api/userroles', auth.requiresLogin, userRoles.index);
	app.get('/api/userroles/:id', auth.requiresLogin, userRoles.show);
	app.post('/api/userroles', userRoles.create);
	app.get('/api/roleusers/:roles', auth.requiresLogin, userRoles.getUser);//合同录入人
	//根据角色名称查看用户
	app.get('/api/roleusers/:rolename', auth.requiresLogin, userRoles.selUser);

    /////角色接口
	var roles = require('../app/controller/role');

	app.get('/api/roles', auth.requiresLogin, roles.index);
	app.get('/api/roles/:id', auth.requiresLogin, roles.show);
	app.post('/api/roles',roles.create);
	app.put('/api/roles/:id', roles.update);
	app.del('/api/roles/:id',roles.destroy);
	app.post('/roles/paginator', roles.pagesel);

	/////角色-资源分配接口
	var roleResource = require('../app/controller/role-resource');

	// app.get('/api/resource', roleResource.showResource);
	app.get('/api/roleresource', auth.requiresLogin, roleResource.index);
	app.post('/api/roleresource',roleResource.create);
	app.put('/api/roleresource',roleResource.update);
	app.get('/api/roleresource/:id', auth.requiresLogin, roleResource.show);
	app.get('/api/resourcetest', auth.requiresLogin, roleResource.test);
	app.get('/api/roleresource/desktop/sidenav',  auth.requiresLogin,  roleResource.sidenav);

	// app.post('/api/resource', roleResource.pagesel);

	// /////资源分配接口
	var resource = require('../app/controller/resource');

	app.get('/api/resource', auth.requiresLogin, resource.showResource);
	app.post('/api/resource',resource.create);
	app.put('/api/resource/:id',resource.update);
	app.del('/api/resource/:id',resource.destroy);
	

	/////////日志接口
	var logger = require('../app/controller/log');

	// app.get('/api/userlog',notify.pass, logger.userShow);*
	// app.get('/api/userlog/:id',notify.pass, logger.oneUserShow);*
	app.get('/api/operationlog/:id',notify.pass, logger.oneUserShow);
	app.get('/api/operationlog',notify.pass, logger.userShow);
	// app.post('/api/userlog',notify.pass, logger.userShow);*
	//app.get('/api/operationlog',notify.pass, logger.showLog);
	app.post('/api/operationlog',notify.pass, logger.userShow);
	// app.get('/api/businesslog',notify.pass, logger.businessShow);*
	app.get('/api/contracthistory',notify.pass, logger.businessShow);
	app.get('/api/contracthistory/:id',notify.pass, logger.businessOfOne);
	// app.get('/api/businesslog/:id/:version', logger.businessGetOne);*
	app.get('/api/contracthistory/:id/:version',notify.pass, logger.businessGetOne);
	app.del('/api/contracthistory/:id/:versionId',notify.pass, logger.businessDestroy);
	app.get('/api/business/:id/:version', logger.testBusiness);

    /////////公司接口
	var company = require('../app/controller/company');
	
  app.get('/api/company/:id',notify.pass, company.show);
	app.get('/api/company/:id/edit',company.initEdit);
	app.post('/api/company',notify.pass, company.create);
	app.put('/api/company',notify.pass,company.update);
	app.del('/api/company/:id',notify.pass,company.destroy);

    
    //测试用户验证系统验证分配
    //app.get('/api/contractAuth/:id',callAuth.pass, contract.index);
	

	app.get('/', auth.requiresLogin, function(req, res) {
		res.redirect('/login');
	});
	app.get('/desktop', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('desktop', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/desktop/:id/:start/:end/:type', auth.requiresLogin, function(req, res) {
		console.info(req.params.id);
		res.send(generator.generate('pieDetail', {
			_id: req.params.id,
			realname:req.user.realname,
			username: req.user.username,
			start: req.params.start,
			end: req.params.end,
			type:req.params.type
		}));
	});

	app.get('/desktop/:id', auth.requiresLogin,function(req, res) {
		res.send(generator.generate('pieDetail', {
			_id: req.params.id,
			realname:req.user.realname,
			username: req.user.username,
		}));
	});

	app.get('/fund', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('fund', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/fund/:start/:end', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('fund', {
			start: req.params.start,
			end: req.params.end,
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/fundWait', auth.requiresLogin, function(req, res) {
	//app.get('/fund/wait', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('fundWait', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/fundWait/:start/:end', auth.requiresLogin, function(req, res) {
	//app.get('/fund/wait/:start/:end', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('fundWait', {
			start: req.params.start,
			end: req.params.end,
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/fundShould', auth.requiresLogin, function(req, res) {
	//app.get('/fund/should', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('fundShould', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/fundShould/:start/:end', auth.requiresLogin, function(req, res) {
	//app.get('/fund/should/:start/:end', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('fundShould', {
			start: req.params.start,
			end: req.params.end,
			realname:req.user.realname,
			username: req.user.username
		}));
	});


	app.get('/contracts', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('contracts', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/contracts/new', auth.requiresLogin, notify.pass,function(req, res) {
		res.send(generator.generate('addContract', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/contracts/:id/edit', auth.requiresLogin, function(req, res) {
		console.info(req.params.id);
		res.send(generator.generate('editContract', {
			_id: req.params.id,
			realname:req.user.realname,
			username: req.user.username,
			ids: req.query.ids,
		}));
	});

	app.get('/contracts/:id/:version/log', auth.requiresLogin, function(req, res) {
		console.info(req.params.id);
		res.send(generator.generate('editContract', {
			_id: req.params.id,
			version: req.params.version,
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	app.get('/contracts/statistical/:year/:month/:type', auth.requiresLogin, function(req,res) {
        res.send(generator.generate('funCheck', {
            year: req.params.year,
            month: req.params.month,
            type: req.params.type,
            realname:req.user.realname,
            username: req.user.username
        }));
	});

	app.get('/operationlogs', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('operationlogs', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

	app.get('/usermanage', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('usermanage', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

	app.get('/rolemanage', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('rolemanage', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

	app.get('/resourcemanage', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('resourcemanage', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
	
	//菜单-授权管理
	app.get('/authorize', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('authorize', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

	app.get('/operationmanage', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('operationmanage', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});
    
    /*------公司信息管理的相关跳转--------*/
	app.get('/company/:type',auth.requiresLogin,function(req,res){
		var type = req.params.type;
		var name;
		switch(type){
            case "partyA":{name = "甲方";break;}
            case "partyB" :{name = "乙方";break;}
            default : name = null;
		}	
        res.send(generator.generate('company',{
        	type:{type:type,name:name},
        	realname:req.user.realname,
        	username:req.user.username
        }));
	});
   
    app.get('/company/new/:type', auth.requiresLogin, function(req, res) {
    	
    	var type = req.params.type;
		var name;
		switch(type){
            case "partyA":{name = "甲方";break;}
            case "partyB" :{name = "乙方";break;}
            default : name = null;
		}
		res.send(generator.generate('addCompany', {
			type:{type:type,name:name},
			realname:req.user.realname,
			username:req.user.username
		}));
	});

	app.get('/company/edit/:cid/:type', auth.requiresLogin, function(req, res) {
		console.info("type"+req.params.type);
		console.info("cid"+req.params.cid);
		var type = req.params.type;
		var cid = req.params.cid;
		var name;
		switch(type){
            case "partyA":{name = "甲方";break;}
            case "partyB" :{name = "乙方";break;}
            default : name = null;
		}
		res.send(generator.generate('editCompany', {
			cid:cid,
			type: {type:type,name:name},
			realname:req.user.realname,
			username: req.user.username
		}));
	});
   /*------公司信息管理的相关跳转--------*/
   app.get('/fundPlan', auth.requiresLogin, function(req, res) {

		res.send(generator.generate('fundPlan', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

   /*------系统版本信息--------*/
	app.get('/version', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('version', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

	app.get('/roleDetail', auth.requiresLogin, function(req, res) {
		res.send(generator.generate('roleDetail', {
			realname:req.user.realname,
			username: req.user.username
		}));
	});

};