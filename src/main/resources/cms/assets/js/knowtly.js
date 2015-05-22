
/*
*	knowtly v1
*	
*
*/


;(function ( $, window, document, undefined ){
	
	var pluginName = "knowtly";
	var me = {};
	
	var defaults = {
    	mainForm: this,
        commandlist: $('<ol class="' + pluginName + '_commandlist" ></ol>')
	}; 
	
	var commands = {};
	
	// construcor
	function Knowtly( element, options ){
        this.element = element;
        this.options = $.extend( {}, defaults, options ); 
        this._defaults = defaults;
        this._name = pluginName;
        this.commands = commands;
        this.init();   	
        console.info('constructor done');
	}
	
	Knowtly.prototype.init = function(){
        
        //disaable the submit button
        $(this.element).on('submit', function(e){
            e.preventDefault();
            me.executeCommand();
        });
                 
        // trigger on input
        $(this.element).find('input[type="search"]').on( 'input', $(this).find('input[type="search"]'), this.filterInput );	
        
        // init commands
        commands = $.extend(commands, $.fn[pluginName].commands);
        console.log(commands);
        console.log('init done');
    }
	
	
	/*
    *   Define the plugin 
	*/
	$.fn[pluginName] = function( options ){
    	return this.each(function(){
        	if( !$.data(this, 'plugin_' + pluginName) ){
            	me = new Knowtly(this, options);
            	$.data(this, 'plugin_' + pluginName, me);
        	}
    	});
    }
	
	
	// checks if input is a command or a search 
	Knowtly.prototype.filterInput = function(event){
    	if( typeof(commands[this.value]) == 'function' ){
			me.formatToCommandAppearance(this);
		}else {
    		me.search(this);
		}
    };
    
    
    // changes input text to a listitem in "valid commands"
    
	Knowtly.prototype.formatToCommandAppearance = function(inputElement){
        var commandItem = $('<li>'+inputElement.value+'</li>');
        me.options.commandlist.append(commandItem);
        $(inputElement).val('');	
	};
	
	
	// executes the first "comand" in commandlist, passing on arguments
	Knowtly.prototype.executeCommand = function(){
    	console.log(me.commands[me.options.commandlist.children('li').eq(0).html()]);
        me.commands[ me.options.commandlist.children('li').eq(0).html() ]();
	};
	
	
	Knowtly.prototype.search = function( inputElement ){
        /*form.attr('data-requestcount', parseInt(form.attr('data-requestcount')) + 1);
		$.post( form.attr('action'), { 'q': form.children('[name="q"]').val(), 'requestid': form.attr('data-requestcount') }, function( data ){
			if( parseInt($(data).attr('data-for-request')) >= form.attr('data-requestcount')){
				$('.js-note-list').html( data );
			}
		});*/		
	}
	
	Knowtly.prototype.openEditorView = function(){
        console.log('opening view');	
	}
	
	/* Add defualt commands*/
	
	
	$.fn[pluginName].commands = {'fest': function(args){console.log('pewpew ' + args)}};
	
	

}(jQuery, window, document));





/*
*   Add commands
*
*/

(function($){
    /*  command: NEW   */    
    var commmand_new = {
        'new': function(args){
            console.log('pewpew opening view');    
        }
    };
    
    $.extend($.fn.knowtly.commands, commmand_new);
    
    
    
})(jQuery);






