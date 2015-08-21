/*
 *  Generic require role routing middleware
 */

var async = require('async'),
  mongoose = require('mongoose'),
  UserRole = mongoose.model('UserRole'),
  RoleResource = mongoose.model('RoleResource');

//////////
exports.initStatus = function(status,req, res, next){
  console.log("goodboy",status);
  var userRole = new UserRole();
  var roleResource = new RoleResource();
  var uid = req.user.uid;

  var logData = {
    url: req._parsedUrl.path, //完整的URL
    user: req.user.username, //用户名
    time: req._startTime, //时间
    operation: req.route.method, //操作类型
    data: req.body, //操作数据
    resource: req.route.path //资源路径
 }
  if(status == "salers"){
    roleResource.checkResource("salers",function(salerResource){
      var roleResource = salerResource;
      var flag = 0;
      for(var i=0;i<roleResource.length;i++){
          if(roleResource[i] != null) {
            if(roleResource[i].oper == logData.operation && roleResource[i].resource == logData.resource){
              flag=1;
              next();
            }
          }
      }
      if(flag == 0){
        res.send("without privilege");
      }
    });
  }else if(status == "no"){
  // console.log("operation: "+logData.operation);
  // console.log("resource: "+logData.resource);
  userRole.checkRole(uid,function(data){
    //console.log(data);
    var flag = 0;
    var reflag=0;
    var count = 0;
    for(var i =0 ;i < data.length;i++)
    {
      if(data[i] == "salers")
      {
        data.splice(i, 1);
      }
    }
    //console.log("data",data);
    if(data.length!=0){
        async.forEach(data,function(everyrole){
            roleResource.checkResource(everyrole,function(allResource){
               count = count + 1;
                var roleResource = allResource;
                for(var i=0;i<roleResource.length;i++){
                    // console.log(roleResource[i].oper);
                    // console.log(roleResource[i].resource);

                    if(roleResource[i] != null) {
                      if(roleResource[i].oper == logData.operation && roleResource[i].resource == logData.resource){
                          flag = 1;
                          if(flag==1 && reflag==0){
                            // console.log(everyrole +" has this resource");
                            //   console.log("can pass");
                              reflag=1;
                              next();
                          }
                      }
                    }
                }
                console.log("count",count);
                if(flag == 0&&reflag == 0 && count == data.length){
                  //console.log(everyrole +" has not this resource");
                  res.send("without privilege");
                }
            });
        });
    }
    else{
        console.log("you have no role");
        res.send("without privilege");
    }
  });
  }
}
exports.pass = function(req, res, next){
  //获取uid
  //通过uid获取角色id
  //通过角色id获取每个角色拥有资源
  //判断访问资源是否在资源池里面,进而判断是否拥有该资源权限
  if(req.user == undefined){
    res.send('without auth or user info');
    return;
  }
  var status = req.session.status;
  exports.initStatus(status,req, res, next);
};

//////////
exports.requireTest = function(req, res, next) {
  // console.log("requireTest...");
  var uid = req.user.uid;
  var userRole = new UserRole();
  userRole.checkRole(uid,function(data){
    // console.log(data);
      var flag = 0;
      for(var i=0;i<data.role.length;i++){
        if(data.role[i]=="admin"){
          flag = 1;
        }
      }
      if(flag == 1){
        console.log("can pass");
        next();
      }
      if(flag == 0){
        console.log("no way");
        res.send("without privilege");
      }
  });
};
/*
*验证管理员角色,
*
*/
exports.requireAdmin = function(req, res, next) {
  // console.log("requireAdmin...");
  // console.log(req.user.username);
  if(req.user.username == "caiyidong"){
    console.log("can pass");
    next();
  }
  else{
    console.log("no way");
    res.send("without privilege");
  }
};

exports.requireEspGroup = function(req, res, next) {
  // console.log("requireAdmin...");
  // console.log(req.user.username);
  if(req.user.username == "caiyidong" || req.user.username == "wangyonghe"){
    console.log("can pass");
    next();
  }
  else{
    console.log("no way");
    res.send("without privilege");
  }
};

exports.test = function(req,res,next){

  console.log("user-auth test");
  next();
};