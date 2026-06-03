import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import keycloak from '../keycloak';
import type { AuthContextValue, UserProfile } from '../types/auth';

const MIN_TOKEN_VALIDITY_SECONDS = 30;
const REFRESH_INTERVAL_MS = 10000;

export const AuthContext = createContext<AuthContextValue | null>(null);

function buildProfile(): UserProfile | null {
  const parsed = keycloak.tokenParsed;
  if (!parsed) {
    return null;
  }
  return {
    username: parsed.preferred_username ?? '',
    name: parsed.name ?? parsed.preferred_username ?? '',
    email: parsed.email ?? '',
    roles: parsed.realm_access?.roles ?? [],
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(!!keycloak.authenticated);
  const [profile, setProfile] = useState<UserProfile | null>(buildProfile());
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  const login = useCallback(() => {
    setSessionExpired(false);
    void keycloak.login();
  }, []);

  const logout = useCallback(() => {
    void keycloak.logout({ redirectUri: window.location.origin });
  }, []);

  const hasRole = useCallback(
    (role: string) => keycloak.tokenParsed?.realm_access?.roles?.includes(role) ?? false,
    [],
  );

  useEffect(() => {
    keycloak.onAuthSuccess = () => {
      setAuthenticated(true);
      setProfile(buildProfile());
      setSessionExpired(false);
    };

    keycloak.onAuthRefreshSuccess = () => {
      setProfile(buildProfile());
    };

    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setProfile(null);
    };

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(MIN_TOKEN_VALIDITY_SECONDS).catch(() => {
        setSessionExpired(true);
        setAuthenticated(false);
        setProfile(null);
      });
    };

    const interval = window.setInterval(() => {
      if (!keycloak.authenticated) {
        return;
      }
      keycloak.updateToken(MIN_TOKEN_VALIDITY_SECONDS).catch(() => {
        setSessionExpired(true);
        setAuthenticated(false);
        setProfile(null);
      });
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthRefreshSuccess = undefined;
      keycloak.onAuthLogout = undefined;
      keycloak.onTokenExpired = undefined;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ authenticated, profile, sessionExpired, login, logout, hasRole }),
    [authenticated, profile, sessionExpired, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
