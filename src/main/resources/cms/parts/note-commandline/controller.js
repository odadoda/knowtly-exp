var stk  = require('stk/stk');
var util = require('utilities');

/**************************
*	GET
****************************/
exports.get = function( req ){

	var something = execute("knowtly.hello", {"name": "BOOM"});

	
	var actionUrl = execute('portal.componentUrl', {
		component: 'main/0'
	});
	
	// get tags
	var aggregationResult = execute('content.query', {
		start: 0,
		count: 0,
		sort: 'createdTime DESC',
		contentTypes: [module.name + ":note"],
		
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
	var view = resolve('note-commandline.html');
	
	return stk.view.render(view, param);	
};



/**************************
*	POST 
****************************/
exports.post = function( req ){
	
	var urlParams = req.formParams;
	
	if( urlParams.action == 'create' ){
        util.log('creates');	
	}else{
    	var query = "";
    	
    	if( urlParams.q ){
    		query = 'fulltext("data.title", "' + urlParams.q + '", "AND") OR ngram("data.tags", "' + urlParams.q + '", "AND")'; //OR data.tags LIKE '+urlParams.q+')';//
    	}
    	
    	var result = execute('content.query', {
    		start: 0,
    		count: 100,
    		sort: 'createdTime DESC',
    		contentTypes: [
    				module.name + ":note" 
    			],
    		query: query
    	});
    	
    	
    	var notes = new Array();
    	
    	for( var i = 0; i < result.contents.length; i++ ){
    		var data = result.contents[i].data;
    		
    		var date = new Date( result.contents[i].createdTime );
            date = util.getFormattedDate(date);
            
            data.pubDate = date;
    		notes.push(data);
    	}
    	
    	var param = {
    		notes: notes,
    		requestid: urlParams.requestid
    	}	
    	
    	
    	var view = resolve('../note-list/note-list.html');
	}
	return stk.view.render(view, param);
	
};