import { useState, useEffect } from 'react';
import { Settings, Github } from 'lucide-react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PomodoroPage from './components/PomodoroPage';
import SettingsModal from './components/SettingsModal';

function App() {
    const [time, setTime] = useState(new Date());
    const [view, setView] = useState('home');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState({
        format24h: false,
        useCelsius: true,
        detailedWeather: false,
        showForecast: false,
        brightness: 100,
        focusMode: false,
        showQuote: true,
        clockFont: 'JetBrains Mono',
        showPomodoro: true,
        theme: 'aurora'
    });

    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);

    const updateSettings = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        const root = document.documentElement;
        const themes = {
            aurora: { bg: '#000', g1: 'hsla(253, 16%, 7%, 1)', g2: 'hsla(225, 39%, 30%, 1)', g3: 'hsla(339, 49%, 30%, 1)' },
            cyberpunk: { bg: '#050510', g1: 'hsla(320, 100%, 20%, 1)', g2: 'hsla(280, 100%, 20%, 1)', g3: 'hsla(180, 100%, 20%, 0.5)' },
            sunset: { bg: '#100505', g1: 'hsla(20, 80%, 20%, 1)', g2: 'hsla(340, 60%, 30%, 1)', g3: 'hsla(280, 40%, 20%, 1)' },
            ocean: { bg: '#001', g1: 'hsla(220, 60%, 20%, 1)', g2: 'hsla(190, 80%, 20%, 1)', g3: 'hsla(200, 50%, 10%, 1)' },
            midnight: { bg: '#000', g1: '#1a1a1a', g2: '#2a2a2a', g3: '#000' }
        };

        const current = themes[settings.theme] || themes.aurora;
        root.style.setProperty('--bg-color', current.bg);
        root.style.setProperty('--gradient-1', current.g1);
        root.style.setProperty('--gradient-2', current.g2);
        root.style.setProperty('--gradient-3', current.g3);
    }, [settings.theme]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                setLoadingWeather(true);
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error("Failed to fetch weather", error);
            } finally {
                setLoadingWeather(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeather(40.7128, -74.0060)
            );
        } else {
            fetchWeather(40.7128, -74.0060);
        }
    }, []);

    return (
        <div className="relative h-screen h-[100dvh] w-full flex flex-col items-center overflow-hidden aurora-bg text-white">
            <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300 z-50"
                style={{ opacity: (100 - settings.brightness) / 100 }}
            ></div>

            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <Navbar currentView={view} setView={setView} settings={settings} />

            <button
                onClick={() => setIsSettingsOpen(true)}
                className="fixed top-4 sm:top-6 left-4 sm:left-8 p-3 sm:p-4 text-white/40 hover:text-white transition-all duration-300 rounded-full hover:bg-white/10 z-40 group"
            >
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <main className="z-10 w-full flex-1 relative overflow-hidden">
                <div
                    className={`absolute inset-0 transition-all duration-500 transform ${view === 'home' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                    style={{ visibility: view === 'home' ? 'visible' : 'hidden' }}
                >
                    <HomePage
                        time={time}
                        settings={settings}
                        weather={weather}
                        loadingWeather={loadingWeather}
                    />
                </div>

                <div
                    className={`absolute inset-0 transition-all duration-500 transform ${view === 'pomodoro' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'}`}
                    style={{ visibility: view === 'pomodoro' ? 'visible' : 'hidden' }}
                >
                    <PomodoroPage />
                </div>
            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                updateSettings={updateSettings}
            />

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 flex items-center gap-2 sm:gap-4 z-40 text-white/30 text-xs md:text-sm font-medium tracking-wide">
                <a
                    href="https://github.com/Ate329/simple-clock"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    title="View Source"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-0 group-hover:w-auto overflow-hidden whitespace-nowrap">
                        simple-clock
                    </span>
                </a>

                <a
                    href="https://github.com/Ate329"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors hover:underline decoration-white/30 underline-offset-4"
                >
                    @Ate329
                </a>
            </div>
        </div>
    );
}

export default App;
