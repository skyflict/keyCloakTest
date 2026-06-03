# Keycloak React SPA

SPA на **React + TypeScript + Vite**, аутентифицирующееся в **Keycloak** по
Authorization Code Flow + PKCE. Вёрстка — на **PatternFly**.

## Возможности

- Вход/выход через Keycloak (`onLoad: 'check-sso'`, PKCE `S256`).
- Профиль пользователя (имя, логин, email, realm-роли) из распарсенного токена.
- Защищённый маршрут `/protected`, доступный только с realm-ролью `app-user`.
- Автоматическое обновление access-токена (`updateToken`) до истечения срока.
- Обработка протухшей сессии: предупреждение с предложением войти заново.

## Запуск

```bash
npm install                 # 1. установить зависимости
cp .env.example .env        # 2. создать конфиг и указать параметры Keycloak
npm run dev                 # 3. запустить dev-сервер (http://localhost:5173)
npm run build               # 4. production-сборка (опционально)
```

## Параметры (`.env`)

| Переменная                 | Назначение                          | Пример                  |
| -------------------------- | ----------------------------------- | ----------------------- |
| `VITE_KEYCLOAK_URL`        | Базовый URL сервера Keycloak        | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM`      | Имя realm                           | `myrealm`               |
| `VITE_KEYCLOAK_CLIENT_ID`  | Client ID (public-клиент в Keycloak)| `spa-client`            |

## Запуск Keycloak

Приложению нужен работающий сервер Keycloak по адресу из `VITE_KEYCLOAK_URL`.

### Вариант А — без Docker (нужен JDK 17+)

```bash
# 1. Java (через Homebrew)
brew install openjdk@21
export JAVA_HOME="$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

# 2. Скачать Keycloak
curl -L -o ~/keycloak.zip \
  https://github.com/keycloak/keycloak/releases/download/26.1.0/keycloak-26.1.0.zip
unzip -q ~/keycloak.zip -d ~

# 3. Положить готовый realm и стартовать с импортом
cp keycloak/realm-export.json ~/keycloak-26.1.0/data/import/
cd ~/keycloak-26.1.0
KC_BOOTSTRAP_ADMIN_USERNAME=admin KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  bin/kc.sh start-dev --import-realm
```

### Вариант Б — Docker

```bash
docker run -d --name keycloak -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -v "$(pwd)/keycloak/realm-export.json:/opt/keycloak/data/import/realm-export.json" \
  quay.io/keycloak/keycloak:26.1.0 start-dev --import-realm
```

Файл `keycloak/realm-export.json` уже содержит:

- realm **`myrealm`**;
- public-клиента **`spa-client`** (Standard Flow + PKCE `S256`, redirect/web-origins на `localhost:5173`);
- realm-роль **`app-user`**;
- тестового пользователя **`testuser`** / пароль **`password`** с назначенной ролью `app-user`.

После старта Keycloak доступен на `http://localhost:8080`, админка — `admin` / `admin`.
Войдите в SPA как `testuser` / `password` — будет доступен и профиль, и защищённый раздел `/protected`.

> Настройку можно повторить и вручную в админ-консоли: realm `myrealm`, public-клиент
> со Standard Flow, Valid redirect URIs `http://localhost:5173/*`, Web origins
> `http://localhost:5173`, realm-роль `app-user`, назначенная пользователю.

## Структура

```
src/
├─ keycloak.ts            singleton Keycloak (конфиг из env)
├─ main.tsx               init Keycloak до рендера приложения
├─ App.tsx                Masthead с Login/Logout + маршруты
├─ auth/
│  ├─ AuthContext.tsx     состояние авторизации, парсинг профиля, авто-рефреш
│  ├─ useAuth.ts          хук доступа к контексту
│  └─ ProtectedRoute.tsx  гард маршрута по realm-роли
├─ pages/
│  ├─ HomePage.tsx        профиль пользователя
│  └─ ProtectedPage.tsx   контент за ролью app-user
└─ types/auth.ts          типы профиля и контекста
```
