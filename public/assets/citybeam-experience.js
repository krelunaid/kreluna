(() => {
  const init = () => {
    const page = document.querySelector('.citybeam-page');
    if (!page || page.dataset.cbReady) return;
    page.dataset.cbReady = 'true';
    const dialog = page.querySelector('.citybeam-lightbox');
    let opener;
    if (dialog && typeof dialog.showModal === 'function') {
      const image = dialog.querySelector('img');
      page.querySelectorAll('[data-cb-photo]').forEach(link => {
        link.addEventListener('click', event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          opener = link;
          dialog.dataset.crop = link.href.includes('times-square-context') ? 'context' : '';
          image.src = link.href;
          image.alt = link.querySelector('img').alt;
          dialog.querySelector('figcaption').textContent = link.dataset.caption;
          dialog.showModal();
        });
      });
      dialog.querySelector('[data-cb-close]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
    }
    const form = page.querySelector('[data-cb-enquiry]');
    if (!form) return;
    const labels = JSON.parse(form.dataset.labels);
    const format = form.elements.namedItem('format');
    const date = form.elements.namedItem('date');
    const idea = form.elements.namedItem('idea');
    const status = form.querySelector('[role="status"]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const body = `${form.dataset.intro}\n\n${labels[0]}: ${format.selectedOptions[0].text}\n${labels[1]}: ${date.value || labels[3]}\n\n${labels[2]}:\n${idea.value.trim()}`;
      const mailto = `mailto:info@kreluna.it?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      status.textContent = form.dataset.status;
    });
    page.querySelectorAll('[data-cb-plan]').forEach(link => {
      link.addEventListener('click', () => {
        format.value = link.dataset.cbPlan;
        status.textContent = '';
      });
    });
    form.hidden = false;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
