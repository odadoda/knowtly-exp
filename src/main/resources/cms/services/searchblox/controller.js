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
        content.markdownParsedBody = resultArray[i].description;    
        content.pubDate = resultArray[i].lastmodified;
        content.url = resultArray[i].url;
        results.push(content);    
    }
        
    var params = {
        meta: meta,
        notes: results,
        result: "pewpew" // searchbloxResult.results.result        
    };
    
    var view = resolve('../../parts/note-list/note-list.html');
     
    return {
        body: execute('thymeleaf.render', { view: view, model: params }),
        contentType: 'text/html' 
    };
};