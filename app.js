const apikey = '600c75faaa393220e5051342519ac538';
document.getElementById('country-select').addEventListener('change', function() {
    const city = this.value;
    fetchWeatherData(city);

});

function fetchWeatherData(city) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apikey)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const weatherInfo = document.getElementById('weather-info');

        const wind = data.wind.speed;
        const winddirection = computewinddir(data.wind.deg);
 
        
        const tempCelsius = (data.main.temp - 273.15).toFixed(2);

        weatherInfo.innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p>Temperature: ${tempCelsius}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Wind: ${wind} m/s ${winddirection}</p>
        `;
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

function computewinddir (winddirection) {
    if (winddirection > 337.5) return 'N';
    if (winddirection > 292.5) return 'NW';
    if (winddirection > 247.5) return 'W';
    if (winddirection > 202.5) return 'SW';
    if (winddirection > 157.5) return 'S';
    if (winddirection > 122.5) return 'SE';
    if (winddirection > 67.5) return 'E';
    if (winddirection > 22.5) return 'NE';
    return 'N';
}
fetchWeatherData('London');