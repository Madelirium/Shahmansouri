(() => {
  const button = document.querySelector('[data-install-site]');
  const message = document.querySelector('[data-install-message]');
  if (!button || !message) return;

  const english = document.documentElement.lang === 'en';
  const standalone = window.matchMedia('(display-mode: standalone)');
  let pendingPrompt = null;

  function updateButton() {
    button.hidden = standalone.matches || window.navigator.standalone === true;
  }

  function showMessage(text) {
    message.textContent = text;
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingPrompt = event;
    message.textContent = '';
  });

  window.addEventListener('appinstalled', () => {
    pendingPrompt = null;
    button.hidden = true;
    message.textContent = '';
  });

  button.addEventListener('click', async () => {
    if (!pendingPrompt) {
      message.textContent = '';
      return;
    }

    const prompt = pendingPrompt;
    pendingPrompt = null;
    message.textContent = '';
    button.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome !== 'accepted') {
        showMessage(english
          ? 'You can add the site later from your browser menu.'
          : 'Puoi aggiungere il sito in seguito dal menu del browser.');
      }
    } catch {
      showMessage(english
        ? 'Installation could not start. Try adding the site from your browser menu.'
        : 'Non riesco ad avviare l\'installazione. Prova ad aggiungere il sito dal menu del browser.');
    } finally {
      button.disabled = false;
    }
  });

  standalone.addEventListener('change', updateButton);
  updateButton();
})();
