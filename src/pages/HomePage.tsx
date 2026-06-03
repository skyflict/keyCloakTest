import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  Label,
  LabelGroup,
  PageSection,
} from '@patternfly/react-core';
import { UserIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const REQUIRED_ROLE = 'app-user';

export function HomePage() {
  const { authenticated, profile, hasRole } = useAuth();

  if (!authenticated || !profile) {
    return (
      <PageSection>
        <EmptyState titleText="Вы не вошли в систему" icon={UserIcon}>
          <EmptyStateBody>
            Нажмите «Войти» в верхней панели, чтобы аутентифицироваться через Keycloak.
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Card>
        <CardTitle>Профиль пользователя</CardTitle>
        <CardBody>
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>Имя</DescriptionListTerm>
              <DescriptionListDescription>{profile.name || '—'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Логин</DescriptionListTerm>
              <DescriptionListDescription>{profile.username || '—'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Email</DescriptionListTerm>
              <DescriptionListDescription>{profile.email || '—'}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Роли</DescriptionListTerm>
              <DescriptionListDescription>
                {profile.roles.length > 0 ? (
                  <LabelGroup>
                    {profile.roles.map((role) => (
                      <Label key={role} color="blue">
                        {role}
                      </Label>
                    ))}
                  </LabelGroup>
                ) : (
                  '—'
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
      <Card style={{ marginTop: 'var(--pf-t--global--spacer--md, 16px)' }}>
        <CardBody>
          {hasRole(REQUIRED_ROLE) ? (
            <Link to="/protected">Перейти в защищённый раздел →</Link>
          ) : (
            <>
              Защищённый раздел недоступен: нужна роль <b>{REQUIRED_ROLE}</b>.
            </>
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
}
