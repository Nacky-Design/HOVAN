import { createReadStream, readFileSync, realpathSync } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { isAbsolute, join, sep } from 'node:path';
import { defineConfig } from 'astro/config';

const photoRoot = process.env.HOVAN_LOCAL_PHOTO_ROOT;
const hasPhotoRoot = Boolean(photoRoot && isAbsolute(photoRoot));
const photoMap = process.env.HOVAN_LOCAL_PHOTO_MAP;

function loadPhotoMap() {
  if (!photoMap || !isAbsolute(photoMap)) return {};
  const source = JSON.parse(readFileSync(photoMap, 'utf8'));
  const entries = Object.entries(source).filter(([key, path]) =>
    /^[a-z0-9-]+$/.test(key) &&
    typeof path === 'string' && /^[a-z0-9_-]+\/[a-z0-9_-]+\.webp$/i.test(path),
  );
  return Object.fromEntries(entries);
}

function privatePhotos() {
  return {
    name: 'hovan-private-photos',
    apply: 'serve',
    configureServer(server) {
      const photos = loadPhotoMap();
      const realRoot = hasPhotoRoot ? realpathSync(photoRoot) : null;
      server.middlewares.use(async (request, response, next) => {
        const url = request.url ?? '';
        const host = request.headers.host ?? '';
        const loopbackHost = /^(?:127\.0\.0\.1|localhost):\d+$/.test(host);
        const loopbackPeer = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress);
        const localPhotos = realRoot && Boolean(photoMap) && loopbackHost && loopbackPeer;

        if (url === '/__local-media/manifest') {
          const media = localPhotos ? {
            silhouette: { src: '/__p1b-photo/kit-silhouette', alt: 'Модель в полный рост' },
            shunch: { src: '/__p1b-photo/kit-shunch', alt: 'Молочная блуза' },
            hishat: { src: '/__p1b-photo/detail', alt: 'Орнамент кушака' },
            look04: { src: '/__p1b-photo/movement', alt: 'Светлая блуза и тёмная юбка в движении' },
          } : null;
          response.setHeader('Content-Type', 'application/json');
          response.setHeader('Cache-Control', 'no-store');
          response.end(JSON.stringify(media));
          return;
        }
        if (!url.startsWith('/__p1b-photo/')) return next();

        const key = url.slice('/__p1b-photo/'.length);
        if (!localPhotos || !Object.hasOwn(photos, key)) {
          response.writeHead(404).end();
          return;
        }
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.writeHead(405, { Allow: 'GET, HEAD' }).end();
          return;
        }
        const file = await realpath(join(realRoot, photos[key])).catch(() => null);
        const withinRoot = file?.startsWith(realRoot + sep);
        const info = withinRoot ? await stat(file).catch(() => null) : null;
        if (!info?.isFile()) {
          response.writeHead(404).end();
          return;
        }
        response.writeHead(200, {
          'Content-Type': 'image/webp',
          'Content-Length': info.size,
          'Cache-Control': 'no-store',
          'Cross-Origin-Resource-Policy': 'same-origin',
          'X-Robots-Tag': 'noindex, nofollow',
        });
        if (request.method === 'HEAD') response.end();
        else createReadStream(file).on('error', () => response.destroy()).pipe(response);
      });
    },
  };
}

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1' },
  vite: { plugins: [privatePhotos()] },
});
