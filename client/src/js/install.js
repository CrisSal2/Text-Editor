// Get install button element
const butInstall = document.getElementById('buttonInstall');
let deferredPrompt;

// Display install button
function showInstallButton() {
  if (butInstall) {
    butInstall.style.display = 'block';
  }
};

// Hide install button
function hideInstallButton() {
  if (butInstall) {
    butInstall.style.display = 'none';
  }
};

// Handle the PWA installation process
// Listen for the event that triggers the install button display
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  showInstallButton();
});

// Handle the click event for the install button
if (butInstall) {
  butInstall.addEventListener('click', async () => {
    if (!deferredPrompt) {
      console.log('No install prompt is available');
      return;
    }

    try {
        
      const result = await deferredPrompt.prompt();
      console.log(
        `User ${
          result.outcome === 'accepted' ? 'accepted' : 'dismissed'
        } the install prompt`
      );
    } catch (error) {
      console.error('Error triggering install prompt:', error);
    }

    deferredPrompt = null;
    hideInstallButton();
  });
};


window.addEventListener('appinstalled', (event) => {
  console.log('PWA has been installed', event);
});
