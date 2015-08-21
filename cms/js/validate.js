define([], function() {
	var Validate = {
		containChinese: function(text) {

			if (/.*[\u4e00-\u9fa5]+.*$/.test(text))
				return true;

			return false;
		};

		return Validate;
	}
});