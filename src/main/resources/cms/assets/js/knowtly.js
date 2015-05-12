;(function ( $ ){

/*
*	knowtly v1
*	
*
*/



$.fn.knowtly = function( options ){
	
	var stuff = $(this);
	var opts = $.extend({
		mainForm: this,
		mainWrapper: this.find('#commandLineWrapper'),
		mainCommandLine: this.find('input[type="search"]'),
		commands: {
			new : function(){
				console.log('pewpew newnew');		
			}
		}}, options);
	
	stuff.data('knowtly.opts', opts);
	
	var api = $.fn.knowtly.API;
	
	opts.mainForm.submit(function(event){
		event.preventDefault();
		//window.URL = '#' + opts.mainCommandLine.val();
	});
		
	
		
		
	opts.mainCommandLine.on("input", function(){
		if(typeof(opts.commands[opts.mainCommandLine.val()]) == 'function'){
			api.changeToCommand()
		}	
	});	
	
	return this;
}


$.fn.knowtly.API = {
	
	
	
	
	
	/*	command	*/
	changeToCommand: function(){
		console.log(this.opts());		
	},
	
	
	/*	send search request */
	search: function(){
		form.attr('data-requestcount', parseInt(form.attr('data-requestcount')) + 1);
		$.post( form.attr('action'), { 'q': form.children('[name="q"]').val(), 'requestid': form.attr('data-requestcount') }, function( data ){
			if( parseInt($(data).attr('data-for-request')) >= form.attr('data-requestcount')){
				$('.js-note-list').html( data );
			}
		});	
	}	
}

}(jQuery));