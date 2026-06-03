import {
  Alert,
  AlertActionLink,
  Brand,
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  Page,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ProtectedPage } from './pages/ProtectedPage';

const REQUIRED_ROLE = 'app-user';

function Header() {
  const { authenticated, profile, login, logout } = useAuth();

  return (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo component="a" href="/">
            <Brand alt="Keycloak SPA">Keycloak React SPA</Brand>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              {authenticated ? (
                <>
                  <ToolbarItem alignSelf="center">{profile?.name || profile?.username}</ToolbarItem>
                  <ToolbarItem>
                    <Button variant="secondary" onClick={logout}>
                      Выйти
                    </Button>
                  </ToolbarItem>
                </>
              ) : (
                <ToolbarItem>
                  <Button variant="primary" onClick={login}>
                    Войти
                  </Button>
                </ToolbarItem>
              )}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
}

function SessionExpiredAlert() {
  const { sessionExpired, login } = useAuth();

  if (!sessionExpired) {
    return null;
  }

  return (
    <Alert
      variant="warning"
      title="Сессия истекла"
      actionLinks={<AlertActionLink onClick={login}>Войти заново</AlertActionLink>}
      style={{ margin: 'var(--pf-t--global--spacer--md, 16px)' }}
    >
      Не удалось обновить токен доступа. Пожалуйста, авторизуйтесь повторно.
    </Alert>
  );
}

export default function App() {
  return (
    <Page masthead={<Header />}>
      <SessionExpiredAlert />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={REQUIRED_ROLE}>
              <ProtectedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Page>
  );
}
