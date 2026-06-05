# CryptoDash

CryptoDash is a full-stack cryptocurrency dashboard that helps users track market prices, maintain a personal watchlist, manage portfolio holdings, and view crypto market trends in one place.

The application is built as a React single-page app with a Node.js/Express backend. Market data is fetched through CoinGecko, while user-specific data such as watchlists, preferences, and portfolio holdings is stored in MongoDB.

## Features

- Google OAuth authentication
- Protected dashboard route for signed-in users
- Live cryptocurrency search
- Personal watchlist with market price updates
- Portfolio holding management
- Add, edit, and remove portfolio holdings
- Coin exchange simulation using live market prices
- Market trend charts with timeline and chart type controls
- Market cap share visualization
- Base currency preference support
- Responsive dark UI built with Tailwind CSS

## Tech Stack

**Frontend**

- React
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS
- Chart.js
- react-chartjs-2

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- Passport Google OAuth 2.0
- JWT
- Cookie Parser
- CoinGecko API

## Project Structure

```text
crypto-dash/
|-- src/
|   |-- app/
|   |   `-- store.js
|   |-- components/
|   |   |-- auth/
|   |   |-- charts/
|   |   |-- crypto/
|   |   |-- currency/
|   |   |-- dashboard/
|   |   |-- home/
|   |   |-- layout/
|   |   `-- portfolio/
|   |-- features/
|   |   |-- auth/
|   |   |-- portfolio/
|   |   |-- preferences/
|   |   `-- watchlist/
|   |-- pages/
|   |-- services/
|   |   `-- api.js
|   `-- main.jsx
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB setup
- Google OAuth credentials

## Frontend Setup

Install frontend dependencies from the project root:

```bash
npm install
```

Create a `.env` file in the root folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Backend Setup

Go to the backend folder:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
COINGECKO_API_KEY=your_optional_coingecko_api_key
```

Run the backend server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/health
```

## Available Scripts

Frontend scripts:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Backend scripts:

```bash
cd server
npm run dev
npm start
```

## Main Application Flow

1. The user opens the React app.
2. The user signs in using Google OAuth.
3. The backend creates or finds the user in MongoDB.
4. A JWT token is stored in an HTTP cookie.
5. The dashboard checks the current user through `/api/auth/me`.
6. Redux thunks fetch preferences, watchlist, and portfolio data.
7. Crypto market data is fetched from the backend.
8. The backend gets live market data from CoinGecko.
9. The UI updates charts, watchlist, portfolio, and exchange sections.

## State Management

Redux Toolkit is used to manage global application state. The store is divided into feature slices:

- `authSlice` handles current user and authentication status.
- `preferencesSlice` handles user preferences such as base currency.
- `watchlistSlice` handles saved coins and watchlist market data.
- `portfolioSlice` handles holdings and portfolio actions.

This avoids prop drilling and keeps shared dashboard data consistent across components.

## API Overview

Main backend route groups:

```text
/api/auth
/api/preferences
/api/watchlist
/api/crypto
/api/portfolio
```

Crypto data endpoints include:

```text
GET /api/crypto/search
GET /api/crypto/markets
GET /api/crypto/:coinId/history
```

User-specific endpoints such as watchlist, preferences, and portfolio are protected with authentication middleware.

## Optimization and Error Handling

- Debounced crypto search to reduce unnecessary API calls
- Backend cache for CoinGecko requests
- Retry handling for temporary upstream API failures
- Loading states for dashboard sections
- Error states for API and form failures
- Request freshness handling in chart data loading
- Form validation for portfolio and exchange actions

## Future Improvements

- Add real-time price updates with WebSockets
- Add profit and loss calculations for portfolio holdings
- Add advanced portfolio analytics
- Add pagination for large lists
- Add more chart comparison options
- Add stronger form validation and toast notifications
- Improve mobile dashboard navigation

## Author

Created by Shyam as a frontend/full-stack project for learning and evaluation.
