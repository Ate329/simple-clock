import Clock from './Clock';
import Greeting from './Greeting';
import DateDisplay from './DateDisplay';
import WeatherWidget from './WeatherWidget';
import ForecastWidget from './ForecastWidget';
import QuoteWidget from './QuoteWidget';

const HomePage = ({ time, settings, weather, loadingWeather }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-7xl px-2 sm:px-4 h-full py-4 sm:py-6 mx-auto">
            <div className={`w-full flex flex-col items-center transition-all duration-700 ${settings.focusMode ? 'opacity-0 -translate-y-10 h-0 overflow-hidden' : 'opacity-100 translate-y-0'}`}>
                <Greeting time={time} />
            </div>

            <div className="w-full flex flex-col items-center transition-all duration-500">
                <DateDisplay time={time} />
            </div>

            <div className="w-full flex justify-center my-4 sm:my-6">
                <Clock time={time} format24h={settings.format24h} font={settings.clockFont} />
            </div>

            <div className={`w-full flex flex-col items-center transition-all duration-700 delay-100 ${settings.focusMode ? 'opacity-0 translate-y-10 scale-95 pointer-events-none h-0 overflow-hidden' : 'opacity-100 translate-y-0 scale-100'}`}>
                <div className="w-full flex flex-col items-center mt-4 sm:mt-8">
                    <WeatherWidget
                        weather={weather}
                        loading={loadingWeather}
                        useCelsius={settings.useCelsius}
                        detailed={settings.detailedWeather}
                    />

                    {settings.showForecast && (
                        <ForecastWidget
                            weather={weather}
                            useCelsius={settings.useCelsius}
                        />
                    )}
                </div>

                {settings.showQuote && <QuoteWidget />}
            </div>
        </div>
    );
};

export default HomePage;
