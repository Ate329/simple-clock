import { Sun, CloudSun, CloudFog, CloudRain, Snowflake, CloudLightning, Cloud } from 'lucide-react';

const WeatherIcon = ({ code, className = "w-6 h-6" }) => {
    // Simple mapping for demo purposes
    if (code === 0) return <Sun className={className} />;
    if ([1, 2, 3].includes(code)) return <CloudSun className={className} />;
    if ([45, 48].includes(code)) return <CloudFog className={className} />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={className} />;
    if ([71, 73, 75, 85, 86].includes(code)) return <Snowflake className={className} />;
    if ([95, 96, 99].includes(code)) return <CloudLightning className={className} />;
    return <Cloud className={className} />;
};

export default WeatherIcon;
