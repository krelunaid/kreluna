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
    const previewVideo = page.querySelector('[data-cb-preview-video]');
    const videoControls = page.querySelector('[data-cb-video-controls]');
    const videoPlay = page.querySelector('[data-cb-video-play]');
    const videoSeek = page.querySelector('#cb-video-seek');
    const videoTime = page.querySelector('[data-cb-video-time]');
    const hasMedia = () => !previewImage.hidden || !previewVideo.hidden;
    const fileInput = page.querySelector('#cb-preview-file');
    const imageStatus = page.querySelector('#cb-image-status');
    const removeImage = page.querySelector('[data-cb-remove-image]');
    const badge = page.querySelector('[data-cb-preview-badge]');
    let imageUrl;
    let imageSequence = 0;
    let cancelCandidate;
    let videoVisible = true;
    let previewIncluded = false;
    let selectedTheme = 'lime';
    const requestPreview = page.querySelector('[data-cb-request-preview]');
    const requestPreviewText = page.querySelector('[data-cb-request-preview-text]');
    const requestPreviewNote = page.querySelector('[data-cb-request-preview-note]');
    const syncPreview = () => {
      if (!previewIncluded) return;
      requestPreviewText.textContent = !previewVideo.hidden ? requestPreview.dataset.videoSummary : !previewImage.hidden ? requestPreview.dataset.imageSummary : previewMessage.textContent;
      requestPreviewNote.textContent = !hasMedia() ? requestPreviewNote.dataset.textNote : requestPreviewNote.dataset.imageNote;
    };
    const showView = mode => {
      screen.hidden = mode === 'original';
      if (screen.hidden) previewVideo.pause();
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
      const clock = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
      const syncVideo = () => {
        const duration = Number.isFinite(previewVideo.duration) ? previewVideo.duration : 0;
        videoSeek.max = String(duration || 1);
        videoSeek.value = String(previewVideo.currentTime || 0);
        videoTime.textContent = `${clock(previewVideo.currentTime || 0)} / ${clock(duration)}`;
        videoPlay.textContent = previewVideo.paused ? videoPlay.dataset.playLabel : videoPlay.dataset.pauseLabel;
      };
      ['play','pause','timeupdate','loadedmetadata','ended'].forEach(name => previewVideo.addEventListener(name, syncVideo));
      const play = async () => {
        if (previewVideo.hidden || !videoVisible) return;
        showView('simulation');
        try { await previewVideo.play(); } catch { imageStatus.textContent = page.querySelector('.cb-preview-editor').dataset.imageError; }
      };
      videoPlay.addEventListener('click', () => { if (previewVideo.paused) void play(); else previewVideo.pause(); });
      page.querySelector('[data-cb-video-restart]').addEventListener('click', () => { previewVideo.currentTime = 0; void play(); });
      videoSeek.addEventListener('input', () => { if (Number.isFinite(previewVideo.duration)) previewVideo.currentTime = Math.min(Number(videoSeek.value), previewVideo.duration); });
      document.addEventListener('visibilitychange', () => { if (document.hidden) previewVideo.pause(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(entries => { videoVisible = entries[0].isIntersecting; if (!videoVisible) previewVideo.pause(); }).observe(stageWrap);
      const clearMedia = () => {
        previewVideo.pause();
        previewVideo.hidden = true;
        previewVideo.removeAttribute('src');
        previewVideo.load();
        videoControls.hidden = true;
        previewImage.hidden = true;
        previewImage.removeAttribute('src');
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        imageUrl = undefined;
      };
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const sequence = ++imageSequence;
        cancelCandidate?.();
        const editor = page.querySelector('.cb-preview-editor');
        const invalid = () => { imageStatus.textContent = editor.dataset.imageError; fileInput.value = ''; };
        const isVideo = ['video/mp4','video/webm'].includes(file.type) || (!file.type && /\.(mp4|webm)$/i.test(file.name));
        if ((!isVideo && !['image/jpeg','image/png','image/webp'].includes(file.type)) || !file.size || file.size > (isVideo ? 50 : 5) * 1024 * 1024) { invalid(); return; }
        const candidateUrl = URL.createObjectURL(file);
        const candidate = isVideo ? document.createElement('video') : new Image();
        let settled = false;
        let timer;
        const cleanup = keepUrl => {
          clearTimeout(timer);
          candidate.onload = candidate.onerror = candidate.onloadeddata = null;
          if (isVideo) { candidate.pause(); candidate.removeAttribute('src'); candidate.load(); }
          if (!keepUrl) URL.revokeObjectURL(candidateUrl);
          cancelCandidate = undefined;
        };
        cancelCandidate = () => { settled = true; cleanup(false); };
        const finish = valid => {
          if (settled) return;
          settled = true;
          if (sequence !== imageSequence || !valid) { cleanup(false); if (sequence === imageSequence) invalid(); return; }
          cleanup(true);
          clearMedia();
          imageUrl = candidateUrl;
          if (isVideo) {
            previewVideo.src = imageUrl;
            previewVideo.hidden = false;
            previewVideo.muted = true;
            previewVideo.load();
            videoControls.hidden = false;
            syncVideo();
          } else { previewImage.src = imageUrl; previewImage.hidden = false; }
          removeImage.hidden = false;
          imageStatus.textContent = file.name;
          syncPreview();
          showView('simulation');
        };
        imageStatus.textContent = editor.dataset.videoLoading;
        timer = setTimeout(() => finish(false), 20000);
        candidate.onerror = () => finish(false);
        if (isVideo) {
          candidate.muted = true;
          candidate.playsInline = true;
          candidate.preload = 'auto';
          candidate.onloadeddata = () => finish(Number.isFinite(candidate.duration) && candidate.duration > 0 && candidate.duration <= 120 && candidate.videoWidth > 0 && candidate.videoWidth * candidate.videoHeight <= 8294400);
        } else candidate.onload = () => finish(candidate.naturalWidth > 0 && candidate.naturalWidth * candidate.naturalHeight <= 40000000);
        candidate.src = candidateUrl;
      });
      previewVideo.addEventListener('error', () => {
        if (previewVideo.hidden || !previewVideo.getAttribute('src')) return;
        previewVideo.pause();
        imageStatus.textContent = page.querySelector('.cb-preview-editor').dataset.imageError;
      });
      removeImage.addEventListener('click', () => {
        imageSequence++;
        cancelCandidate?.();
        clearMedia();
        fileInput.value = '';
        removeImage.hidden = true;
        imageStatus.textContent = '';
        syncPreview();
      });
      window.addEventListener('pagehide', () => { previewVideo.pause(); cancelCandidate?.(); });
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
      if (!idea.value.trim() && !hasMedia()) idea.value = previewMessage.textContent;
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
      const payload = {name:values.get('name'), email:values.get('email'), format:values.get('format'), date:values.get('date'), idea:values.get('idea'), website:values.get('website'), privacy:values.get('privacy') === 'on', locale:form.dataset.locale, previewMessage:previewIncluded && !hasMedia() ? previewMessage.textContent : '', previewTheme:previewIncluded ? selectedTheme : ''};
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
