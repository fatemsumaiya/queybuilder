import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import CityDetail from "./CityDetail";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByCondition, setFilterByCondition] = useState("");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const cities = ["London", "New York", "Tokyo", "Paris", "Sydney", "Mumbai", "Berlin", "Moscow", "Beijing", "Cape Town"];
        const apiKey = "af6d598859e0126bd200e2a224c96b04";
        const promises = cities.map((city) =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`).then((res) =>
            res.json()
          )
        );
        const data = await Promise.all(promises);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  const filteredWeatherData = weatherData
    .filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((city) =>
      filterByCondition ? city.weather[0].main === filterByCondition : true
    );

  const totalCities = weatherData.length;
  const totalFilteredCities = filteredWeatherData.length;

  /* Chart Data */
  const temperatureData = {
    labels: weatherData.map((city) => city.name),
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData.map((city) => city.main.temp),
      },
    ],
  };

  const humidityData = {
    labels: weatherData.map((city) => city.name),
    datasets: [
      {
        label: "Humidity (%)",
        data: weatherData.map((city) => city.main.humidity),
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Weather Dashboard</h1>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="summary">
                <p>Total Cities: {totalCities}</p>
                <p>Filtered Cities: {totalFilteredCities}</p>
              </div>

              <input
                type="text"
                placeholder="Search by city name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />

              <select
                value={filterByCondition}
                onChange={(e) => setFilterByCondition(e.target.value)}
                className="filter-dropdown"
              >
                <option value="">All Conditions</option>
                {Array.from(
                  new Set(weatherData.map((city) => city.weather[0].main))
                ).map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              {/* Weather List */}
              <ul className="weather-list">
                {filteredWeatherData.map((city) => (
                  <li key={city.id} className="weather-item">
                    <Link to={`/city/${encodeURIComponent(city.name)}`}>
                      <p><strong>City:</strong> {city.name}</p>
                      <p><strong>Temperature:</strong> {city.main.temp}°C</p>
                      <p><strong>Condition:</strong> {city.weather[0].main}</p>
                    </Link>
                  </li>
                ))}
              </ul>

            </>
          }
        />

    
        <Route path="/city/:cityName" element={<CityDetail weatherData={weatherData} />} />
      </Routes>
    </div>
  );
}

export default App;