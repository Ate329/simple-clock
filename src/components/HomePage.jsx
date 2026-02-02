import Clock from './Clock';
import Greeting from './Greeting';
import DateDisplay from './DateDisplay';
import WeatherWidget from './WeatherWidget';
import ForecastWidget from './ForecastWidget';
import QuoteWidget from './QuoteWidget';

const HomePage = ({ time, settings, weather, loadingWeather }) => {
    // Determine if we need compact mode based on what's shown
    const hasMultipleWidgets = settings.showForecast && (settings.showQuote || settings.showGreeting);

    return (
        <div className={`flex flex-col items-center justify-center w-full max-w-7xl px-2 sm:px-4 h-full mx-auto home-page-container ${hasMultipleWidgets ? 'compact-mode' : ''}`}>
            {settings.showGreeting && (
                <div className={`w-full flex flex-col items-center transition-all duration-700 shrink-0 ${settings.focusMode ? 'opacity-0 -translate-y-10 h-0 overflow-hidden' : 'opacity-100 translate-y-0'}`}>
                    <Greeting time={time} />
                </div>
            )}

            {settings.showDate && (
                <div className="w-full flex flex-col items-center transition-all duration-500 shrink-0">
                    <DateDisplay time={time} dateFormat={settings.dateFormat} />
                </div>
            )}

            <div className="w-full flex justify-center my-2 sm:my-4 shrink-0">
                <Clock time={time} settings={settings} />
            </div>

            <div className={`w-full flex flex-col items-center transition-all duration-700 delay-100 shrink min-h-0 ${settings.focusMode ? 'opacity-0 translate-y-10 scale-95 pointer-events-none h-0 overflow-hidden' : 'opacity-100 translate-y-0 scale-100'}`}>
                <div className="w-full flex flex-col items-center mt-2 sm:mt-4 weather-section">
                    <WeatherWidget
                        weather={weather}
                        loading={loadingWeather}
                        useCelsius={settings.useCelsius}
                        appearance={settings.weatherAppearance}
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
