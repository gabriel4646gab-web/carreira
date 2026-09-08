// Gerenciador de Armazenamento Local (LocalStorage Persistence)
class StorageManager {
  static STORAGE_KEY = 'simulador_carreira_save_data';
  static SLOTS_KEY = 'simulador_carreira_slots';

  // Salva o estado da carreira atual
  static saveCareer(career) {
    try {
      const serialized = JSON.stringify(career.toJSON());
      localStorage.setItem(this.STORAGE_KEY, serialized);
      
      // Salva no slot padrão também
      let slots = this.getSavedSlots();
      const currentClub = career.getCurrentClub();
      const entityName = career.type === 'player' ? career.player.name : career.manager.name;
      const ovr = career.type === 'player' ? career.player.ovr : career.manager.reputation;

      const slotInfo = {
        id: career.id,
        type: career.type,
        name: entityName,
        clubName: currentClub.name,
        season: career.seasonName,
        week: career.currentWeek,
        ovr: ovr,
        updatedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      const existingIndex = slots.findIndex(s => s.id === career.id);
      if (existingIndex >= 0) {
        slots[existingIndex] = slotInfo;
      } else {
        slots.unshift(slotInfo);
      }
      localStorage.setItem(this.SLOTS_KEY, JSON.stringify(slots));

      return true;
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
      return false;
    }
  }

  // Carrega a carreira ativa salva
  static loadActiveCareer() {
    try {
      const dataStr = localStorage.getItem(this.STORAGE_KEY);
      if (!dataStr) return null;
      const data = JSON.parse(dataStr);
      return new Career(data);
    } catch (e) {
      console.error('Erro ao carregar carreira:', e);
      return null;
    }
  }

  // Retorna slots de carreiras salvas
  static getSavedSlots() {
    try {
      const slotsStr = localStorage.getItem(this.SLOTS_KEY);
      return slotsStr ? JSON.parse(slotsStr) : [];
    } catch (e) {
      return [];
    }
  }

  // Limpa a carreira atual
  static clearCurrentCareer() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Exporta save para arquivo JSON
  static exportSaveFile(career) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(career.toJSON()));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `carreira_${career.type}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}
