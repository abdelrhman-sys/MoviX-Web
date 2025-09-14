import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import {ImgsRoute, ServerUrl} from "./contexts/generalContext.jsx";
import { DataProvider } from './contexts/searchContext.jsx';
import { UserProvider } from './contexts/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ImgsRoute.Provider value="https://image.tmdb.org/t/p/">
        <ServerUrl.Provider value='http://localhost:3000/api'>
          <DataProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </DataProvider>
        </ServerUrl.Provider>
      </ImgsRoute.Provider>
    </BrowserRouter>
  </StrictMode>,
)
