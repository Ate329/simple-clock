const Clock = ({ time, format24h, font }) => {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');

    let displayHours = hours;
    let suffix = '';

    if (!format24h) {
        suffix = hours >= 12 ? 'PM' : 'AM';
        displayHours = hours % 12 || 12;
    } else {
        displayHours = hours.toString().padStart(2, '0');
    }

    return (
        <div className="relative flex items-baseline justify-center px-4 sm:px-0">
            <h1
                className="text-[20vw] sm:text-[18vw] md:text-[15rem] leading-none font-thin tracking-tighter text-white drop-shadow-2xl select-none"
                style={{ fontFamily: font }}
            >
                {displayHours}:{minutes}
            </h1>
            {!format24h && (
                <span
                    className="absolute right-0 translate-x-full pl-2 sm:pl-4 text-xl sm:text-2xl md:text-3xl font-light text-white/40 tracking-widest"
                    style={{ top: '50%', transform: 'translateY(-50%) translateX(100%)' }}
                >
                    {suffix}
                </span>
            )}
        </div>
    );
};

export default Clock;
