// display current date and time
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = days[now.getDay()];
let dayOfWeek = document.querySelector("#dayOfWeek");
dayOfWeek.innerHTML = currentDay;

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Nowember",
  "December",
];
let currentMonth = months[now.getMonth()];
let month = document.querySelector("#month");
let currentDate = now.getDate();
let currentYear = now.getFullYear();
month.innerHTML = currentMonth + " " + currentDate + ", " + currentYear;

let currentHour = now.getHours();
if (currentHour < 10) {
  currentHour = `0${currentHour}`;
}
let currentMinutes = now.getMinutes();
if (currentMinutes < 10) {
  currentMinutes = `0${currentMinutes}`;
}

let time = document.querySelector("#time");
time.innerHTML = currentHour + ":" + currentMinutes;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="card">
              <ul class="list-group list-group-flush">
                <li class="list-group-item dayOfWeek">${formatDay(
                  forecastDay.dt
                )}</li>
                <li class="list-group-item">
                <img src = "http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="" width=46/>
                </li>
                <li class="list-group-item">
                  <span class="minT">${Math.round(
                    forecastDay.temp.min
                  )}°</span> <span class="maxT">${Math.round(
          forecastDay.temp.max
        )}°</span>
                </li>
              </ul>
          </div>
        </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// forecast part

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "666ce5aa06360eb1cfa62f046549c80e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

// change weather information to current data for a particular city
function updateCityCountryTemperature(response) {
  console.log(response.data);
  document.getElementById("temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  celsiusTemperature = response.data.main.temp;
  document.getElementById("fahrenheits").style.color = "grey";
  document.getElementById("celsius").style.color = "black";
  document.querySelector("#currentCity").innerHTML = response.data.name;
  document.querySelector("#currentCountry").innerHTML =
    response.data.sys.country;
  document.querySelector("#weatherDescription").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let units = "metric";
  let apiKey = "666ce5aa06360eb1cfa62f046549c80e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateCityCountryTemperature);
}

// get weather data by city name when search is engaged
function getWeatherDataByCity(event) {
  let city = document.querySelector("#city").value;
  event.preventDefault();
  search(city);
}

// get weather data by geolocation when Current Location button is clicked
function getWeatherDataByLocation(position) {
  navigator.geolocation.getCurrentPosition(getCoordinates);
  function getCoordinates(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "666ce5aa06360eb1cfa62f046549c80e";
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(updateCityCountryTemperature);
  }
}

// celsius vs fahrenheits conversion

function celsiusToFahrenheits(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
  document.getElementById("celsius").style.color = "grey";
  document.getElementById("fahrenheits").style.color = "black";
}

function fahrenheitsToCelsius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(celsiusTemperature);
  document.getElementById("fahrenheits").style.color = "grey";
  document.getElementById("celsius").style.color = "black";
}

let celsiusTemperature = null;

// listening to the search form value
let cityEnterField = document.querySelector("#cityEnterForm");
cityEnterField.addEventListener("submit", getWeatherDataByCity);

document
  .getElementById("searchButton")
  .addEventListener("click", getWeatherDataByCity);

// listeting to Current Location button
document
  .getElementById("currentLocationButton")
  .addEventListener("click", getWeatherDataByLocation);

// listening to click on F and C links
let fahrenheitLink = document.querySelector("#fahrenheits");
fahrenheitLink.addEventListener("click", celsiusToFahrenheits);
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", fahrenheitsToCelsius);

// initial search during page load
search("Kharkiv");
