const Greeting = ({ time }) => {
    const hour = time.getHours();
    let greeting = "Good Evening";
    if (hour >= 5 && hour < 12) greeting = "Good Morning";
    else if (hour >= 12 && hour < 18) greeting = "Good Afternoon";

    return (
        <div className="text-xl md:text-2xl font-light text-white/60 tracking-widest uppercase mb-2 animate-fade-in">
            {greeting}
        </div>
    );
};

export default Greeting;
