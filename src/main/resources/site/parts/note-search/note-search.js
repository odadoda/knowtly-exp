var libs = {
     util: require('/lib/enonic/util/util'),
     content: require('/lib/xp/content'),
     thymeleaf: require('/lib/xp/thymeleaf'),
     portal: require('/lib/xp/portal')
}



/**************************
*	GET
****************************/
exports.get = function( req ){

	
	var actionUrl = libs.portal.componentUrl({
		component: 'main/0'
	});
	
	// get tags
	var aggregationResult = libs.content.query({
		start: 0,
		count: 0,
		sort: 'createdTime DESC',
		contentTypes: ["com.enonic.xp.modules.knowlty.knowtly-exp:note"],
		
		aggregations: {
	        tags: {
	            terms: {
	                field: "data.tags",
	                order: "_count desc",
	                size: 50
	            }
	        }
        
    }	});
	
	var tags = new Array();
	for( var i = 0; i < aggregationResult.total; i++ ){
		var localData = aggregationResult.aggregations.tags.buckets[i];
		tags.push(localData);
	}
	
	var param = {
		actionUrl: actionUrl,
		tags: tags,
		tagCount: aggregationResult.total
	};
	var view = resolve('note-search.html');
	
	return {
    	body: libs.thymeleaf.render(view, param),
    	contentType: 'text/html'
	}
		
};



/**************************
*	POST 
****************************/
exports.post = function( req ){
	
	var urlParams = req.formParams;
	var query = "";
	
	if( urlParams.q ){
		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR ngram("data.tags", "' + urlParams.q + '", "AND")'; //OR data.tags LIKE '+urlParams.q+')';//
	}
	
	var result = libs.content.query({
		start: 0,
		count: 100,
		sort: 'createdTime DESC',
		contentTypes: [
				app.name + ":note" 
			],
		query: query
	});
	
	
	var notes = new Array();
	
	for( var i = 0; i < result.contents.length; i++ ){
		var data = result.contents[i].data;
		
		var date = new Date( result.contents[i].createdTime );
        
        notes.push(data);
	}
	
	var param = {
		notes: notes,
		requestid: urlParams.requestid
	}	
	
	
	var view = resolve('../note-list/note-list.html');
	
	return {
    	body: libs.thymeleaf.render(view,param),
    	contentType: 'text/html'
	}
	
	
};