import WeatherIcon from './WeatherIcon';

const WeatherWidget = ({ weather, loading, useCelsius, detailed }) => {
    if (loading) return <div className="animate-pulse text-white/30 text-sm">Updating weather...</div>;
    if (!weather) return null;

    const currentTemp = weather.current?.temperature_2m;
    const weatherCode = weather.current?.weather_code;
    const humidity = weather.current?.relative_humidity_2m;
    const windSpeed = weather.current?.wind_speed_10m;
    const maxTemp = weather.daily?.temperature_2m_max[0];
    const minTemp = weather.daily?.temperature_2m_min[0];

    const displayTemp = (temp) => {
        if (temp === undefined) return '--';
        if (useCelsius) return `${Math.round(temp)}°`;
        return `${Math.round((temp * 9 / 5) + 32)}°`;
    };

    return (
        <div className={`glass-panel px-4 sm:px-8 py-3 sm:py-6 rounded-2xl sm:rounded-3xl flex flex-col items-center gap-2 sm:gap-4 hover:bg-white/5 transition-colors cursor-default ${detailed ? 'min-w-[220px] sm:min-w-[280px]' : ''}`}>
            <div className="text-3xl sm:text-6xl text-white/90 drop-shadow-lg">
                <WeatherIcon code={weatherCode} className="w-10 h-10 sm:w-16 sm:h-16" />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-light tracking-tight">{displayTemp(currentTemp)}</span>
                <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-white/40 font-medium mt-1 sm:mt-2">
                    <span>H: {displayTemp(maxTemp)}</span>
                    <span>L: {displayTemp(minTemp)}</span>
                </div>
            </div>

            {detailed && (
                <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 w-full text-xs sm:text-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-white/40 text-xs uppercase tracking-wider">Humidity</span>
                        <span className="text-white/80">{humidity}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-white/40 text-xs uppercase tracking-wider">Wind</span>
                        <span className="text-white/80">{Math.round(windSpeed)} km/h</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
