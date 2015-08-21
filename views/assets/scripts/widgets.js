$(function() {

	$('#simple-colorpicker-1').ace_colorpicker({
		pull_right: true
	}).on('change', function() {
		var color_class = $(this).find('option:selected').data('class');
		var new_class = 'widget-header';
		if (color_class != 'default') new_class += ' header-color-' + color_class;
		$(this).closest('.widget-header').attr('class', new_class);
	});
	// scrollables
	$('.slim-scroll').each(function() {
		var $this = $(this);
		$this.slimScroll({
			height: $this.data('height') || 100,
			railVisible: true
		});
	});
});