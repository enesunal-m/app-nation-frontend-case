# Weather Dashboard

A comprehensive weather dashboard built with Next.js, React, TypeScript, and Tailwind CSS. This application allows users to search for real-time weather data for any city, view 5-day forecasts, and toggle between Celsius and Fahrenheit units.

## 🌤️ Features

- **City Search**: Search for weather information by city name
- **Current Weather**: Display current weather conditions with detailed information
- **5-Day Forecast**: View a 5-day weather forecast
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **Search History**: Track and revisit past searches (stored in localStorage)
- **Responsive Design**: Fully responsive UI for mobile, tablet, and desktop
- **Error Handling**: User-friendly error messages for invalid searches
- **Loading States**: Visual feedback during data fetching

## 🛠️ Tech Stack

- **Next.js 14**: React framework with server-side rendering
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Redux Toolkit**: State management
- **SWR**: Data fetching with caching, revalidation, and error handling
- **Axios**: HTTP client for API requests
- **OpenWeather API**: Weather data source

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the project root with your OpenWeather API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_API_BASE_URL=https://api.openweathermap.org/data/2.5
   ```

   You can obtain an API key by signing up at [OpenWeather](https://openweathermap.org/api).

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Project Structure

```
weather-dashboard/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # Home page
│   │   ├── layout.tsx     # Root layout
│   ├── components/        # Reusable components
│   ├── lib/               # Utility functions
│   ├── store/             # Redux store
│   ├── types/             # TypeScript type definitions
│   └── hooks/             # Custom hooks
├── public/                # Static assets
└── ...configuration files
```

## 🌟 Implemented Requirements

### Core Requirements
- ✅ Search bar for city input
- ✅ Display of required weather data
- ✅ Error handling for invalid searches
- ✅ Search history with localStorage persistence

### User Experience & Design
- ✅ Fully responsive design
- ✅ Intuitive layout and visual presentation

### Technical Implementation
- ✅ Optimized Next.js features
- ✅ Performance optimization
- ✅ Clean code structure and organization

### Extended Features
- ✅ 5-day weather forecast
- ✅ Toggle between metric and imperial units
- ✅ TypeScript implementation
- ✅ Redux Toolkit for state management
- ✅ SWR for data fetching
- ✅ Ready for deployment on Vercel

## 🔍 Assumptions and Decisions

- **Weather Data Source**: The application uses the OpenWeather API for both current weather and forecast data.
- **Search History Limit**: The search history is limited to the 5 most recent unique cities to keep the UI clean.
- **Forecast Display**: For the 5-day forecast, a single data point (midday) is used to represent each day.
- **Error Handling**: User-friendly error messages are displayed for common issues like invalid city names or network errors.
- **Default Units**: Temperature is displayed in Celsius by default, with the option to switch to Fahrenheit.

## 📱 Responsive Design

The dashboard is optimized for various screen sizes:
- **Mobile**: Single column layout with stacked components
- **Tablet**: Two-column layout for forecast cards
- **Desktop**: Full multi-column layout with expanded information

## 🚀 Deployment

The application can be deployed on Vercel with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fweather-dashboard)

Remember to set up the environment variables in your Vercel project settings.

## 📈 Future Improvements

- Add geolocation support to get weather for the user's current location
- Implement dark mode toggle
- Add weather map visualization
- Include more detailed weather information like air quality index
- Add multilingual support
- Implement PWA features for offline access

## 📄 License

This project is created as part of a coding assessment and is not licensed for commercial use.