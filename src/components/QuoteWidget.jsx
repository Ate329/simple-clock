import { useState, useEffect } from 'react';

const QuoteWidget = () => {
    const [quote, setQuote] = useState({ text: "Loading inspiration...", author: "" });

    useEffect(() => {
        const fetchQuote = async () => {
            const cached = localStorage.getItem('smart_display_quote');
            const now = Date.now();

            if (cached) {
                try {
                    const { text, author, timestamp } = JSON.parse(cached);
                    if (now - timestamp < 4 * 60 * 60 * 1000) {
                        setQuote({ text, author });
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing cached quote", e);
                }
            }

            try {
                const res = await fetch('https://dummyjson.com/quotes/random');
                const data = await res.json();
                const newQuote = { text: data.quote, author: data.author, timestamp: now };
                localStorage.setItem('smart_display_quote', JSON.stringify(newQuote));
                setQuote(newQuote);
            } catch (error) {
                console.error("Failed to fetch quote", error);
                // Fallback
                setQuote({ text: "The only way to do great work is to love what you do.", author: "Steve Jobs" });
            }
        };

        fetchQuote();
    }, []);

    return (
        <div className="mt-12 max-w-lg text-center animate-fade-in mx-auto" style={{ animationDelay: '0.5s' }}>
            <p className="text-white/50 italic font-light">"{quote.text}"</p>
            <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">— {quote.author}</p>
        </div>
    );
};

export default QuoteWidget;
