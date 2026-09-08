// Gerenciador de Estado Global da Carreira (Career)
class Career {
  constructor(data = {}) {
    this.id = data.id || 'career_' + Date.now();
    this.type = data.type || 'player'; // 'player' ou 'manager'
    this.startYear = data.startYear || 2026;
    this.currentYear = data.currentYear || 2026;
    this.currentWeek = data.currentWeek || 1; // 1 a 38 rodadas
    this.seasonName = `${this.currentYear}/${(this.currentYear + 1).toString().slice(-2)}`;

    // Data real do calendário no jogo
    this.currentDate = data.currentDate ? new Date(data.currentDate) : new Date(2026, 7, 14); // 14/08/2026

    // Perfil e personalidade do Treinador do clube
    this.coach = data.coach || null;

    // Instância do Jogador ou do Técnico
    if (this.type === 'player') {
      this.player = new Player(data.player || {});
      this.manager = null;
    } else {
      this.manager = new Manager(data.manager || {});
      this.player = null;
    }

    // Histórico por temporadas
    this.seasonsHistory = data.seasonsHistory || [];

    // Notícias e Feed de Imprensa
    this.newsFeed = data.newsFeed || [];

    // Propostas de Transferência Pendentes
    this.transferOffers = data.transferOffers || [];

    // Conquistas Desbloqueadas
    this.unlockedAchievements = data.unlockedAchievements || [];

    // Calendário e Tabela da Liga Atual
    this.leagueTable = data.leagueTable || [];
    this.fixtures = data.fixtures || [];

    // Status da Carreira
    this.isRetired = data.isRetired || false;
    this.retirementSummary = data.retirementSummary || null;

    // Inicializar datas e perfil de comissão técnica
    if (typeof CalendarEngine !== 'undefined') {
      CalendarEngine.initSeasonDates(this);
    }
  }

  getCurrentClub() {
    const clubId = this.type === 'player' ? this.player.clubId : this.manager.clubId;
    return getClubById(clubId);
  }

  addNews(title, category = 'Geral') {
    const dateStr = typeof CalendarEngine !== 'undefined' ? CalendarEngine.formatDate(this.currentDate) : `Semana ${this.currentWeek}`;
    const newsItem = {
      id: 'news_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      title: title,
      category: category,
      date: dateStr,
      timestamp: Date.now()
    };
    this.newsFeed.unshift(newsItem);
    if (this.newsFeed.length > 50) this.newsFeed.pop();
  }

  unlockAchievement(achId) {
    if (!this.unlockedAchievements.includes(achId)) {
      this.unlockedAchievements.push(achId);
      const ach = ACHIEVEMENTS_LIST.find(a => a.id === achId);
      if (ach) {
        this.addNews(`🏆 Conquista Desbloqueada: ${ach.title}!`, 'Conquistas');
        if (window.uiManager && window.uiManager.showToast) {
          window.uiManager.showToast(`🏆 Conquista: ${ach.title}`, ach.description, 'success');
        }
      }
    }
  }

  // Serialização para salvamento em JSON / LocalStorage
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      startYear: this.startYear,
      currentYear: this.currentYear,
      currentWeek: this.currentWeek,
      seasonName: this.seasonName,
      currentDate: this.currentDate,
      coach: this.coach,
      player: this.player,
      manager: this.manager,
      seasonsHistory: this.seasonsHistory,
      newsFeed: this.newsFeed,
      transferOffers: this.transferOffers,
      unlockedAchievements: this.unlockedAchievements,
      leagueTable: this.leagueTable,
      fixtures: this.fixtures,
      isRetired: this.isRetired,
      retirementSummary: this.retirementSummary
    };
  }
}
