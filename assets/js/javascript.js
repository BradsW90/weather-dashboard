//https://api.openweathermap.org/data/2.5/forecast?id=524901&appid={d4ca6ca9ef2a5707f5d7653823d99f6b}

var getCurrentWeather = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?q=" +
    city +
    "&appid={d4ca6ca9ef2a5707f5d7653823d99f6b}";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
};

getCurrentWeather("charolette, nc");
