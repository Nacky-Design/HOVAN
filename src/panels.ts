for (const panel of document.querySelectorAll<HTMLDialogElement>('dialog[data-panel]')) {
  let opener: HTMLElement | undefined;
  let returnToAnchor = false;
  let pagePosition = 0;
  const list = panel.querySelector<HTMLElement>('[data-look-list]');
  const view = panel.querySelector<HTMLElement>('[data-look-view]');
  const detail = panel.querySelector<HTMLButtonElement>('[data-look-detail]');
  const back = panel.querySelector<HTMLButtonElement>('[data-look-back]');

  for (const control of document.querySelectorAll<HTMLButtonElement>('[data-dialog-open]')) {
    if (control.dataset.dialogOpen !== panel.id) continue;
    control.addEventListener('click', () => {
      opener = control;
      pagePosition = window.scrollY;
      returnToAnchor = false;
      panel.showModal();
    });
  }

  panel.querySelector('[data-dialog-close]')?.addEventListener('click', () => panel.close());
  panel.addEventListener('click', event => {
    if (event.target !== panel) return;
    const { left, right, top, bottom } = panel.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      panel.close();
    }
  });

  for (const link of panel.querySelectorAll('[data-dialog-link]')) {
    link.addEventListener('click', () => {
      returnToAnchor = true;
      panel.close();
    });
  }

  detail?.addEventListener('click', () => {
    if (!list || !view) return;
    list.hidden = true;
    view.hidden = false;
    panel.scrollTop = 0;
    view.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
  });

  back?.addEventListener('click', () => {
    if (!list || !view) return;
    view.hidden = true;
    list.hidden = false;
    detail?.focus();
  });

  panel.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const elements = [...panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')]
      .filter(element => element.getClientRects().length > 0);
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  panel.addEventListener('close', () => {
    if (list) list.hidden = false;
    if (view) view.hidden = true;
    if (!returnToAnchor) {
      opener?.focus({ preventScroll: true });
      window.scrollTo({ top: pagePosition, behavior: 'instant' });
    }
  });
}
