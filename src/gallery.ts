for (const gallery of document.querySelectorAll('[data-gallery]')) {
  const images = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-image]')];
  const controls = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-index]')];
  for (const control of controls) {
    control.addEventListener('click', () => {
      const selected = Number(control.dataset.galleryIndex);
      images.forEach((image, index) => { image.hidden = index !== selected; });
      controls.forEach(button => button.setAttribute('aria-pressed', String(button === control)));
    });
  }
}
