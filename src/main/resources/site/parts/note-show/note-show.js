var libs = {
     util: require('/lib/enonic/util/util'),
     content: require('/lib/xp/content'),
     thymeleaf: require('/lib/xp/thymeleaf'),
     portal: require('/lib/xp/portal')
}

var months = ['January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



exports.get = function( req ){
      
    /* get current content based on the content-id*/
    var currentContent = libs.portal.getContent();
    libs.util.log(currentContent);
    
    var notes = Array();
    
    
    var note = {};
	if(currentContent.type == 'wpsync:wordpresspost'){
		var date = new Date( currentContent.data.dategmt );
        note.contentUrl = libs.portal.pageUrl({id: currentContent._id});
        note.markdownParsedBody = currentContent.data.content;
        note.pubDate = date.getDate() + ' ' + months[date.getMonth()]  + ' ' + date.getFullYear();
        note.title = currentContent.data.title;
        note.tags = currentContent.data.tags;            
    }
    
	notes.push(note);
    
    /* the data that thymeleaf will replace dummy text with */
    var model = {
        notes: notes                
    }
    
    /*  get a view object by using "resolve" function */
    var view = resolve('note-show.html');
    
    /* return an object with content in the body, and contenttype */ 
    return {
        body: libs.thymeleaf.render(view,model),
        contentType: 'text/html'   
    }
};