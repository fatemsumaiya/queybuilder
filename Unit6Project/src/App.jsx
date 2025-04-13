import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState([]); // State to store fetched weather data
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filterByCondition, setFilterByCondition] = useState(""); // State for filtering by weather condition

  // Fetch weather data from the OpenWeatherMap API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Example cities for the dashboard
        const cities = ["London", "New York", "Tokyo", "Paris", "Sydney", "Mumbai", "Berlin", "Moscow", "Beijing", "Cape Town"];
        const apiKey = "af6d598859e0126bd200e2a224c96b04"; // Replace with your OpenWeatherMap API key
        const promises = cities.map((city) =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`).then((res) => res.json())
        );
        const data = await Promise.all(promises);
        setWeatherData(data); // Store the fetched data in state
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  // Filter and search logic
  const filteredWeatherData = weatherData
    .filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) // Search by city name
    )
    .filter((city) =>
      filterByCondition ? city.weather[0].main === filterByCondition : true // Filter by weather condition
    );

  // Summary statistics
  const totalCities = weatherData.length;
  const totalFilteredCities = filteredWeatherData.length;
  const uniqueConditions = [...new Set(weatherData.map((city) => city.weather[0].main))].length;

  return (
    <div className="dashboard">
         <input
        type="text"
        placeholder="Search by city name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

          {/* Filter Dropdown */}
          <select
        value={filterByCondition}
        onChange={(e) => setFilterByCondition(e.target.value)}
        className="filter-dropdown"
      >
        <option value="">All Conditions</option>
        {Array.from(new Set(weatherData.map((city) => city.weather[0].main))).map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </select>
      
      <h1>Weather Dashboard</h1>


      <div className="summary">
        <p>Total Cities: {totalCities}</p>
        <p>Filtered Cities: {totalFilteredCities}</p>
        <p>Unique Weather Conditions: {uniqueConditions}</p>
      </div>



      {/* Weather Data List */}
      <ul className="weather-list">
        {filteredWeatherData.map((city) => (
          <li key={city.id} className="weather-item">
            <p><strong>City:</strong> {city.name}</p>
            <p><strong>Temperature:</strong> {city.main.temp}°C</p>
            <p><strong>Humidity:</strong> {city.main.humidity}%</p>
            <p><strong>Condition:</strong> {city.weather[0].main}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;