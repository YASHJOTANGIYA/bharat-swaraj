import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, MapPin } from 'lucide-react';
import './Weather.css';

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Rajkot Coordinates
    const LAT = 22.3039;
    const LON = 70.8022;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error("Error fetching weather:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (code) => {
        // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
        if (code === 0) return <Sun className="weather-icon-large sun" />;
        if (code >= 1 && code <= 3) return <Cloud className="weather-icon-large cloud" />;
        if (code >= 51 && code <= 67) return <CloudRain className="weather-icon-large rain" />;
        if (code >= 80 && code <= 82) return <CloudRain className="weather-icon-large rain" />;
        return <Sun className="weather-icon-large" />;
    };

    const getWeatherDescription = (code) => {
        if (code === 0) return "Clear Sky";
        if (code === 1) return "Mainly Clear";
        if (code === 2) return "Partly Cloudy";
        if (code === 3) return "Overcast";
        if (code >= 51) return "Rainy";
        return "Sunny";
    };

    if (loading) {
        return (
            <div className="weather-widget loading">
                <div className="weather-loader"></div>
            </div>
        );
    }

    if (!weather) return null;

    const current = weather.current;
    const daily = weather.daily;

    return (
        <div className="weather-widget">
            <div className="weather-header">
                <div className="weather-location">
                    <MapPin size={16} />
                    <span>Rajkot, Gujarat</span>
                </div>
                <span className="weather-tag">LIVE</span>
            </div>

            <div className="weather-main">
                <div className="weather-temp-section">
                    <div className="weather-icon-wrapper">
                        {getWeatherIcon(current.weather_code)}
                    </div>
                    <div className="weather-temp">
                        {Math.round(current.temperature_2m)}°
                    </div>
                    <div className="weather-condition">
                        {getWeatherDescription(current.weather_code)}
                    </div>
                </div>

                <div className="weather-details">
                    <div className="weather-detail-item">
                        <Wind size={14} />
                        <span>{current.wind_speed_10m} km/h</span>
                    </div>
                    <div className="weather-detail-item">
                        <Droplets size={14} />
                        <span>{current.relative_humidity_2m}%</span>
                    </div>
                </div>
            </div>

            <div className="weather-forecast">
                <div className="forecast-item">
                    <span className="forecast-label">High</span>
                    <span className="forecast-val">{Math.round(daily.temperature_2m_max[0])}°</span>
                </div>
                <div className="forecast-divider"></div>
                <div className="forecast-item">
                    <span className="forecast-label">Low</span>
                    <span className="forecast-val">{Math.round(daily.temperature_2m_min[0])}°</span>
                </div>
                <div className="forecast-divider"></div>
                <div className="forecast-item">
                    <span className="forecast-label">Feels</span>
                    <span className="forecast-val">{Math.round(current.apparent_temperature)}°</span>
                </div>
            </div>
        </div>
    );
};

export default Weather;
