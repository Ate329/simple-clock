const Clock = ({ time, settings }) => {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    let displayHours = hours;
    let suffix = '';

    if (!settings.format24h) {
        suffix = hours >= 12 ? 'PM' : 'AM';
        displayHours = hours % 12 || 12;
    } else {
        displayHours = hours.toString().padStart(2, '0');
    }

    const ampmClass = settings.ampmStyle === 'bold'
        ? 'text-white/80 font-semibold'
        : 'text-white/40 font-light';

    return (
        <div className="relative flex items-baseline justify-center px-4 sm:px-0">
            <h1
                className="text-[20vw] sm:text-[18vw] md:text-[15rem] leading-none font-thin tracking-tighter text-white drop-shadow-2xl select-none"
                style={{ fontFamily: settings.clockFont }}
            >
                {displayHours}:{minutes}
                {settings.showSeconds && (
                    <span className="text-[8vw] sm:text-[6vw] md:text-[5rem] text-white/50 ml-2">
                        :{seconds}
                    </span>
                )}
            </h1>
            {!settings.format24h && (
                <span
                    className={`absolute right-0 translate-x-full pl-2 sm:pl-4 text-xl sm:text-2xl md:text-3xl tracking-widest ${ampmClass}`}
                    style={{ top: '50%', transform: 'translateY(-50%) translateX(100%)' }}
                >
                    {suffix}
                </span>
            )}
        </div>
    );
};

export default Clock;
