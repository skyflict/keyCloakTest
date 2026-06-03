import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@patternfly/react-core/dist/styles/base.css';
import keycloak from './keycloak';
import { AuthProvider } from './auth/AuthContext';
import App from './App';

keycloak
  .init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
  })
  .catch((error) => {
    console.error('Ошибка инициализации Keycloak:', error);
  })
  .finally(() => {
    const root = createRoot(document.getElementById('root')!);
    root.render(
      <StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>,
    );
  });
