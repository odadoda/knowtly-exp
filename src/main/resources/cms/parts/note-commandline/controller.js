var stk  = require('stk/stk');
var util = require('utilities');
var markdown = require('markdown');

/**************************
*	GET
****************************/
exports.get = function( req ){
    
    var urlParams = req.params;
    var site = execute('portal.getSite');
    var searchbloxApiUrl = execute('portal.serviceUrl', {
       service: 'searchblox',
       params: {test:'test'}
    });
    
    var actionUrl = execute('portal.serviceUrl', {
    		service: 'knowtlyapi'
    	});
	
    var param = {
        searchbloxUrl: searchbloxApiUrl,
        actionUrl: actionUrl
    }
    var view = resolve('note-commandline.html');
    return stk.view.render(view, param);
};