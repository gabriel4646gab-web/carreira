// Ponto de Entrada da Aplicação (App Hub)
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o Gerenciador de Interface
  window.uiManager = new UIManager();

  // Tenta carregar save existente do LocalStorage
  const savedCareer = StorageManager.loadActiveCareer();

  if (savedCareer) {
    window.uiManager.init(savedCareer);
    window.uiManager.showToast('Carreira Carregada', `Bem-vindo de volta, ${savedCareer.type === 'player' ? savedCareer.player.name : savedCareer.manager.name}!`, 'info');
  } else {
    window.uiManager.init(null);
  }
});
