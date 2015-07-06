var stk  = require('stk/stk');

exports.get = function( req ){
    
    var site = execute('portal.getSite');
    var url = site.moduleConfigs[module.name].searchbloxpath;

    var searchbloxResult =  execute("knowtly.searchblox", {
        url: url,
        q: req.params.q
    });
    
    var resultObj = JSON.parse(searchbloxResult);
    
    var meta = {
        hits: resultObj.results['@hits'], 
        query: resultObj.results['@query'],
        start: resultObj.results['@start'],
        end: resultObj.results['@end'],
        currentpage: resultObj.results['@currentpage']
    }
    
    var results = new Array();
    var resultArray = resultObj.results.result;
    
    for(var i = 0; i < resultArray.length; i++){
        var content = {};
        content.title = resultArray[i].title;
        content.description = resultArray[i].description;    
        content.lastModified = resultArray[i].lastmodified;
        results.push(content);    
    }
        
    var data = {
        meta: meta,
        results: results,
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