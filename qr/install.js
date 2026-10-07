(() => {
  const button = document.querySelector('[data-install-site]');
  const help = document.getElementById('install-help');
  const close = document.querySelector('[data-install-close]');
  const message = document.querySelector('[data-install-message]');
  if (!button || !help || !close || !message) return;

  const english = document.documentElement.lang === 'en';
  const standalone = window.matchMedia('(display-mode: standalone)');
  let pendingPrompt = null;

  function updateButton() {
    button.hidden = standalone.matches || window.navigator.standalone === true;
  }

  function showHelp(text = '') {
    message.textContent = text;
    help.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    help.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    close.focus({ preventScroll: true });
  }

  function closeHelp() {
    help.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.focus({ preventScroll: true });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingPrompt = event;
  });

  window.addEventListener('appinstalled', () => {
    pendingPrompt = null;
    button.hidden = true;
    help.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  });

  button.addEventListener('click', async () => {
    if (!pendingPrompt) {
      if (help.hidden) showHelp();
      else closeHelp();
      return;
    }

    const prompt = pendingPrompt;
    pendingPrompt = null;
    button.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome !== 'accepted') {
        showHelp(english
          ? 'You can add the site later from your browser menu.'
          : 'Puoi aggiungere il sito in seguito dal menu del browser.');
      }
    } catch {
      showHelp();
    } finally {
      button.disabled = false;
    }
  });

  close.addEventListener('click', closeHelp);
  help.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeHelp();
  });
  standalone.addEventListener('change', updateButton);
  updateButton();
})();
