function drawLine(myCxt, data, width, height,heightRatio,weather) {
	var i = 0,
		len = data.length;
	var cellWeidth = width / len;
	// 天气温度趋势
	myCxt.beginPath();
	myCxt.moveTo(20,height- heightRatio * data[i]);
	for (i = 1; i < len; i++) {
		myCxt.lineTo(i * cellWeidth + 20,height- heightRatio * data[i]);
	}
	
	myCxt.strokeStyle = '#FFF';
	
	myCxt.stroke();
	myCxt.closePath();

	//天气温度标记(即圈点和温度)
	for (var j = 0; j < len; j++) {
		myCxt.beginPath();
		//字体样式
//		myCxt.font='10px';
		myCxt.fillStyle = '#fff';
		//显示温度
		myCxt.fillText(data[j]+'°',j * cellWeidth + 20, height -heightRatio * data[j] -8);
		//显示
//		myCxt.strokeText('星期'+weather[j].week,j * cellWeidth+2, 20);
		myCxt.arc(j * cellWeidth + 20,height- heightRatio * data[j], 3, 0, 2 * Math.PI, true);
		myCxt.closePath();
		myCxt.fill();
	}

}

function getWeather(weather, time) {
	var len = weather.length;
	var myArray = new Array()
	for (var i = 0; i < len; i++) {
		myArray[i] = weather[i].info[time][2];
	}
	return myArray;
}

function WeatherCanvase(weather) {
	var canvas = document.getElementById('canvas');
	var width = document.getElementById('box').clientWidth;
	var height = 180;
	canvas.width = width;
	canvas.height = height;
	if (canvas.getContext('2d')) {
		var context = canvas.getContext('2d');
		//获取最高气温,并画出线
		var day_weather = getWeather(weather, "day");
		drawLine(context, day_weather, width,height, 5,weather);
		//获取最低气温,并画出线
		var night_weather = getWeather(weather, 'night');
		drawLine(context, night_weather, width,height, 5,weather);
	} else {
		alert("当前浏览器不支持canvase");
	}
}