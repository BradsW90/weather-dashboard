var todayEl = document.querySelector(".todays-weather");
var forecastEl = document.querySelector(".future-weather");
var day = Date().split(" ");
day = " (" + day[1] + " " + day[2] + " " + day[3] + ") ";

var getCurrentWeather = function (city) {
  var todayWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=d4ca6ca9ef2a5707f5d7653823d99f6b&units=imperial";

  var forcast =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=d4ca6ca9ef2a5707f5d7653823d99f6b&units=imperial";

  fetch(todayWeather).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var iconCode = data.weather[0].icon;
        var weatherSymbol =
          "http://openweathermap.org/img/w/" + iconCode + ".png";
        latLon = [data.coord.lat, data.coord.lon];
        var weather = data;
        var uvIndex =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          latLon[0] +
          "&lon=" +
          latLon[1] +
          "&appid=d4ca6ca9ef2a5707f5d7653823d99f6b&units=imperial";
        console.log(data);
        fetch(uvIndex).then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              var uvNumber = data.current.uvi;
              var cityTitleEl = document.createElement("h3");
              cityTitleEl.setAttribute("class", "title");
              cityTitleEl.innerText = weather.name + day;
              todayEl.appendChild(cityTitleEl);
              var symbol = document.createElement("img");
              symbol.setAttribute("src", weatherSymbol);
              todayEl.appendChild(symbol);
              var tempEl = document.createElement("p");
              tempEl.innerText = "Temp: " + weather.main.temp + "\u00B0" + "F";
              todayEl.appendChild(tempEl);
              var windEl = document.createElement("p");
              windEl.innerText = "Wind: " + weather.wind.speed + "MPH";
              todayEl.appendChild(windEl);
              var humidityEl = document.createElement("p");
              humidityEl.innerText = "Humidity: " + weather.main.humidity + "%";
              todayEl.appendChild(humidityEl);
              var uvIndexEl = document.createElement("p");
              uvIndexEl.setAttribute("id", "uv-index");
              var uvColorEl = document.createElement("p");
              uvColorEl.setAttribute("id", "uv-color");
              uvColorEl.innerText = uvNumber;
              uvIndexEl.innerText = "UV Index: ";
              console.log(uvNumber);
              if (uvNumber < 3) {
                uvColorEl.style.backgroundColor = "rgb(0,225,0)";
              } else if (uvNumber > 3 && uvNumber < 5) {
                uvColorEl.style.backgroundColor = "rgb(225,225,0)";
              } else {
                uvColorEl.style.backgroundColor = "rgb(225,0,0)";
              }
              todayEl.appendChild(uvIndexEl);
              todayEl.appendChild(uvColorEl);

              console.log(data);
            });
          }
        });
      });
    }
  });

  fetch(forcast).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var fiveDay = document.createElement("h4");
        fiveDay.innerText = "5-Day Forecast:";
        forecastEl.appendChild(fiveDay);
        console.log("forecast ", data);
      });
    }
  });
};

getCurrentWeather("Charlotte");
