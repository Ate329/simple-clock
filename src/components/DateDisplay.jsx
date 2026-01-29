const DateDisplay = ({ time }) => {
    const dateString = time.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    return <div className="text-lg md:text-xl text-white/40 font-light">{dateString}</div>;
};

export default DateDisplay;
