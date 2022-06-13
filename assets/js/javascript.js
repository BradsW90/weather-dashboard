//global variables to access in functions
var todayEl = document.querySelector(".todays-weather");
var forecastEl = document.querySelector(".future-weather");
var searchContainerEl = document.querySelector(".search-container");
var buttonEl = document.getElementById("search");
var searchEl = document.getElementById("city-search");
var weatherContainerEl = document.querySelector(".weather-container");
var day = Date().split(" ");
day = " (" + day[1] + " " + day[2] + " " + day[3] + ") ";

//runs using passed in city to call todays weather, and forecast
var getCurrentWeather = function (city) {
  var todayWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=d4ca6ca9ef2a5707f5d7653823d99f6b&units=imperial";

  var forcast =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=d4ca6ca9ef2a5707f5d7653823d99f6b&units=imperial";

  //fetches todays weather
  fetch(todayWeather).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        //removing any existing weather elements to replace them
        while (todayEl.firstChild) {
          todayEl.removeChild(todayEl.firstChild);
        }

        //gets the icon data for img
        var iconCode = data.weather[0].icon;

        //gets apporpriate img based on icon code
        var weatherSymbol =
          "http://openweathermap.org/img/w/" + iconCode + ".png";

        //gets latitude and longitude of searched city to find uvindex
        latLon = [data.coord.lat, data.coord.lon];

        var weather = data;

        //pulls different data array to get access to UV index
        var uvIndex =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          latLon[0] +
          "&lon=" +
          latLon[1] +
          "&appid=d4ca6ca9ef2a5707f5d7653823d99f6b&units=imperial";

        //console.log(data);

        //fetches for uv index
        fetch(uvIndex).then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              //dynamically create weather elements based on city search
              //grab uv index number
              var uvNumber = data.current.uvi;

              //city name element
              var cityTitleEl = document.createElement("h3");
              cityTitleEl.setAttribute("class", "title");
              cityTitleEl.innerText = weather.name + day;
              todayEl.appendChild(cityTitleEl);

              //weather icon
              var symbol = document.createElement("img");
              symbol.setAttribute("src", weatherSymbol);
              todayEl.appendChild(symbol);

              //temp diplay
              var tempEl = document.createElement("p");
              tempEl.innerText = "Temp: " + weather.main.temp + "\u00B0" + "F";
              todayEl.appendChild(tempEl);

              //wind display
              var windEl = document.createElement("p");
              windEl.innerText = "Wind: " + weather.wind.speed + "MPH";
              todayEl.appendChild(windEl);

              //humidity display
              var humidityEl = document.createElement("p");
              humidityEl.innerText = "Humidity: " + weather.main.humidity + "%";
              todayEl.appendChild(humidityEl);

              //uv index display and surrounding color setup
              var uvIndexEl = document.createElement("p");
              uvIndexEl.setAttribute("id", "uv-index");
              var uvColorEl = document.createElement("p");
              uvColorEl.setAttribute("id", "uv-color");
              uvColorEl.innerText = uvNumber;
              uvIndexEl.innerText = "UV Index: ";

              //console.log(uvNumber);
              if (uvNumber < 3) {
                uvColorEl.style.backgroundColor = "rgb(0,225,0)";
              } else if (uvNumber > 3 && uvNumber < 5) {
                uvColorEl.style.backgroundColor = "rgb(225,225,0)";
              } else {
                uvColorEl.style.backgroundColor = "rgb(225,0,0)";
              }
              todayEl.appendChild(uvIndexEl);
              todayEl.appendChild(uvColorEl);

              //console.log(data);
            });
          }
        });
      });
    }
  });

  //fetches forecast
  fetch(forcast).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        //remove old forecast data
        while (forecastEl.firstChild) {
          forecastEl.removeChild(forecastEl.firstChild);
        }

        //title for forecast
        var fiveDay = document.createElement("h4");
        fiveDay.innerText = "5-Day Forecast:";
        forecastEl.appendChild(fiveDay);
        //console.log("forecast ", data);

        //wrapper handling forecast elements
        var forecastWrapperEl = document.createElement("div");
        forecastWrapperEl.setAttribute("class", "forecast-wrapper");
        forecastEl.appendChild(forecastWrapperEl);

        //dynaically loops through in iterations to get the 3 o'clock weather
        for (i = 4; i < 37; i = i + 8) {
          //gets currently indexed weather icon code
          var forecastIcon = data.list[i].weather[0].icon;

          //gets currently indexed icon
          var forecastSymbol =
            "http://openweathermap.org/img/w/" + forecastIcon + ".png";

          //create forecast card
          var forecastCardEl = document.createElement("div");
          forecastCardEl.setAttribute("class", "forecast-card");

          //handles weather date
          var cardDateEl = document.createElement("h4");
          var forecastDate = data.list[i].dt_txt.split(" ");
          fixedDate = forecastDate[0].split("-");
          cardDateEl.innerText =
            fixedDate[1] + "/" + fixedDate[2] + "/" + fixedDate[0];
          forecastCardEl.appendChild(cardDateEl);

          //displays weather icon
          var forecastSymbolEl = document.createElement("img");
          forecastSymbolEl.setAttribute("src", forecastSymbol);
          forecastCardEl.appendChild(forecastSymbolEl);

          //displays temp
          var forecastTempEl = document.createElement("p");
          forecastTempEl.innerText =
            "Temp: " + data.list[i].main.temp + "\u00B0" + "F";
          forecastCardEl.appendChild(forecastTempEl);

          //displays wind
          var forecastWindEl = document.createElement("p");
          forecastWindEl.innerText = "Wind: " + data.list[i].wind.speed + "MPH";
          forecastCardEl.appendChild(forecastWindEl);

          //humid
          var forecastHumidEl = document.createElement("p");
          forecastHumidEl.innerText =
            "Humidity: " + data.list[i].main.humidity + "%";
          forecastCardEl.appendChild(forecastHumidEl);

          //appends card to wrapper
          forecastWrapperEl.appendChild(forecastCardEl);
        }
      });
    }
  });
};

var newSearch = function (prev) {
  //creates wrapper div
  var searchResultsEl = document.createElement("div");
  searchResultsEl.setAttribute("class", "search-results");
  searchContainerEl.appendChild(searchResultsEl);

  //creates p element containing searched city
  var searchResultEl = document.createElement("p");
  searchResultEl.setAttribute("class", "search-result");
  searchResultEl.innerText = prev;
  searchResultsEl.appendChild(searchResultEl);

  getCurrentWeather(prev);

  //clears index
  searchEl.value = "";
  //adds event listener to searches
  searchResultsEl.addEventListener("click", function (event) {
    getCurrentWeather(event.target.innerText);
  });
};

//event listener for search button
buttonEl.addEventListener("click", function () {
  //pulls local storage
  var storeResults = JSON.parse(localStorage.getItem("searchResults"));
  //pushes search into array
  storeResults.push(searchEl.value);
  //saves array to local storage
  localStorage.setItem("searchResults", JSON.stringify(storeResults));
  //calls for prev search generation and send to main generation function
  newSearch(searchEl.value);
});

//the start of past search generation
var getSearchResults = function () {
  //pulls local storage
  var getResults = JSON.parse(localStorage.getItem("searchResults"));
  //console.log(getResults.length);

  //check if array is empty
  if (getResults.length === 0) {
    return;
  } else {
    //generates past searches on to page
    for (k = 0; k < getResults.length; k++) {
      var searchResultsEl = document.createElement("div");
      searchResultsEl.setAttribute("class", "search-results");
      searchContainerEl.appendChild(searchResultsEl);

      var searchResultEl = document.createElement("p");
      searchResultEl.setAttribute("class", "search-result");
      searchResultEl.innerText = getResults[k];
      searchResultsEl.appendChild(searchResultEl);

      //adds event listener to wrapper for searches
      searchResultsEl.addEventListener("click", function (event) {
        getCurrentWeather(event.target.innerText);
      });
    }
  }
};

//checks for if localstorage exists if not create
if (localStorage.getItem("searchResults") == null) {
  //if non generates empty array
  localStorage.setItem("searchResults", "[]");
}

//starts past search generation
getSearchResults();
