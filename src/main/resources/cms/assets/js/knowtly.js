/*
*	knowtly v1
*	
*
*/
;(function ( $, window, document, undefined ){
	
	var pluginName = "knowtly";
	var me = {};
	
	console.log(this);
	var defaults = {
    
    	mainForm: this,
        commandlist: $('<ol class="' + pluginName + '_commandlist" ></ol>')
	}; 
	
	var commands = {};
	
    
	// construcor
	function Knowtly( element, options ){
        this.element = element;
        this.options = $.extend( {}, defaults, options ); 
        this.api = {
            'element': element,
            'options': this.options};
        this._defaults = defaults;
        this._name = pluginName;
        this.commands = $.fn[pluginName].commands;
        console.info('constructor done');
        
        this.init();   	
	}
	
	
	/*
	*   initialization
	*/
	Knowtly.prototype.init = function(){
        console.info('init starting');    
        //disaable the submit button
        $(this.element).on('submit', function(e){
            e.preventDefault();
            me.executeCommand();
        });
                 
        // trigger on input
        $(this.element).find('input[type="search"]').on( 'input', $(this).find('input[type="search"]'), this.filterInput );	
        
        console.info(this.api);
        $.fn[pluginName].api = this.api;
        console.log($.fn[pluginName].api);
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
	
	
	Knowtly.prototype.getOptions = function(){
        return me.options;	
	};
	
	
	// checks if input is a command or a search 
	Knowtly.prototype.filterInput = function(event){
    	if( typeof(me.commands[this.value]) == 'function' ){
			me.formatToCommandAppearance(this);
		}else {
    		me.search(this);
		}
    };
    
    
    // changes input text to a listitem in "valid commands"
	Knowtly.prototype.formatToCommandAppearance = function(inputElement){
        var commandItem = $('<li>'+inputElement.value+'</li>');
        me.options.commandlist.append(commandItem);
        $(inputElement).val('').attr('placeholder', '');	
	};
	
	
	// executes the first "comand" in commandlist, passing on arguments
	Knowtly.prototype.executeCommand = function(){
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
	
	/*  Global stuff */
	$.fn[pluginName].commands = {};
    $.fn[pluginName].api = {};
	
    
}( jQuery, window, document ));





/*
*   Add commands
*
*/

(function($){
    /*  command: NEW   */    
    var commands = {
        'new': function(args){
            
            var mainForm = $.fn.knowtly.api.element;
            
            console.log(mainForm);
            
            var wrapper = $('<section class="editor"></section>');
            var inputTitle = $('<input type="text" name="title" placeholder="Title" autofocus="true"/>');
            var inputBody  = $('<textarea name="body" placeholder="Body"></textarea>');
            
            wrapper.append(inputTitle);
            wrapper.append(inputBody);
            
            $(mainForm).append(wrapper);
            
    //        $.fn.knowtly.mainForm.appendChild(inputTitle);
    //        $.fn.knowtly.mainForm.appendChild(inputBody); 
            return this;           
        }
    };
    
    $.extend($.fn.knowtly.commands, commands);
    
    
})(jQuery);






