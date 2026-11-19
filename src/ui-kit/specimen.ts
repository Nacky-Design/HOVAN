/** P1a only: dialogs and sample sizes. No cart, checkout, persistence or forms. */
const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>('dialog'));
let openingTrigger: HTMLElement | null = null;
let previousDialog: HTMLDialogElement | null = null;
let previousFocus: HTMLElement | null = null;
let changing = false;
function openDialog(id: string, trigger: HTMLElement) {
  const target = document.getElementById(id);
  if (!(target instanceof HTMLDialogElement)) return;
  openingTrigger = trigger;
  previousDialog = null;
  previousFocus = null;
  const returnButton = document.getElementById('product-return');
  if (returnButton) returnButton.textContent = 'Вернуться к UI Kit';
  target.showModal();
}
document.querySelectorAll<HTMLElement>('[data-open]').forEach(button => {
  button.addEventListener('click', () => openDialog(button.dataset.open!, button));
});
document.querySelectorAll<HTMLElement>('[data-close]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelectorAll<HTMLElement>('[data-switch]').forEach(button => {
  button.addEventListener('click', () => {
    const current = button.closest('dialog');
    const next = document.getElementById(button.dataset.switch!);
    if (!(current instanceof HTMLDialogElement) || !(next instanceof HTMLDialogElement)) return;
    previousDialog = current;
    previousFocus = button;
    changing = true;
    current.close();
    next.showModal();
    const returnButton = document.getElementById('product-return');
    if (returnButton) returnButton.textContent = 'Вернуться к образу';
  });
});
for (const dialog of dialogs) {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')).filter(item => item.getClientRects().length);
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('close', () => {
    if (changing) { changing = false; return; }
    if (previousDialog && dialog.id === 'product-dialog') {
      const back = previousDialog;
      const focus = previousFocus;
      previousDialog = null;
      previousFocus = null;
      back.showModal();
      focus?.focus({ preventScroll: true });
      return;
    }
    openingTrigger?.focus({ preventScroll: true });
  });
  let backdropDown = false;
  function outside(event: MouseEvent) {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }
  dialog.addEventListener('pointerdown', event => { backdropDown = outside(event); });
  dialog.addEventListener('click', event => { if (backdropDown && outside(event)) dialog.close(); backdropDown = false; });
}
document.querySelectorAll<HTMLButtonElement>('.size-button:not(:disabled)').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.size-button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const status = document.querySelector('.size-status');
    if (status) status.textContent = `Демо: выбран ${button.textContent}. Наличие не подтверждено.`;
  });
});
type LocalMedia = Record<string, { src: string; alt: string }>;
let localMedia: LocalMedia | null = null;
function renderPhoto(field: HTMLElement) {
  field.querySelector('img')?.remove();
  const placeholder = field.querySelector<HTMLElement>('.photo-placeholder');
  if (placeholder) placeholder.hidden = false;
  const item = localMedia?.[field.dataset.photo!];
  if (!item) return;
  const image = new Image();
  image.alt = item.alt;
  image.decoding = 'async';
  image.className = field.dataset.fit === 'contain' ? 'contain' : '';
  image.addEventListener('load', () => { if (placeholder) placeholder.hidden = true; });
  image.src = item.src;
  field.append(image);
}
const photoModes = {
  silhouette: { photo: 'silhouette', fit: 'contain', title: '01 / Полный силуэт', label: 'Полный силуэт', format: '2:3 · contain · центр 50% / 50%', note: 'Весь человек в кадре: не обрезать голову, рукава, низ и обувь. Сохранить воздух исходной съёмки.' },
  editorial: { photo: 'look04', fit: 'cover', title: '01 / Редакционный образ', label: 'Редакционный образ', format: '3:4 · cover · фокус 50% / 75%', note: 'DSC01859 / look-04. Кроп уходит в свободный фон сверху; движение подола и фигура сохраняются. SHUNCH / ALIK — состав не подтверждён.' },
  product: { photo: 'shunch', fit: 'contain', title: '01 / Фотография изделия', label: 'Фотография изделия', format: '3:4 · contain · центр 50% / 50%', note: 'В центре — молочная блуза целиком, включая манжеты и нижний край. Это фото изделия, не подтверждение состава образа.' },
} as const;
document.querySelectorAll<HTMLButtonElement>('[data-photo-mode]').forEach(button => {
  button.addEventListener('click', () => {
    const mode = button.dataset.photoMode as keyof typeof photoModes;
    const config = photoModes[mode];
    const field = document.getElementById('photo-specimen');
    if (!config || !field) return;
    document.querySelectorAll('[data-photo-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    field.dataset.mode = mode;
    field.dataset.photo = config.photo;
    field.dataset.fit = config.fit;
    const placeholder = field.querySelector('.photo-placeholder');
    if (placeholder) { placeholder.replaceChildren(document.createTextNode(config.label)); const note = document.createElement('span'); note.textContent = 'Фото доступно только локально'; placeholder.append(note); }
    for (const [id, text] of [['photo-role-title', config.title], ['photo-role-format', config.format], ['photo-role-note', config.note]]) {
      const element = document.getElementById(id); if (element) element.textContent = text;
    }
    const action = document.querySelector<HTMLElement>('.photo-look-action');
    if (action) action.hidden = mode !== 'editorial';
    renderPhoto(field);
  });
});
// Standalone HTML never requests private media. Local server opts in explicitly.
if (location.protocol.startsWith('http') && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  fetch('/__local-media/manifest', { cache: 'no-store' }).then(response => response.ok ? response.json() : null).then((media: LocalMedia | null) => {
    if (!media) return;
    localMedia = media;
    document.querySelectorAll<HTMLElement>('[data-photo]').forEach(renderPhoto);
    const note = document.getElementById('media-mode');
    if (note) note.textContent = 'Локальная проверка четырёх режимов фотографии. Связи с SKU предварительные. Снимки не встроены в HTML и не включены в репозиторий.';
  }).catch(() => { /* Keep honest placeholders if local sources are unavailable. */ });
}
