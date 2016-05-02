function drawLine(myCxt, data, width, height,heightRatio) {
	var i = 0,
		len = data.length;
	var cellWeidth = width / len;
	myCxt.beginPath();
	myCxt.moveTo(20,height- heightRatio * data[i]);
	for (i = 1; i < len; i++) {
		myCxt.lineTo(i * cellWeidth + 20,height- heightRatio * data[i]);
	}
	myCxt.strokeStyle = '#FFF';
	myCxt.stroke();
	myCxt.closePath();

	for (var j = 0; j < len; j++) {
		myCxt.beginPath();
		myCxt.font="13px Arial";
		myCxt.strokeText(data[j]+'°',j * cellWeidth + 20, height -heightRatio * data[j] -10);
		myCxt.arc(j * cellWeidth + 20,height- heightRatio * data[j], 3, 0, 2 * Math.PI, true);
		myCxt.closePath();
		myCxt.fillStyle = '#fff';
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
	var height = 200;
	canvas.width = width;
	canvas.height = height;
	if (canvas.getContext('2d')) {
		var context = canvas.getContext('2d');
		//获取最高气温,并划出线
		var day_weather = getWeather(weather, "day");
		drawLine(context, day_weather, width,height, 5);
		//获取最低气温
		var night_weather = getWeather(weather, 'night');
		drawLine(context, night_weather, width,height, 5);
	} else {
		alert("当前浏览器不支持canvase");
	}
}