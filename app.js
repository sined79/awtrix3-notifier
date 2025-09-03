// Données de l'application
const appData = {
  sounds: [
    {"id": "", "name": "Aucun son"},
    {"id": "beep", "name": "Bip simple", "rtttl": "beep:d=4,o=5,b=100:8e6,8p,8e6"},
    {"id": "SuperMarioTheme", "name": "Super Mario Theme"},
    {"id": "SuperMarioLost", "name": "Super Mario Lost"},
    {"id": "HarryPotter", "name": "Harry Potter"},
    {"id": "StarWars", "name": "Star Wars"}
  ],
  colors: [
    {"hex": "FF0000", "name": "Rouge"},
    {"hex": "00FF00", "name": "Vert"},
    {"hex": "0000FF", "name": "Bleu"},
    {"hex": "FFFF00", "name": "Jaune"},
    {"hex": "FF6600", "name": "Orange"},
    {"hex": "FF00FF", "name": "Magenta"},
    {"hex": "00FFFF", "name": "Cyan"},
    {"hex": "FFFFFF", "name": "Blanc"}
  ],
  effects: [
    {"id": "", "name": "Aucun effet"},
    {"id": "Matrix", "name": "Matrix"},
    {"id": "Slide", "name": "Slide"},
    {"id": "Fade", "name": "Fade"},
    {"id": "Rainbow", "name": "Rainbow"}
  ],
  defaultIp: "192.168.0.84"
};

// État de l'application
let appState = {
  currentTab: 'notification',
  clockIp: appData.defaultIp,
  isConnected: false,
  history: []
};

// Éléments DOM
const elements = {
  // Navigation
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Formulaire
  form: document.getElementById('notificationForm'),
  message: document.getElementById('message'),
  charCount: document.getElementById('charCount'),
  colorPalette: document.getElementById('colorPalette'),
  selectedColor: document.getElementById('selectedColor'),
  sound: document.getElementById('sound'),
  icon: document.getElementById('icon'),
  effect: document.getElementById('effect'),
  repeat: document.getElementById('repeat'),
  repeatValue: document.getElementById('repeatValue'),
  
  // Boutons
  previewBtn: document.getElementById('previewBtn'),
  sendBtn: document.getElementById('sendBtn'),
  
  // Aperçu
  previewCard: document.getElementById('previewCard'),
  previewDisplay: document.getElementById('previewDisplay'),
  
  // Historique
  historyList: document.getElementById('historyList'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  
  // Réglages
  clockIp: document.getElementById('clockIp'),
  testConnectionBtn: document.getElementById('testConnectionBtn'),
  
  // Status
  statusIndicator: document.getElementById('statusIndicator'),
  statusText: document.getElementById('statusText'),
  
  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
  initPWA();
  initApp();
  setupEventListeners();
  populateFormData();
  loadSettings();
});

function initApp() {
  // Initialiser l'IP de l'horloge
  elements.clockIp.value = appState.clockIp;
  
  // Mettre à jour le compteur de caractères
  updateCharCount();
  
  // Mettre à jour la valeur du slider
  updateSliderValue();
  
  // Afficher l'historique
  renderHistory();
}

function setupEventListeners() {
  // Navigation par onglets
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  
  // Formulaire
  elements.form.addEventListener('submit', handleSubmit);
  elements.message.addEventListener('input', updateCharCount);
  elements.repeat.addEventListener('input', updateSliderValue);
  elements.previewBtn.addEventListener('click', showPreview);
  
  // Réglages
  elements.clockIp.addEventListener('change', saveSettings);
  elements.testConnectionBtn.addEventListener('click', testConnection);
  
  // Historique
  elements.clearHistoryBtn.addEventListener('click', clearHistory);
}

function populateFormData() {
  // Populate sounds
  elements.sound.innerHTML = appData.sounds.map(sound => 
    `<option value="${sound.id}">${sound.name}</option>`
  ).join('');
  
  // Populate effects
  elements.effect.innerHTML = appData.effects.map(effect => 
    `<option value="${effect.id}">${effect.name}</option>`
  ).join('');
  
  // Populate color palette
  elements.colorPalette.innerHTML = appData.colors.map(color => 
    `<div class="color-option ${color.hex === 'FFFFFF' ? 'selected' : ''}" 
          data-color="${color.hex}" 
          style="background-color: #${color.hex};"
          title="${color.name}">
     </div>`
  ).join('');
  
  // Event listeners for color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => selectColor(option.dataset.color));
  });
}

function switchTab(tabName) {
  // Update buttons
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('tab-btn--active', btn.dataset.tab === tabName);
  });
  
  // Update content
  elements.tabContents.forEach(content => {
    content.classList.toggle('tab-content--active', content.id === tabName);
  });
  
  appState.currentTab = tabName;
}

function selectColor(colorHex) {
  // Update selected color
  elements.selectedColor.value = colorHex;
  
  // Update visual selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.color === colorHex);
  });
}

function updateCharCount() {
  const count = elements.message.value.length;
  elements.charCount.textContent = count;
  
  // Update counter styling
  elements.charCount.parentElement.classList.toggle('warning', count > 400);
  elements.charCount.parentElement.classList.toggle('error', count > 480);
}

function updateSliderValue() {
  elements.repeatValue.textContent = elements.repeat.value;
}

function showPreview() {
  const formData = getFormData();
  
  elements.previewDisplay.innerHTML = `
    <div class="preview-text" style="color: #${formData.color}">
      ${formData.text || 'Message vide'}
    </div>
    <div class="preview-meta">
      ${formData.sound ? `<span>Son: ${getSoundName(formData.sound)}</span>` : ''}
      ${formData.icon ? `<span>Icône: ${formData.icon}</span>` : ''}
      ${formData.effect ? `<span>Effet: ${getEffectName(formData.effect)}</span>` : ''}
      <span>Répétitions: ${formData.repeat}</span>
    </div>
  `;
  
  elements.previewCard.classList.remove('hidden');
  elements.previewCard.classList.add('fade-in');
}

function getFormData() {
  return {
    text: elements.message.value.trim(),
    color: elements.selectedColor.value,
    sound: elements.sound.value,
    icon: elements.icon.value || "",
    effect: elements.effect.value,
    repeat: parseInt(elements.repeat.value)
  };
}

function getSoundName(soundId) {
  const sound = appData.sounds.find(s => s.id === soundId);
  return sound ? sound.name : soundId;
}

function getEffectName(effectId) {
  const effect = appData.effects.find(e => e.id === effectId);
  return effect ? effect.name : effectId;
}

function validateForm(formData) {
  const errors = [];
  
  if (!formData.text) {
    errors.push('Le message est obligatoire');
    elements.message.classList.add('invalid');
  } else {
    elements.message.classList.remove('invalid');
    elements.message.classList.add('valid');
  }
  
  if (formData.icon && (isNaN(formData.icon) || formData.icon < 0 || formData.icon > 9999)) {
    errors.push('L\'ID d\'icône doit être entre 0 et 9999');
    elements.icon.classList.add('invalid');
  } else {
    elements.icon.classList.remove('invalid');
  }
  
  return errors;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const formData = getFormData();
  const errors = validateForm(formData);
  
  if (errors.length > 0) {
    showToast('error', errors.join('<br>'));
    return;
  }
  
  // Show loading state
  setButtonLoading(elements.sendBtn, true);
  
  try {
    await sendNotification(formData);
    
    // Add to history
    addToHistory(formData);
    
    // Show success message
    showToast('success', 'Notification envoyée avec succès !');
    
    // Clear form
    elements.form.reset();
    elements.selectedColor.value = 'FFFFFF';
    selectColor('FFFFFF');
    updateCharCount();
    updateSliderValue();
    elements.previewCard.classList.add('hidden');
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    showToast('error', 'Erreur lors de l\'envoi. Vérifiez la connexion et essayez le VPN si nécessaire.');
  } finally {
    setButtonLoading(elements.sendBtn, false);
  }
}

async function sendNotification(data) {
  const url = `${appState.clockIp}/api/notify`;
  
  // Prepare payload
  const payload = {
    text: data.text
  };
  
  if (data.color) payload.color = data.color;
  if (data.sound) payload.sound = data.sound;
  if (data.icon) payload.icon = data.icon;
  if (data.effect) payload.effect = data.effect;
  if (data.repeat > 1) payload.repeat = data.repeat;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

function addToHistory(data) {
  const historyItem = {
    ...data,
    timestamp: new Date().toLocaleString('fr-FR'),
    id: Date.now()
  };
  
  appState.history.unshift(historyItem);
  
  // Limit history to 50 items
  if (appState.history.length > 50) {
    appState.history = appState.history.slice(0, 50);
  }
  
  renderHistory();
}

function renderHistory() {
  if (appState.history.length === 0) {
    elements.historyList.innerHTML = `
      <div class="empty-state">
        <p>Aucune notification dans l'historique</p>
      </div>
    `;
    return;
  }
  
  elements.historyList.innerHTML = appState.history.map(item => `
    <div class="history-item fade-in">
      <div class="history-header">
        <div class="history-message" style="color: #${item.color}">
          ${item.text}
        </div>
        <div class="history-timestamp">${item.timestamp}</div>
      </div>
      <div class="history-meta">
        ${item.sound ? `<span class="history-tag">Son: ${getSoundName(item.sound)}</span>` : ''}
        ${item.icon ? `<span class="history-tag">Icône: ${item.icon}</span>` : ''}
        ${item.effect ? `<span class="history-tag">Effet: ${getEffectName(item.effect)}</span>` : ''}
        <span class="history-tag">Rép: ${item.repeat}</span>
      </div>
      <div class="history-actions">
        <button class="btn btn--sm btn--secondary" onclick="reuseNotification(${item.id})">
          Réutiliser
        </button>
        <button class="btn btn--sm btn--outline" onclick="deleteHistoryItem(${item.id})">
          Supprimer
        </button>
      </div>
    </div>
  `).join('');
}

function reuseNotification(id) {
  const item = appState.history.find(h => h.id === id);
  if (!item) return;
  
  // Fill form with history data
  elements.message.value = item.text;
  elements.selectedColor.value = item.color;
  selectColor(item.color);
  elements.sound.value = item.sound || '';
  elements.icon.value = item.icon || '';
  elements.effect.value = item.effect || '';
  elements.repeat.value = item.repeat;
  
  updateCharCount();
  updateSliderValue();
  
  // Switch to notification tab
  switchTab('notification');
  
  showToast('info', 'Notification restaurée dans le formulaire');
}

function deleteHistoryItem(id) {
  appState.history = appState.history.filter(h => h.id !== id);
  renderHistory();
  showToast('info', 'Notification supprimée de l\'historique');
}

function clearHistory() {
  if (appState.history.length === 0) return;
  
  if (confirm('Êtes-vous sûr de vouloir vider l\'historique ?')) {
    appState.history = [];
    renderHistory();
    showToast('info', 'Historique vidé');
  }
}

function saveSettings() {
  appState.clockIp = elements.clockIp.value.trim() || appData.defaultIp;
  elements.clockIp.value = appState.clockIp;
  showToast('info', 'IP sauvegardée');
}

function loadSettings() {
  elements.clockIp.value = appState.clockIp;
}

async function testConnection() {
  setButtonLoading(elements.testConnectionBtn, true);
  updateConnectionStatus('testing');
  
  try {
    const url = `${appState.clockIp}/api/stats`;
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      updateConnectionStatus('connected');
      showToast('success', 'Connexion réussie !');
    } else {
      throw new Error('Réponse invalide');
    }
  } catch (error) {
    updateConnectionStatus('disconnected');
    showToast('error', 
      'Impossible de se connecter à l\'horloge.<br>' +
      'Vérifiez l\'IP et activez le VPN WireGuard si nécessaire.'
    );
  } finally {
    setButtonLoading(elements.testConnectionBtn, false);
  }
}

function updateConnectionStatus(status) {
  appState.isConnected = status === 'connected';
  
  elements.statusIndicator.className = 'status-indicator';
  
  switch(status) {
    case 'connected':
      elements.statusIndicator.classList.add('connected');
      elements.statusText.textContent = 'Connecté';
      break;
    case 'testing':
      elements.statusIndicator.classList.add('testing');
      elements.statusText.textContent = 'Test en cours...';
      break;
    default:
      elements.statusText.textContent = 'Non connecté';
  }
}

function setButtonLoading(button, isLoading) {
  const textSpan = button.querySelector('.btn-text');
  const loadingSpan = button.querySelector('.btn-loading');
  
  if (isLoading) {
    if (textSpan) textSpan.classList.add('hidden');
    if (loadingSpan) loadingSpan.classList.remove('hidden');
    button.disabled = true;
  } else {
    if (textSpan) textSpan.classList.remove('hidden');
    if (loadingSpan) loadingSpan.classList.add('hidden');
    button.disabled = false;
  }
}

function showToast(type, message, duration = 5000) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}


// Variable pour stocker l'événement d'installation PWA
let deferredPrompt = null;

// Fonction d'initialisation PWA
function initPWA() {
  console.log("1");
    // Enregistrement du service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('SW: Enregistré avec succès', registration.scope);
                })
                .catch((error) => {
                    console.log('SW: Échec enregistrement', error);
                });
        });
    }

    // Gestion de l'installation PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA: Installation disponible');
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    // Détection si l'app est installée
    window.addEventListener('appinstalled', () => {
        console.log('PWA: Installation réussie!');
        hideInstallButton();
        showToast('Application installée avec succès!', 'success');
    });
}

function showInstallButton() {
    console.log("2");
    // Créer le bouton d'installation s'il n'existe pas
    let installBtn = document.getElementById('installBtn');
    if (!installBtn) {
        installBtn = document.createElement('button');
        installBtn.id = 'installBtn';
        installBtn.className = 'btn btn--primary install-btn';
        installBtn.innerHTML = '📱 Installer l\'apps';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 25px;
            padding: 10px 16px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(installBtn);
    }

    installBtn.style.display = 'block';
    
    // Gérer le clic sur le bouton d'installation
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log('PWA: Réponse utilisateur:', outcome);
            
            if (outcome === 'accepted') {
                showToast('Installation en cours...', 'info');
            } else {
                showToast('Installation annulée', 'warning');
                // Réafficher le bouton après un délai
                setTimeout(() => {
                    installBtn.style.display = 'block';
                }, 3000);
            }
            
            deferredPrompt = null;
        }
    });
}

function hideInstallButton() {
  console.log("3");
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
}

// Fonction pour détecter si l'app est déjà installée (iOS Safari)
function isStandalone() {
  console.log("4");
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}


// Expose global functions for onclick handlers
window.reuseNotification = reuseNotification;
window.deleteHistoryItem = deleteHistoryItem;