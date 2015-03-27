$(document).ready(function() {

	$('#iframe_cover_before_loaded').show();
	$('#iframe_id').bind("load", function() {
		// this is used to hide the previous iframed page before current page is loaded.
		$('#iframe_cover_before_loaded').delay(100).fadeOut(500);
	});
	
})