/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'jetbrains': ['"JetBrains Mono"', 'monospace'],
                'roboto-mono': ['"Roboto Mono"', 'monospace'],
                'space-mono': ['"Space Mono"', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'aurora': 'aurora 15s ease infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                aurora: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
        },
    },
    plugins: [],
}
