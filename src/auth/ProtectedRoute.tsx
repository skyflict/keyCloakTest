import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  Spinner,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  requiredRole: string;
  children: ReactNode;
}

export function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { authenticated, login, hasRole } = useAuth();

  useEffect(() => {
    if (!authenticated) {
      login();
    }
  }, [authenticated, login]);

  if (!authenticated) {
    return (
      <Bullseye>
        <Spinner aria-label="Перенаправление на страницу входа" />
      </Bullseye>
    );
  }

  if (!hasRole(requiredRole)) {
    return (
      <Bullseye>
        <EmptyState titleText="Доступ запрещён" icon={LockIcon} status="danger">
          <EmptyStateBody>
            Для доступа к этой странице требуется realm-роль <b>{requiredRole}</b>.
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button variant="link" component="a" href="/">
                На главную
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </Bullseye>
    );
  }

  return <>{children}</>;
}
