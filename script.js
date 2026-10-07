const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const feelsLike = document.getElementById("feelsLike");
const minTemp = document.getElementById("minTemp");
const maxTemp = document.getElementById("maxTemp");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

searchButton.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

async function getWeather(city) {
    weatherCard.classList.add("hidden");
    errorMessage.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
        const apiURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(apiURL);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the city name.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your OpenWeather API key.");
            }

            throw new Error("Unable to fetch weather data.");
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    } finally {
        loading.classList.add("hidden");
    }
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherCondition.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    minTemp.textContent = `${Math.round(data.main.temp_min)}°C`;
    maxTemp.textContent = `${Math.round(data.main.temp_max)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    const visibilityInKm = data.visibility / 1000;
    visibility.textContent = `${visibilityInKm.toFixed(1)} km`;

    weatherCard.classList.remove("hidden");
}

function showError(message) {
    weatherCard.classList.add("hidden");
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}
