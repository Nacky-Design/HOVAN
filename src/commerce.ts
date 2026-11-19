import { products } from './data/catalog';

const validItems = new Set(products.filter(product => product.photos.length).map(product => product.id));
const kinds = ['wish', 'cart'] as const;
const copy = {
  wish: ['В избранное', 'В избранном'],
  cart: ['В демо-корзину', 'В демо-корзине'],
};

for (const kind of kinds) {
  const key = 'hovan-demo-' + kind;
  const selected = new Set<string>();
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(key) ?? '[]');
    if (Array.isArray(saved)) {
      for (const id of saved) {
        if (typeof id === 'string' && validItems.has(id)) selected.add(id);
      }
    }
  } catch {
    // The demo remains usable when browser storage is unavailable.
  }
  const toggles = [...document.querySelectorAll<HTMLButtonElement>('[data-demo-toggle="' + kind + '"]')];
  const list = document.querySelector<HTMLElement>('[data-demo-list="' + kind + '"]');
  const empty = list?.querySelector<HTMLElement>('[data-demo-empty]');
  const count = document.querySelectorAll('[data-demo-count="' + kind + '"]');
  const status = document.querySelector<HTMLElement>('[data-demo-status]');
  const rows = list?.querySelectorAll<HTMLElement>('[data-demo-item]');

  function render() {
    for (const toggle of toggles) {
      const active = selected.has(toggle.dataset.productId ?? '');
      toggle.setAttribute('aria-pressed', String(active));
      const label = toggle.querySelector('[data-demo-label]');
      if (label) label.textContent = copy[kind][Number(active)];
    }
    for (const node of count) node.textContent = String(selected.size);
    for (const row of rows ?? []) row.hidden = !selected.has(row.dataset.demoItem ?? '');
    if (empty) empty.hidden = selected.size > 0;
  }

  function update(id: string, add: boolean) {
    if (!validItems.has(id)) return;
    if (add) selected.add(id);
    else selected.delete(id);
    try { sessionStorage.setItem(key, JSON.stringify([...selected])); } catch { /* Memory state is enough for this demo. */ }
    render();
    if (status) status.textContent = add ? copy[kind][1] : 'Удалено';
  }

  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      const id = toggle.dataset.productId ?? '';
      update(id, !selected.has(id));
    });
  }
  for (const remove of list?.querySelectorAll<HTMLButtonElement>('[data-demo-remove]') ?? []) {
    remove.addEventListener('click', () => {
      update(remove.dataset.productId ?? '', false);
      const next = list?.querySelector<HTMLButtonElement>('[data-demo-item]:not([hidden]) button');
      const returnLink = list?.parentElement?.querySelector<HTMLElement>('[data-dialog-link]');
      (next ?? returnLink)?.focus();
    });
  }
  render();
}
