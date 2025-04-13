// CityDetail.jsx
import React from "react";
import { StrictMode } from 'react'
import './App.css';
import { useParams, Link } from "react-router-dom";

function CityDetail({ weatherData }) {
  const { cityName } = useParams();
  const decodedCityName = decodeURIComponent(cityName);
  const city = weatherData.find((city) => city.name === decodedCityName);
  


  if (!city) {
    return (
      <div>
        <p>City data not found.</p>
        <Link to="/">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="city-detail">
      <h2>{city.name}</h2>
      <p><strong>Temperature:</strong> {city.main.temp}°C</p>
      <p><strong>Humidity:</strong> {city.main.humidity}%</p>
      <p><strong>Condition:</strong> {city.weather[0].main}</p>
      <p><strong>Wind Speed:</strong> {city.wind.speed} m/s</p>
      <Link to="/">← Back to Dashboard</Link>
    </div>
  );
}

export default CityDetail;
