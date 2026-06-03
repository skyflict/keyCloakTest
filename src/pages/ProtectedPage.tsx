import {
  Card,
  CardBody,
  CardTitle,
  Content,
  PageSection,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function ProtectedPage() {
  const { profile } = useAuth();

  return (
    <PageSection>
      <Card>
        <CardTitle>Защищённый раздел</CardTitle>
        <CardBody>
          <Content component="p">
            Эта страница доступна только пользователям с realm-ролью <b>app-user</b>.
          </Content>
          <Content component="p">
            Добро пожаловать, <b>{profile?.name || profile?.username}</b>!
          </Content>
          <Link to="/">← На главную</Link>
        </CardBody>
      </Card>
    </PageSection>
  );
}
