var stk  = require('stk/stk');

exports.get = function( req ){
    
    var site = execute('portal.getSite');
    var url = site.moduleConfigs[module.name].searchbloxpath;

    var searchbloxResult =  execute("knowtly.searchblox", {
        url: url,
        q: "test"
    });
    
    var resultObj = JSON.parse(searchbloxResult);
    
    log.info( resultObj.results['@hits'] );    
        
    var meta = {
        hits: searchbloxResult.results['@hits'] 
        query: searchbloxResult.results['@query'],
        start: searchbloxResult.results['@start'],
        end: searchbloxResult.results['@end'],
        currentpage: searchbloxResult.results['@currentpage']
    }
    
    var results = new Array();
    var resultArray = searchbloxResult.results.result;
    
    for(var i = 0; i < resultArray.length; i++){
        var content;
        content.title = resultArray[i].title;
        contont.description = resultArray[i].description;    
            
        results.appendChild(content);    
    }
        
    var data = {
        meta: meta,
        result: "pewpew" // searchbloxResult.results.result        
    };
     
/*     
    return {
        body: execute('thymeleaf.render', { view: view, model: params }),
        contentType: 'text/html' 
    };
*/
    
    return {
        body: data,
        contenType: 'application/json'
    };
    
};