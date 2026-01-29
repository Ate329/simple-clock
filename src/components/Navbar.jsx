import { useState } from 'react';
import { Clock as ClockIcon, Timer } from 'lucide-react';

const Navbar = ({ currentView, setView, settings }) => {
    const tabs = [
        { id: 'home', label: 'Clock', icon: ClockIcon },
        ...(settings?.showPomodoro ? [{ id: 'pomodoro', label: 'Pomodoro', icon: Timer }] : []),
    ];

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto inline-flex items-center gap-1 p-1.5 rounded-full bg-black/30 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentView === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id)}
                            className={`
                                relative flex items-center justify-center gap-2 
                                px-5 py-2.5 rounded-full
                                text-sm font-medium
                                transition-all duration-300 ease-out
                                ${isActive
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }
                            `}
                        >
                            <Icon
                                className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                            />
                            <span className="tracking-wide">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
