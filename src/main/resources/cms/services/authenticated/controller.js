var stk = require('stk/stk');
var util = require('utilities');

exports.post = handlePost;
exports.get = handleGet;


function handlePost(req){
    var me = this;
    var reqParams = req.formParams;
    
    
    
}


function handleGet(req){
    
    var site = execute('portal.getSite');
    
     // get logged in user	
	var userResult = execute('content.getChildren', {
    	key: site._path + '/users'
	});
	
	stk.log(userResult);
	
	var view = {authenticated: userResult.total, test: 'pewpew'}
	
	//return '{"authenticated":' + userResult.total = 0? 'false':'true' + '}';
	return {
        body:  view,
        contentType: 'application/json' 
    };

}