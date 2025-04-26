const apiKey = "2f89cebeab79efec529eabc1f23b11e7"; // Replace with your OpenWeather API key

// Step 1: Get Latitude & Longitude Using Nominatim API (No API Key Required)
function getLatLonFromCity(city) {
    const geoApiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;

    return fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) throw new Error("City not found");

            const lat = data[0].lat;
            const lon = data[0].lon;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);

            return { lat, lon };
        })
        .catch(error => {
            console.error("Error fetching coordinates:", error);
            alert("City not found. Please try again.");
        });
}

// Step 2: Fetch Current Weather
function getWeather(lat, lon, city) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Current Weather:", data);
            document.getElementById("weatherDetails").innerHTML = `
                <h2>Weather in ${city}</h2>
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            `;

            // Step 3: Fetch 5-Day Forecast
            getForecast(lat, lon, city);
        })
        .catch(error => console.error("Error fetching weather:", error));
}

// Step 3: Fetch 5-Day Forecast
function getForecast(lat, lon, city) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("5-Day Forecast:", data);
            let forecastHTML = "<h3>5-Day Forecast</h3>";
            
            // Filter every 8th forecast (3-hour intervals, so 8 intervals = 24 hours)
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    const date = new Date(item.dt * 1000).toDateString();
                    forecastHTML += `
                        <p><strong>${date}:</strong> ${item.main.temp}°C, ${item.weather[0].description}
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"></p>
                    `;
                }
            });

            document.getElementById("forecastDetails").innerHTML = forecastHTML;
        })
        .catch(error => console.error("Error fetching forecast:", error));
}

// Step 4: Handle User Input
function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    document.getElementById("weatherDetails").innerHTML = "";
    document.getElementById("forecastDetails").innerHTML = "<p>Loading forecast...</p>";

    getLatLonFromCity(city)
        .then(coords => {
            if (!coords) return;
            getWeather(coords.lat, coords.lon, city);
        })
        .catch(error => console.error("Error:", error));
}