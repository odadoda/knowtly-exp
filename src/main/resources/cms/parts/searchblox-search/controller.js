var stk  = require('stk/stk');

/********************************
*   Searchblox controller
*********************************/
exports.get = function( req ){
    
    var view = resolve('search-form.html');
    var site = execute('portal.getSite');
    stk.log(site);
    stk.log(site.moduleConfigs[module.name].searchbloxpath);
    
    var serviceUrl = execute('portal.serviceUrl', {
        service: 'searchblox'
    });
        
    stk.log(serviceUrl);
        
    var actionUrl = execute('portal.componentUrl', {
        component: 'main/0'
    });
    
    var params = {
        actionUrl: actionUrl,
        serviceUrl: serviceUrl    
    }
        
    return {
        body: execute('thymeleaf.render', { view: view, model: params }),
        contentType: 'text/html' 
    };

    
}
