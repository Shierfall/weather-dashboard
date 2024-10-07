const apikey = '600c75faaa393220e5051342519ac538';
let currentCity = '';

document.getElementById('country-select').addEventListener('change', function() {
    const city = this.value;
    currentCity = city;
    fetchWeatherData(city);
});

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        currentCity = city;
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('city-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const city = this.value;
        if (city) {
            currentCity = city;
            fetchWeatherData(city);
        } else {
            alert('Please enter a city name.');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('country-select');
    const options = Array.from(select.options);
    options.sort((a, b) => a.text.localeCompare(b.text));

    select.innerHTML = '';
    options.forEach(option => select.appendChild(option));

    // Show loading message
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = '<p>Loading weather data...</p>';

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDataByCoords(lat, lon);
        }, error => {
            console.error('Error getting location:', error);
            // Fetch initial weather data for the default city if location access is denied
            fetchWeatherData(select.value);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Fetch initial weather data for the default city if geolocation is not supported
        fetchWeatherData(select.value);
    }

    // Periodically update weather data every 10 minutes (600000 milliseconds)
    setInterval(() => {
        if (currentCity) {
            fetchWeatherData(currentCity);
        }
    }, 600000); // 10 minutes
});

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchWeatherDataByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeatherInfo(data) {
    const weatherInfo = document.getElementById('weather-info');
    const wind = data.wind.speed;
    const winddirection = computewinddir(data.wind.deg);
    const tempCelsius = (data.main.temp - 273.15).toFixed(2);

    weatherInfo.innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${tempCelsius}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Wind: ${wind} m/s, ${winddirection}</p>
    `;

    // Debugging:
    console.log('Weather condition:', data.weather[0].main);


    if (data.weather[0].main.toLowerCase().includes('rain')) {
        console.log('Adding rain animation');
        addRainAnimation();
    } else {
        console.log('Removing rain animation');
        removeRainAnimation();
    }
}

function computewinddir(winddirection) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(winddirection / 45) % 8;
    return directions[index];
}

function addRainAnimation() {
    if (!document.querySelector('.rain')) {
        const rainContainer = document.createElement('div');
        rainContainer.classList.add('rain');
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 0.5}s`;
            rainContainer.appendChild(drop);
        }
        document.body.appendChild(rainContainer);
    }
}

function removeRainAnimation() {
    const rainContainer = document.querySelector('.rain');
    if (rainContainer) {
        rainContainer.remove();
    }
}