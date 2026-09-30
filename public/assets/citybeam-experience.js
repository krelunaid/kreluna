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
    const stageWrap = page.querySelector('.cb-stage-wrap');
    const stage = page.querySelector('.cb-stage');
    const screen = page.querySelector('.cb-screen');
    const previewMessage = page.querySelector('[data-cb-preview-message]');
    const previewInput = page.querySelector('#cb-preview-text');
    const previewImage = page.querySelector('[data-cb-preview-image]');
    const fileInput = page.querySelector('#cb-preview-file');
    const imageStatus = page.querySelector('#cb-image-status');
    const removeImage = page.querySelector('[data-cb-remove-image]');
    const badge = page.querySelector('[data-cb-preview-badge]');
    let imageUrl;
    let imageSequence = 0;
    let previewIncluded = false;
    let selectedTheme = 'lime';
    const requestPreview = page.querySelector('[data-cb-request-preview]');
    const requestPreviewText = page.querySelector('[data-cb-request-preview-text]');
    const requestPreviewNote = page.querySelector('[data-cb-request-preview-note]');
    const syncPreview = () => {
      if (!previewIncluded) return;
      requestPreviewText.textContent = previewImage.hidden ? previewMessage.textContent : requestPreview.dataset.imageSummary;
      requestPreviewNote.textContent = previewImage.hidden ? requestPreviewNote.dataset.textNote : requestPreviewNote.dataset.imageNote;
    };
    const showView = mode => {
      screen.hidden = mode === 'original';
      stageWrap.setAttribute('aria-label', mode === 'original' ? stageWrap.dataset.originalLabel : stageWrap.dataset.simulationLabel);
      badge.textContent = mode === 'original' ? badge.dataset.original : badge.dataset.simulation;
      page.querySelectorAll('[data-cb-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cbView === mode)));
    };
    const updateText = () => {
      const text = previewInput.value.trim().replace(/\s+/g, ' ');
      previewMessage.textContent = previewInput.value.trim().split(/\n+/).slice(0, 3).join('\n');
      previewMessage.style.fontSize = text.length > 35 ? '46px' : text.length > 22 ? '58px' : '70px';
      syncPreview();
    };
    if (stageWrap && stage && screen) {
      const resize = () => {
        stage.style.setProperty('--cb-stage-scale', String(stageWrap.clientWidth / 1200));
        stage.dataset.ready = 'true';
      };
      resize();
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stageWrap);
      else window.addEventListener('resize', resize);
      showView('simulation');
      page.querySelectorAll('[data-cb-preview-controls]').forEach(control => { control.hidden = false; });
      page.querySelectorAll('[data-cb-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.cbView)));
      previewInput.addEventListener('input', () => { updateText(); showView('simulation'); });
      page.querySelectorAll('[data-cb-theme]').forEach(button => button.addEventListener('click', () => {
        selectedTheme = button.dataset.cbTheme;
        screen.dataset.theme = selectedTheme;
        page.querySelectorAll('[data-cb-theme]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        showView('simulation');
      }));
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const sequence = ++imageSequence;
        const invalid = () => { imageStatus.textContent = page.querySelector('.cb-preview-editor').dataset.imageError; fileInput.value = ''; };
        if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { invalid(); return; }
        const candidateUrl = URL.createObjectURL(file);
        const candidate = new Image();
        candidate.onload = () => {
          if (sequence !== imageSequence) { URL.revokeObjectURL(candidateUrl); return; }
          if (!candidate.naturalWidth || candidate.naturalWidth * candidate.naturalHeight > 40000000) { URL.revokeObjectURL(candidateUrl); invalid(); return; }
          if (imageUrl) URL.revokeObjectURL(imageUrl);
          imageUrl = candidateUrl;
          previewImage.src = imageUrl;
          previewImage.hidden = false;
          removeImage.hidden = false;
          imageStatus.textContent = file.name;
          syncPreview();
          showView('simulation');
        };
        candidate.onerror = () => { URL.revokeObjectURL(candidateUrl); if (sequence === imageSequence) invalid(); };
        candidate.src = candidateUrl;
      });
      removeImage.addEventListener('click', () => {
        imageSequence++;
        previewImage.hidden = true;
        previewImage.removeAttribute('src');
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        imageUrl = undefined;
        fileInput.value = '';
        removeImage.hidden = true;
        imageStatus.textContent = '';
        syncPreview();
      });
    }
    const form = page.querySelector('[data-cb-enquiry]');
    if (!form) return;
    const format = form.elements.namedItem('format');
    const idea = form.elements.namedItem('idea');
    const status = form.querySelector('[role="status"]');
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = form.querySelector('[data-cb-submit-label]');
    const idleLabel = buttonLabel.textContent;
    let requestId = crypto.randomUUID();
    let pending = false;
    let lastPayload = '';
    page.querySelector('[data-cb-use-preview]')?.addEventListener('click', () => {
      previewIncluded = true;
      updateText();
      requestPreview.hidden = false;
      if (!idea.value.trim() && previewImage.hidden) idea.value = previewMessage.textContent;
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      if (!idea.value.trim() || !form.elements.namedItem('name').value.trim()) { status.textContent = form.dataset.error; return; }
      pending = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      buttonLabel.textContent = form.dataset.sending;
      status.textContent = '';
      const values = new FormData(form);
      let succeeded = false;
      const payload = {name:values.get('name'), email:values.get('email'), format:values.get('format'), date:values.get('date'), idea:values.get('idea'), website:values.get('website'), privacy:values.get('privacy') === 'on', locale:form.dataset.locale, previewMessage:previewIncluded && previewImage.hidden ? previewMessage.textContent : '', previewTheme:previewIncluded ? selectedTheme : ''};
      const fingerprint = JSON.stringify(payload);
      if (lastPayload && lastPayload !== fingerprint) requestId = crypto.randomUUID();
      lastPayload = fingerprint;
      try {
        const response = await fetch(form.action, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({requestId, ...payload}),
          signal:AbortSignal.timeout(20000),
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true || !result.reference) throw new Error(response.status === 429 ? 'rate_limit' : 'unavailable');
        succeeded = true;
        status.textContent = `${form.dataset.success} ${result.reference}.`;
        status.focus({preventScroll:true});
        requestId = crypto.randomUUID();
      } catch (error) {
        status.textContent = error.message === 'rate_limit' ? form.dataset.rateLimit : form.dataset.error;
      } finally {
        pending = false;
        button.disabled = succeeded;
        buttonLabel.textContent = idleLabel;
        form.removeAttribute('aria-busy');
      }
    });
    page.querySelectorAll('[data-cb-plan]').forEach(link => {
      link.addEventListener('click', () => { format.value = link.dataset.cbPlan; });
    });
    form.hidden = false;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
