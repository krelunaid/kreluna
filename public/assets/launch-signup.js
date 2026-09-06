(() => {
  if (window.krelunaLaunchSignup) return;
  window.krelunaLaunchSignup = true;
  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('[data-launch-signup]')) return;
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    const label = button.textContent, status = form.querySelector('.launch-result');
    const data = new FormData(form);
    button.disabled = true; button.textContent = form.dataset.busy; status.textContent = '';
    try {
      const response = await fetch('/api/launch-waitlist', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({project:data.get('project'),locale:data.get('locale'),email:data.get('email'),consent:data.get('consent')==='on',website:data.get('website')})});
      if (!response.ok) throw new Error('registration_failed');
      status.textContent = form.dataset.success;
      form.reset();
    } catch { status.textContent = form.dataset.error; }
    finally { button.disabled = false; button.textContent = label; }
  });
})();
