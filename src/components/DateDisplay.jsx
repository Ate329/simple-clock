const DateDisplay = ({ time, dateFormat = 'weekday' }) => {
    const formatOptions = {
        short: { month: 'short', day: 'numeric' },
        long: { month: 'long', day: 'numeric' },
        weekday: { weekday: 'short', month: 'short', day: 'numeric' },
        numeric: { month: '2-digit', day: '2-digit', year: 'numeric' },
    };

    const dateString = time.toLocaleDateString('en-US', formatOptions[dateFormat] || formatOptions.weekday);
    return <div className="text-lg md:text-xl text-white/40 font-light">{dateString}</div>;
};

export default DateDisplay;
