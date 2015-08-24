define([], function() {

	var server = "http://localhost:3000";//http://10.108.1.65

	return {
		Server: function(path) {
			return server + "/api/" + path;
		}
	};

});