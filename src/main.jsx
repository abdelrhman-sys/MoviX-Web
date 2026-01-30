import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import {ImgsRoute, ServerUrl} from "./contexts/generalContext.jsx";
import { UserProvider } from './contexts/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ImgsRoute.Provider value="https://image.tmdb.org/t/p/">
        <ServerUrl.Provider value="https://movi-x-api.vercel.app/api">
          <UserProvider>
            <App />
          </UserProvider>
        </ServerUrl.Provider>
      </ImgsRoute.Provider>
    </BrowserRouter>
  </StrictMode>,
)
