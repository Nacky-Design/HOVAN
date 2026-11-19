# HOVAN

Адаптивный фронтенд первой капсулы KAMI на Astro. Главная охватывает S00–S12. Маршрут `/ui-kit` содержит Seed UI Kit P1a.1.

## Запуск и проверка

Требуется Node.js 24. Установка воспроизводится через зафиксированный lockfile.

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run dev
ASTRO_TELEMETRY_DISABLED=1 npm run check
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

Режим разработки слушает loopback. Статическая сборка в `dist/` содержит подписанные поля для изображений. При публикации в подкаталог передайте его через параметр Astro `--base`.

## Закрытый просмотр с фотографиями

Для локального показа укажите проверенный каталог `assets_web` и приватную карту JSON. Карта хранится за пределами репозитория. Её ключи совпадают с идентификаторами фото во фронтенде, значения имеют вид `каталог/файл.webp` относительно `assets_web`.

```sh
ASTRO_TELEMETRY_DISABLED=1 \
  HOVAN_LOCAL_PHOTO_ROOT=/absolute/path/to/assets_web \
  HOVAN_LOCAL_PHOTO_MAP=/absolute/path/to/local-photo-map.json \
  npm run dev
```

Фото доступны через локальный сервер разработки. Избранное, корзина и формы демонстрационные. Состояние списка сохраняется в сессии браузера. Формы проверяют выбор темы, а отправка данных и оформление заказа отсутствуют.

[Активные решения](docs/ACTIVE_DECISIONS.md)
