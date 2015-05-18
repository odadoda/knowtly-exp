$(function(){
	
	$('#knowtly-commandline').knowtly({commandlist: $('.validCommands')});
	
	/*
	$('#knowtly-search').submit(function(event){
		event.preventDefault();
	});
				
	$('#knowtly-search input[name="q"]')[0].oninput = function(){
		executeSearch( $(this).parent() );
	};
	
	function executeSearch( form ){
		form.attr('data-requestcount', parseInt(form.attr('data-requestcount')) + 1);
		$.post( form.attr('action'), { 'q': form.children('[name="q"]').val(), 'requestid': form.attr('data-requestcount') }, function( data ){
			if( parseInt($(data).attr('data-for-request')) >= form.attr('data-requestcount')){
				$('.js-note-list').html( data );
			}
		});	
	}
	*/
});