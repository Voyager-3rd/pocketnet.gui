var applications = (function(){

	var self = new nModule();

	var essenses = {};

	var Essense = function(p){

		var primary = deep(p, 'history');

		var el, ed, oss, block = false;

		var actions = {

			download : function(os, clbk, githubalt){
				if (os){

					var ooobj = githubalt ? os.githubalt : os.github

					if (ooobj){

						globalpreloader(true)

						$.get(ooobj.url, {}, function(d){

							var assets = deep(d, 'assets') || [];

							var l = _.find(assets, function(a){
								return a.name == ooobj.name
							})

							if (l){

								var link = document.createElement('a');
							        link.setAttribute('href', l.browser_download_url);
							        link.setAttribute('download','download');
							        link.click();

							    if (clbk)
									clbk(l.browser_download_url)
							}

							globalpreloader(false)


						})

					}

				}
			},

		}

		var events = {
			block : function(){
				block = true

				setTimeout(function(){
					block = false
				}, 1000)
			}
		}

		var renders = {

			mainoss : function(os){
				renders.oss([os], el.c.find('.mainos'))
			},	

			oss : function(_oss, _el){

				self.shell({
					name :  'oss',
					data : {
						oss : _oss
					},

					el : _el || el.c.find('.oss')

				}, function(_p){

					_p.el.find('.downloadOs').on('click', function(){

						if(block) return

						events.block()

						var osid = $(this).closest('.os').attr('osid')

						var os = _.find(_oss, (os) => {return osid == os.id})

						if (os){
							actions.download(os, function(link){

							}, $(this).hasClass('githubalt'))
						}
						else{
							sitemessage('error')
						}
					})
				})
			}
		}

		var state = {
			save : function(){

			},
			load : function(){
				
			}
		}

		var initEvents = function(){
			

		}

		var make = function(){



			var filtered = _.filter(oss, function(os){
				return !ed.filter || ed.filter(os)
			})

			filtered = _.filter(filtered, function(os){
				return os.github || os.href
			})

			var fl = filtered.length

			var __os = os()

			if(window.cordova && isios() && __os == 'ios'){
				__os = 'macos'
			}

			var filtered = _.filter(oss, function(os){
				return os.id != __os
			})

			if(window.cordova && isios()){
				filtered = _.filter(filtered, (f) => {
					return f.id == 'macos'
				})
			}

			if (filtered.length != fl){
				renders.mainoss(oss[__os])

				if (parameters().re) {
					return
				}
			}
			else{
				if (parameters().re) {

					self.nav.api.load({
						open : true,
						href : 'index',
						history : true,
						replaceState : true
					})

					return
				}
			}
			
			renders.oss(filtered)

			
		}

		return {
			primary : primary,

			getdata : function(clbk, p){

				ed = deep(p, 'settings.essenseData') || {}

				oss = self.app.platform.applications[ed.key || 'ui']

				var data = {
					ed : ed,
					re : parameters().re
				};

				clbk(data);

			},

			destroy : function(){
				el = {};
				ed = {}
			},
			
			init : function(p){

				state.load();

				el = {};
				el.c = p.el.find('#' + self.map.id);

				initEvents();

				make()

				p.clbk(null, p);
			},

			wnd : {
				class : 'applicationWnd normalizedmobile maxheight withoutButtons withoutHeader',
			}
		}
	};



	self.run = function(p){

		var essense = self.addEssense(essenses, Essense, p);

		self.init(essense, p);

	};

	self.stop = function(){

		_.each(essenses, function(essense){

			window.rifticker.add(() => {
				essense.destroy();
			})

		})

	}

	return self;
})();


if(typeof module != "undefined")
{
	module.exports = applications;
}
else{

	app.modules.applications = {};
	app.modules.applications.module = applications;

}