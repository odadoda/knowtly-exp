var libs = {
     util: require('/lib/enonic/util/util'),    
     portal: require('/lib/xp/portal'),
     thymeleaf: require('/lib/xp/thymeleaf')
}

exports.get = function(req) {
	
	var content = libs.portal.getContent();	
	var site = libs.portal.getSite();
	
	libs.util.log(site);//Configs[module.name]);
	libs.util.log(content);
	
	var colorParam = 'wornpiranha';
    if( typeof(site.data.siteConfig) == 'string' ){
        colorParam = site.data.siteConfig.config.colorscheme;
    } else {
        for(var i = 0; i < site.data.siteConfig; i++){
            if(typeof(site.data.siteConfig[i].config.colorscheme) != 'undefined' ){
                colorParam = site.data.siteConfig[i].config.colorscheme;
            } 
        }  
    }	
		
	var params = { 
    	colorScheme: colorParam, //(typeof(site.data.siteConfig.config) != 'undefined') ? site.data.siteConfig.config.colorscheme : 'wornpirahna',
		mainRegion: content.page.regions.main,
		content: content,
		message: "Hello pewpew",
		title: site._name
	}
	
	
	var view = resolve('note.html');
	
	return {
		body: libs.thymeleaf.render(view, params),
		contentType: 'text/html' 
	};
}; 