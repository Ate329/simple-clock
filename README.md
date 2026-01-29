# Simple Clock

> A beautiful, customizable clock display with weather, quotes, and pomodoro timer. The project was initially created for my spare laptop.

**Live Demo**: [clock.zyhe.me](https://clock.zyhe.me)

## Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ate329/simple-clock.git
   cd simple-clock
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Visit [http://localhost:5173](http://localhost:5173)

## Pictures
<img width="2559" height="1438" alt="image" src="https://github.com/user-attachments/assets/5b6826c5-5d43-4a22-86f2-9b7009f3850e" />

<img width="2559" height="1438" alt="image" src="https://github.com/user-attachments/assets/0b808eb3-09ef-40b5-9a21-b49f07a8c1a9" />

<img width="2559" height="1437" alt="image" src="https://github.com/user-attachments/assets/cb4ffc98-aba4-4268-a883-1401b148b4fa" />

<img width="2558" height="1438" alt="image" src="https://github.com/user-attachments/assets/23e681b9-656f-4814-b663-aa2be6fd55cc" />

<img width="2559" height="1438" alt="image" src="https://github.com/user-attachments/assets/c3eb00cd-f617-4ac6-b85f-5a484ee28b77" />

## Usage

Click the **gear icon** in the bottom-right corner to open settings and customize your display.

Use the **navigation tabs** at the top to switch between Clock and Pomodoro views.

Press **F11** for fullscreen mode.

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **Linting**: ESLint 9

## API Information

### Weather Data
- **Provider**: [Open-Meteo](https://open-meteo.com/)
- **Cost**: Free (no API key required)
- **Privacy**: No personal data collection
- **Rate Limits**: Generous free tier

### Quotes
- **Provider**: [DummyJSON](https://dummyjson.com/)
- **Cost**: Free
- **Caching**: Local storage (refreshes every 4 hours)

## Project Structure

```
src/
├── components/
│   ├── Clock.jsx           # Main clock display
│   ├── DateDisplay.jsx     # Date component
│   ├── ForecastWidget.jsx  # 3-day weather forecast
│   ├── Greeting.jsx        # Time-based greeting
│   ├── HomePage.jsx        # Main clock page layout
│   ├── Navbar.jsx          # Navigation between views
│   ├── PomodoroPage.jsx    # Pomodoro page container
│   ├── PomodoroWidget.jsx  # Pomodoro timer with progress tracking
│   ├── QuoteWidget.jsx     # Inspirational quotes
│   ├── SettingsModal.jsx   # Settings panel
│   ├── WeatherIcon.jsx     # Weather condition icons
│   └── WeatherWidget.jsx   # Current weather display
├── App.jsx                 # Main app component with theme management
├── main.jsx               # React entry point
└── index.css              # Global styles and animations
```

## Credits

- Weather data by [Open-Meteo](https://open-meteo.com/)
- Quotes from [DummyJSON](https://dummyjson.com/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## License

MIT License - feel free to use and modify!

---

**Star this repo if you like it :)**
