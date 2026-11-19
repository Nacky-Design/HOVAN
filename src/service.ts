for (const form of document.querySelectorAll<HTMLFormElement>('[data-demo-form]')) {
  const result = form.querySelector<HTMLElement>('[data-form-result]');
  const dialog = form.closest('dialog');

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (result) result.textContent = 'Поля заполнены. Данные не отправлены.';
  });
  form.addEventListener('change', () => {
    if (result) result.textContent = '';
  });
  dialog?.addEventListener('close', () => {
    form.reset();
    if (result) result.textContent = '';
  });
}
