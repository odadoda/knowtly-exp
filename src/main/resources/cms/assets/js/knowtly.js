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
//    	actionUrl: 
        commandlist: $('<ol class="' + pluginName + '_commandlist" ></ol>')
	}; 
	
	var commands = {};
	
    
	// construcor
	function Knowtly( element, options ){
        this.element = element;
        this.options = $.extend( {actionUrl: $(element).attr('action')}, defaults, options ); 
        this.api = {
            'element': element,
            'options': this.options,
            'get':{
                'view': this.getView
            },
            'postRender': {
                'fireLibraries': this.fireLibraries
            }
            };
        this._defaults = defaults;
        this._name = pluginName;
        this.commands = $.fn[pluginName].commands;
        
        this.init();   	
	}
	
	
	/*
	*   initialization
	*/
	Knowtly.prototype.init = function(){
        //disaable the submit button
        $(this.element).on('submit', function(e){
            e.preventDefault();
            me.executeCommand();
        });
                 
        // trigger on input
        $(this.element).find('input[type="search"]').on( 'input', $(this).find('input[type="search"]'), this.filterInput );	
        
        $.fn[pluginName].api = this.api;
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
    	var form = $(me.element);
    	form.attr('data-requestcount', parseInt(form.attr('data-requestcount')) + 1);
		$.post( form.attr('action'), { 'q': form.find('[name="q"]').val(), 'requestid': form.attr('data-requestcount') }, function( data ){
			if( parseInt($(data).attr('data-for-request')) >= form.attr('data-requestcount')){
				$('.js-note-list').html( data );
			}
		});	
	};
	
	Knowtly.prototype.getView = function(view, contentType){
    	var result = $.ajax({
        	url: me.options.actionUrl,
        	type: 'GET',
        	data:{view: view, 
        	contentType: contentType},
            async: false
        });
    	return result.responseText;    	
	};
	
	Knowtly.prototype.fireLibraries = function(){
        $('.js-tagganator-me').tagator();
//         this.tinymce.init({'selector': '.js-tinymce-me'});	
        $('textarea.js-tinymce-me').tinymce({});
	};
	
	
	
	
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
            var newInputForm = $.fn.knowtly.api.get.view('new','note');
            var mainForm = $($.fn.knowtly.api.element).parent();
            $(mainForm).empty();
            $(mainForm).append(newInputForm);
            console.log($(mainForm).find('input:not([type="hidden"])').eq(0));
            $(mainForm).find('input:not([type="hidden"])').eq(0).focus();
            
            $.fn.knowtly.api.postRender.fireLibraries();
            
            return this;           
        }
    };
    
    $.extend($.fn.knowtly.commands, commands);
   
    
    
})(jQuery);






