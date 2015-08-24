/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	fs = require('fs'),
	Repository = require('./repository');

//文件模型
var FileSchema = mongoose.Schema({ //创建文件模型对象
	contractId: String,
	name: []
});


FileSchema.methods = {

	test: function() {
		console.info("=======test");
	},

	readdir: function(getDir, callback) {},

	deleteFolder: function(path, callback) {
		console.log("luo deleteFolder-------------");
		var files = [];
		if (fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function(file, index) {
				var curPath = path + "/" + file;
				if (fs.statSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
		callback("luonice");
	}
}

mongoose.model('File', FileSchema); //创建新文件对象,并关联到模型