// apiKey = "d52e147ec277f1ecd2bbcc1ca878b415";
// apiUrl ="https://api.openweather.map.org"

//search button, input, empty box
 $(document).ready(function () {
    var searchTerm
    $("#search-button").on("click", function () {
      searchTerm = $("#search").val();
      $("#search").val("");
      weatherFunction(searchTerm);
    });

    //initial weather data pull
    function weatherFunction(searchTerm) {
        var geoUrl = "http://api.openweathermap.org/geo/2.5/direct?q=" + searchTerm + "&appid=d52e147ec277f1ecd2bbcc1ca878b415&units=imperial"
        fetch(geoUrl).then(function (res) {
        return res.json()
        }).then(function (data) {
            console.log(data)
        var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + data[0].lat + "&lon=" + data[0].lon + "&appid=d52e147ec277f1ecd2bbcc1ca878b415&units=imperial"
        fetch(weatherUrl).then(function (res) {
            return res.json()
            }).then(function (data) {
            console.log(data)
            displayCurrentWeather(data)
            })
            })
    }

    //current weather function
    function displayCurrentWeather(data) {
        var weatherContainer = document.getElementById("today")

        var city = document.createElement("h2")
        city.innerText = data.name + " " + data.dt
        weatherContainer.appendChild(city)

        var temp = document.createElement("p")
        temp.innerText = "Temp: " + data.main.temp
        weatherContainer.appendChild(temp)

        var wind = document.createElement("p")
        wind.innerText = "Wind: " + data.wind.speed
        weatherContainer.appendChild(wind)
        
        var humidity = document.createElement("p")
        humidity.innerText = "Humidity: " + data.main.humidity
        weatherContainer.appendChild(humidity)
        
        }
    
        //search button 
        $("#search-button").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            weatherFunction(searchTerm);
            weatherForecast(searchTerm);
        }
        });
    
        var history = JSON.parse(localStorage.getItem("history")) || [];
    
        if (history.length > 0) {
            weatherFunction(history[history.length - 1]);
            }
            //makes a row for each element in history array
            for (var i = 0; i < history.length; i++) {
            createRow(history[i]);
            }
    
            //stacks searched cities
            function createRow(text) {
            var listItem = $("<li>").addClass("list-group-item").text(text);
            $(".history").append(listItem);
        }
    
        //add event listener
        $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
        });
    
        function weatherFunction(searchTerm) {
        
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=d52e147ec277f1ecd2bbcc1ca878b415&units=imperial",

            }) .then (function (data) {
            
            //set history log and local storage
            if (history.indexOf(searchTerm) === -1) {
            history.push(searchTerm);
            localStorage.setItem("history", JSON.stringify(history));
            createRow(searchTerm);
            }
            $("#today").empty();
            
            //variables
            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date(). toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            var card = $("<div>").addClass("card col-md-8");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "° F");
                console.log(data)
            var lon = data.coord.lon;
            var lat = data.coord.lat;
    
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=d52e147ec277f1ecd2bbcc1ca878b415&lat=" + lat + "&lon=" + lon,
                }) .then(function (response) {
                console.log(response);
    
            var uvResponse = response.value;
            var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
            var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
            
            //uv index colors
            if (uvResponse < 3) {
                btn.addClass("btn-success");
            } else if (uvResponse < 7) {
                btn.addClass("btn-warning");
            } else {
                btn.addClass("btn-danger");
            }
    
            cardBody.append(uvIndex);
            $("#today .card-body").append(uvIndex.append(btn));
    
            });
    
            //add to page
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
        }

        // function forecast 
        function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=d52e147ec277f1ecd2bbcc1ca878b415&units=imperial",
    
            }) .then(function (data) {
                console.log(data);
                $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
    
                //loop for 5 day forecast
                for (var i = 0; i < data.list.length; i++) {
    
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
    
                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var colFive = $("<div>").addClass("col-md-2.75");
                    var cardFive = $("<div>").addClass("card");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
                    //add wind var windFive = $("<p>").addClass("card-text").text("Wind: " + data.list[i].main.wind.speed)

                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                    //append elements to body
                    $("#forecast .row").append(colFive);
                }
                }
            });
        }
  
    });
  
  