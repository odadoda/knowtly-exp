//  Get stk to 
//var stk  = require('stk/stk');

//  define a get response
exports.get = function( req ){
    
    // Get site properties. 
    var site = execute('portal.getSite');
    
    // In the module.xml I have defined a textinput field where users can write in the url to the searchblox instance.  
    var url = site.moduleConfigs[module.name].searchbloxpath;
    
    // get result from the customised portal script. This name is defined in the java file.
    var searchbloxResult =  execute("knowtly.searchblox", {
        url: url,
        q: req.params.q
    });
    
    // Using JSON library to parse the string into a json object.
    var resultObj = JSON.parse(searchbloxResult);
    
    // Collecting some meta data about the search    
    var meta = {
        hits: resultObj.results['@hits'], 
        query: resultObj.results['@query'],
        start: resultObj.results['@start'],
        end: resultObj.results['@end'],
        currentpage: resultObj.results['@currentpage']
    }
    
    var results = new Array();
    var resultArray = resultObj.results.result;
    
    // Loop throu the result and save the data you need. The class and variable names can be found in the result from searchblox.
    for(var i = 0; i < resultArray.length; i++){
        var content = {};
        content.title = resultArray[i].title;
        content.markdownParsedBody = resultArray[i].description;    
        content.pubDate = resultArray[i].lastmodified;
        content.url = resultArray[i].url;
        results.push(content);    
    }
        
    // create an object with data to be used in the thymeleaf template
    var params = {
        meta: meta,
        notes: results,
    };
    
    // I am sending back a result in html format. I use the same "note-list" template as I use in another "part"
    var view = resolve('../../parts/note-list/note-list.html');
     
    // return the request with result 
    return {
        body: execute('thymeleaf.render', { view: view, model: params }),
        contentType: 'text/html' 
    };
};