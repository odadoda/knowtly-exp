$(function(){
	
	var fireSearchFunctionTimerId = 0;
	
	$('#knowtly-search').submit(function(event){
		event.preventDefault();
	});
				
	$('#knowtly-search input[name="q"]')[0].oninput = function(){
		var currentForm = $(this).parent();

/*		if( fireSearchFunctionTimerId > 0){
			window.clearTimeout(fireSearchFunctionTimerId);
		}*/
	
		if( $('#knowtly-search').children('input[name="q"]').val().length > 0){
/*			fireSearchFunctionTimerId = window.setTimeout( function(){*/
				executeSearch( currentForm )/* } , 1000 ) */;
		} else {
			executeSearch( currentForm );	
		}
	};
	
	
	function executeSearch( form ){
		form.attr('data-requestcount', parseInt(form.attr('data-requestcount')) + 1);
		$.post( form.attr('action'), { 'q': form.children('[name="q"]').val(), 'requestid': form.attr('data-requestcount') }, function( data ){
			if( parseInt($(data).attr('data-for-request')) >= form.attr('data-requestcount')){
				$('.js-note-list').html( data );
			}
		});	
	}
	
});