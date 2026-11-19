import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { defineConfig } from 'astro/config';

const photoRoot = process.env.HOVAN_LOCAL_PHOTO_ROOT;
const hasPhotoRoot = Boolean(photoRoot && isAbsolute(photoRoot));
const photos = {
  hero: 'hishat/01_hero-on-black_DSC01550.webp',
  kami: 'shunch/03_back_DSC01598.webp',
  movement: 'alik/01_hero-in-motion_DSC01859.webp',
  sash: 'hishat/01_hero-on-black_DSC01550.webp',
  detail: 'hishat/03_macro-pattern_DSC01566.webp',
  'kit-silhouette': 'shunch/01_hero-front_DSC01569.webp',
  'kit-shunch': 'shunch/02_front_DSC01576.webp',
};

function privatePhotos() {
  return {
    name: 'hovan-private-photos',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = request.url ?? '';
        const host = request.headers.host ?? '';
        const loopbackHost = /^(?:127\.0\.0\.1|localhost):\d+$/.test(host);
        const loopbackPeer = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress);
        const localPhotos = hasPhotoRoot && loopbackHost && loopbackPeer;

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
        const file = join(photoRoot, photos[key]);
        const info = await stat(file).catch(() => null);
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
