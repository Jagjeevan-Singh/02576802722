# React URL Shortener Web App

![image](https://github.com/user-attachments/assets/602ab8ab-4edf-48a4-8d12-ade66c21becb)
![image](https://github.com/user-attachments/assets/806cf8b9-75d1-4153-a954-9e044c4e8ef7)

A robust, observable React-based URL Shortener application with a reusable logging middleware. The app features a modern Material UI design, URL shortening, shortcode management, expiry display, and a statistics page with click analytics. All significant frontend events are logged to a protected API using a Bearer token.

## Features

- **URL Shortening**: Enter a long URL to generate a short link with optional custom shortcode and expiry.
- **Shortcode Management**: View, copy, and manage all your short links.
- **Expiry Display**: See when each short link will expire.
- **Statistics Page**: View analytics for all short links, including click counts and detailed click info (timestamp, source, location).
- **Material UI Design**: Full-screen, responsive layout with AppBar, navigation icons, tooltips, and card-based UI.
- **Logging Middleware**: All significant frontend events are logged to a protected API endpoint with a Bearer token, including error and lifecycle events.
- **Persistence**: Short links and stats are stored in `localStorage` for session persistence.

## Project Structure

```
FrontendTestSubmission/
  src/
    App.jsx
    AppRouter.jsx
    UrlShortener.jsx
    UrlStats.jsx
    App.css
    index.css
    main.jsx
    assets/
  public/
  loginmiddleware/
    logger.js
  package.json
  vite.config.js
  README.md
```

## Setup & Development

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

3. **Build for production:**
   ```sh
   npm run build
   ```

## Logging Middleware

- Located at `loginmiddleware/logger.js`.
- Usage: `import { Log } from '../loginmiddleware/logger';`
- Logs are sent to the protected API endpoint with a Bearer token in the Authorization header.
- Handles CORS, network errors, and timeouts with detailed diagnostics in the browser console.

## Dependencies

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [Material UI Icons](https://mui.com/material-ui/material-icons/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

## Troubleshooting

- **Logging errors**: If you see `Failed to fetch` or CORS errors in the console, check your network connection, API endpoint, and browser security settings. The logger provides detailed diagnostics in the console.
- **Mixed content**: If your frontend is served over HTTPS but the API is HTTP, browsers will block requests. Use HTTPS for both frontend and API if possible.

## License

This project is for educational and demonstration purposes.
