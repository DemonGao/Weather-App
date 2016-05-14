mui.init();

var templates = {};
var getTemplate = function(name, header, content) {
	var template = templates[name];
	if (!template) {
		//预加载共用父模板；
		var headerWebview = mui.preload({
			url: header,
			id: name + "-main",
			styles: {
				popGesture: "hide", //popGesture: (String 类型 )窗口的侧滑返回功能
				//可取值"none"：无侧滑返回功能；"close"：侧滑返回关闭Webview窗口；"hide"：侧滑返回隐藏webview窗口。 仅iOS平台支持。
			},
			extras: {
				mType: 'main'
			}
		});
		//预加载共用子webview
		var subWebview = mui.preload({
			url: !content ? "" : content,
			id: name + "-sub",
			styles: {
				top: '45px',
				bottom: '0px',
			},
			extras: {
				mType: 'sub'
			}
		});
		subWebview.addEventListener('loaded', function() {
			//判断页面是否载入完毕
			subWebview.show();
		});
		subWebview.hide();
		headerWebview.append(subWebview);
		//iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
		if (mui.os.ios) { //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
			headerWebview.addEventListener('hide', function() {
				subWebview.hide("none");
			});
		}
		templates[name] = template = {
			name: name,
			header: headerWebview,
			content: subWebview,
		};
	}
	return template;
};
var initTemplates = function() {
	getTemplate('default', 'frame/main-head.html');
};
mui.plusReady(function() {
	//初始化模板
	initTemplates();
	//预加载
	//	preload();
});
var subWebview = null,
	template = null;
mui('#cards').on('tap', 'a', function() {
	var id = this.getAttribute('href');
	var href = this.href;
	var title=this.title;
	if (!mui.os.plus) {
		mui.openWindow({
			url: href,
			id: id,
			show: {
				aniShow: 'zoom-fade-out',
				duration: 300
			}
		});
		return;
	}
	if (subWebview == null) {
		//获取共用父窗体
		template = plus.webview.getWebviewById("default-main");
	}
	if (template) {
		subWebview = template.children()[0];
		subWebview.loadURL(href); //加载新URL页面触发Webview窗口从新的URL地址加载页面，如果url地址无效将导致页面显示失败。
		//修改共用父模板的标题
		mui.fire(template, 'updateHeader', {
			title: title,
			showMenu: false
		});
		template.show('slide-in-right', 150);
	}
});
//主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
//实现ios平台原生侧滑关闭页面；
if (mui.os.plus && mui.os.ios) {
	mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
		plus.webview.currentWebview().setStyle({
			'popGesture': 'none'
		});
	});
}