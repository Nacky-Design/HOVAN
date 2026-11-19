# HOVAN

Первый HTML-срез капсулы KAMI на Astro. Главная содержит Header, Hero, вступление KAMI и два редакционных образа. В маршруте `/ui-kit` сохранена рабочая основа Seed UI Kit P1a.1.

## Локальный запуск

Требуется Node.js 24.

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run dev
```

Для закрытого локального просмотра подключите папку `assets_web` из проверенного фотопакета. Сервер по умолчанию слушает loopback.

```sh
ASTRO_TELEMETRY_DISABLED=1 HOVAN_LOCAL_PHOTO_ROOT=/absolute/path/to/assets_web npm run dev
```

Статическая сборка сохраняет композицию с нейтральными полями вместо клиентских фотографий. Для ревью кропов используйте локальный запуск с фотопакетом.

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run check
ASTRO_TELEMETRY_DISABLED=1 npm run build
```
