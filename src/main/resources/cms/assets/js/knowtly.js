$(function(){
	
	var fireSearchFunctionTimerId = 0;
	
	$('#knowtly-search').submit(function(event){
		event.preventDefault();
	});
				
	$('#knowtly-search').keyup(function(){
		var currentForm = $(this);
		if( fireSearchFunctionTimerId > 0){
			window.clearTimeout(fireSearchFunctionTimerId);
		}
		if( $('#knowtly-search').children('input[name="q"]').val().length > 0){
			
			fireSearchFunctionTimerId = window.setTimeout( function(){
				executeSearch( currentForm )} , 1000 );
		}
	});
	
	
	function executeSearch( form ){
		$.post( form.attr('action'), { 'q': form.children('[name="q"]').val() }, function( data ){
			$('.js-note-list').html( data );
		});	
	}
	
});