var stk = require('stk/stk');

exports.get = function(req){
	
	var component = execute('portal.getComponent');
	
	var params = {
        editMode: req.mode === 'edit' ? true : false,
		component: component,
		leftRegion: component.regions["left"],
		rightRegion: component.regions["right"]
	};
	
	var view = resolve('layout-33-66.html');
	
	return stk.view.render(view, params);
};