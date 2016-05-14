var Weather_get = function(nwaiting) {
	mui.ajax('http://op.juhe.cn/onebox/weather/query', {
		data: {
			cityname: '烟台',
			key: '69a45338e81d01fb2b9e3d322fdc9e99'
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var weath = new Weather(data);
			weath.init();
			if(nwaiting){
				nwaiting.close();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
			mui.alert('获取超时,请重试!', '天气预报', '确定');
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
		}
	})
}
var Weather = function(data) {
	this.data = data;
}
Weather.prototype = {
	init: function() {
		console.log("成功!");
		var me=this;
		if (me.data.result == null) {
			mui.alert(me.data.reason, '消息', '确定');
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
			return;
		}
		var data = me.data.result.data;
		var realtime = data.realtime;
		var now_weather = realtime.weather; //
		var life = data.life; //当天的空调 紫外线 感冒...
		var weather = data.weather; //七天的天气
		var pm25 = data.pm25;
		//天气预报容器
		var weatherBox = document.createElement('div');
		//添加类
		weatherBox.className = 'weatherBox';
		//天气预报标题
		var weatherTitle = document.createElement('div');
		//添加类
		weatherTitle.className = 'weatherTitle';
		//添加标题内容
		weatherTitle.innerHTML = '<div class="title_header">' +
			'<p class="title_cityname">' + realtime.city_name + '<span id="1"><a href="selectcity.html">切换</a></span><p>' +
			'<p class="title_nowdate">' + realtime.date + '<p>' +
			'</div>' +
			'<div class="title_temperature">' + now_weather.temperature + '°<span>[' + realtime.time.split(':')[0] + ':' + realtime.time.split(':')[1] + '更新]</span></div>' +
			'<div class="title_info">' +
			'<img src="images/' + now_weather.img + '.png"/>' +
			'<span>' + now_weather.info + weather[0].info.night[2] + '°/' + weather[0].info.day[2] + '°</span>' +
			'</div>';
		//天气预报状态(空气质量 适度)						
		var weatherContent = document.createElement('div');
		//添加类
		weatherContent.className = 'weatherContent';
		//添加状态内容
		weatherContent.innerHTML =
			//遮盖层
			'<div class="masklayer"></div>' +
			//状态栏
			'<div class="State">' +
			'<div class="State_nowquality">空气质量:' + '&nbsp;' + pm25.pm25.quality + '</div>' +
			'<div class="State_nowhumidity">湿度:' + '&nbsp;' + now_weather.humidity + '%</div>' +
			'<div class="State_nowwind">' + realtime.wind.direct + realtime.wind.power + '</div>' +
			'</div>' +
			//7天天气预报
			'<div class="Week">' +
			'<div id="weatherdays" class="weatherDayBox"></div>' +
			'<canvas id="canvas" >不支持</canvas>' +
			'<div id="weathernights" class="weatherDayBox"></div>' +
			'</div>';
		//获取容器	

		var box = document.getElementById('box');
		//判断容器中是否已存在子容器,若存在则清除
		while (box.firstChild) {
			box.firstChild.style.opacity = '0';
			box.removeChild(box.firstChild);
		}
		//将天气盒子放入容器中
		box.appendChild(weatherBox);
		//将天气标题放到天气盒子中
		weatherBox.appendChild(weatherTitle);
		//将天气内容放到天气盒子中
		weatherBox.appendChild(weatherContent);
		//绘制天气走势
		WeatherCanvase(weather);
		//创建显示近7天气的天气 (白天)
		me.WeatherDays('weatherdays', weather);
		//创建显示近7天气的天气 (晚上)
		me.WeatherNights('weathernights', weather);
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
	},
	WeatherDays:function(id, weather){
		var id = document.getElementById(id);
		for (var i = 0; i < weather.length; i++) {
			id.innerHTML += '<div class="daysbox">' +
				'<p class="daysbox_week">星期' + weather[i].week + '</p>' +
				'<p class="daysbox_temperature">' + weather[i].info.day[1] + '</p>' +
				'<p class="daysbox_icon"><img src="images/' + weather[i].info.day[0] + '.png"/></p>' +
				'</div>';
		}
	},
	WeatherNights:function(id, weather){
		var id = document.getElementById(id);
		for (var i = 0; i < weather.length; i++) {
			id.innerHTML += '<div class="daysbox">' +
				'<p class="daysbox_icon"><img src="images/' + weather[i].info.night[0] + '.png"/></p>' +
				'<p class="daysbox_temperature">' + weather[i].info.night[1] + '</p>' +
				'<p class="daysbox_date">' + weather[i].date.split('-')[1] + '/' + weather[i].date.split('-')[2] + '</p>' +
				'<p class="daysbox_date">' + weather[i].info.day[3] + '</p>' +
				'<p class="daysbox_date">' + weather[i].info.day[4] + '</p>' +
				'</div>';
		}
	}
};