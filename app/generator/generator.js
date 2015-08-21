var Page_Class = require('./Page');
var Indentation = require('./Indent');
var AutoLoader = require('./autoload-hogan.js');
var Sidenav_Class = require('./Sidenav');
var engine = require('hogan.js');

var path = {
 data : __dirname + '/../../views/data',
 views : __dirname + '/../../views',
 assets : '/assets',
 images : '/assets/images'
};

var site = JSON.parse(require('fs').readFileSync(path['data']+'/common/site.json' , 'utf-8'));//this site some basic site variables
site['protocol'] = 'http:';

var autoload = new AutoLoader(engine , path);

exports.generate = function(page_name, params){
	var page = new Page_Class( {'engine':engine, 'path':path, 'name':page_name, 'type':'page'} );
	page.initiate();

	var layout_name = page.get_var('layout');
	var layout = new Page_Class( {'engine':engine, 'path':path, 'name':layout_name, 'type':'layout'} );
	layout.initiate();

	var sidenav = new Sidenav_Class();

	if(layout.get_var('sidenav_navList'))
	{
		sidenav.set_items(layout.get_var('sidenav_navList'));
		sidenav.mark_active_item(page_name);
	}


	var context = { "page":page.get_vars() , "layout":layout.get_vars(), "path" : path , "site" : site };
	context['breadcrumbs'] = sidenav.get_breadcrumbs();
	context['createLink'] = function(value) {
		return value;
	};

	autoload.set_params(page_name , layout_name);

	context.params = params;

	var rendered_output = layout.get_template().render(context);
	return rendered_output;
	
};

