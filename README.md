# Simple Clock

> Just a simple clock website. Inititally used to utilise my spare laptop.

## 💻 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ate329/simple-clock.git
   cd simple-clock
   ```

2. **Start a local server**:
   Using Python (pre-installed on most systems):
   ```bash
   python -m http.server
   ```

3. **Open in Browser**:
   Visit [http://localhost:8000](http://localhost:8000)

## ✨ Features

### 🕐 Dynamic Clock Display
- Large, readable time with customizable fonts (JetBrains Mono, Roboto Mono, Space Mono)
- 12-hour or 24-hour format
- Automatic greeting based on time of day

### 🌤️ Real-Time Weather
- Auto-detects your location
- Current temperature with high/low forecasts
- 3-day forecast
- Detailed view with humidity and wind speed
- Celsius or Fahrenheit

### 💭 Inspirational Quotes
- Random quotes with smart caching
- Refreshes every 4 hours

### 🎨 Beautiful Design
- Animated aurora gradient background
- Glassmorphism UI
- Smooth transitions and animations
- Dark mode optimized

### ⚙️ Customization
- **Focus Mode**: Minimalist view with just date and time
- **Brightness Control**: 10-100%
- **Toggle Elements**: Show/hide weather, forecast, and quotes

## 🎯 Usage

Click the **gear icon** (⚙️) in the bottom-right corner to customize your display.

Press **F11** for fullscreen mode.

## 🛠️ Tech Stack

Built with HTML5, CSS3, React, and Tailwind CSS.

## 🌐 API Information

### Weather Data
- **Provider**: [Open-Meteo](https://open-meteo.com/)
- **Cost**: Free (no API key required)
- **Privacy**: No personal data collection
- **Rate Limits**: Generous free tier

### Quotes
- **Provider**: [DummyJSON](https://dummyjson.com/)
- **Cost**: Free
- **Caching**: Local storage (refreshes every 4 hours)

## 🙏 Credits

- Weather data by [Open-Meteo](https://open-meteo.com/)
- Quotes from [DummyJSON](https://dummyjson.com/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📝 License

MIT License - feel free to use and modify!

---

**⭐ Star this repo if you found it useful!**
