var stk = require('stk/stk');
var util = require('utilities');
var markdown = require('markdown');

exports.get = function( req ){
  
    stk.log('note-single');
    
    /* get current content based on the content-id*/
    var result = portal.getContent();

    
    var notes = new Array();
    var data = result.data;
    
	var date = new Date( result.createdTime );
    date = util.getFormattedDate(date);
    
	data.markdownParsedBody = markdown.markdown.parse(data.text);
    data.pubDate = date;
    
	notes.push(data);
    
    stk.log(data);
    /* the data that thymeleaf will replace dummy text with */
    var model = {
        notes: notes                
    }
    
    /*  get a view object by using "resolve" function */
    var view = resolve('note-show.html');
    
    /* return an object with content in the body, and contenttype */ 
    return {
        body: execute('thymeleaf.render', {view: view, model: model}),
        contentType: 'text/html'   
    }
};