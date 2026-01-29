import WeatherIcon from './WeatherIcon';

const ForecastWidget = ({ weather, useCelsius }) => {
    if (!weather || !weather.daily) return null;

    const daily = weather.daily;
    const nextDays = [1, 2, 3];

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const displayTemp = (temp) => {
        if (temp === undefined) return '--';
        if (useCelsius) return `${Math.round(temp)}°`;
        return `${Math.round((temp * 9 / 5) + 32)}°`;
    };

    return (
        <div className="flex gap-4 mt-6 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {nextDays.map(i => (
                <div key={i} className="glass-panel p-4 rounded-2xl flex flex-col items-center gap-2 min-w-[90px] hover:bg-white/5 transition-colors cursor-default">
                    <span className="text-white/60 text-sm font-medium">{getDayName(daily.time[i])}</span>
                    <div className="text-2xl text-white/90 my-1">
                        <WeatherIcon code={daily.weather_code[i]} className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col text-xs font-medium gap-1">
                        <span className="text-white/90">{displayTemp(daily.temperature_2m_max[i])}</span>
                        <span className="text-white/40">{displayTemp(daily.temperature_2m_min[i])}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ForecastWidget;
