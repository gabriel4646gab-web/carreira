// Gerenciador Central de Interface do Usuário (UI Manager) com Suporte a Escala da UI e Rotas Expandidas
class UIManager {
  constructor() {
    this.currentView = 'creation';
    this.activeCareer = null;
    this.uiScale = localStorage.getItem('simulador_ui_scale') || 'normal'; // 'small', 'normal', 'large'
    this.applyUiScale(this.uiScale);
  }

  init(career) {
    this.activeCareer = career;
    this.bindGlobalEvents();
    this.bindMobileEvents();
    if (career) {
      this.updateHeaderAndSidebar();
      this.switchView('dashboard');
    } else {
      this.switchView('creation');
    }
  }

  applyUiScale(scale) {
    this.uiScale = scale;
    localStorage.setItem('simulador_ui_scale', scale);
    const root = document.documentElement;

    if (scale === 'small') {
      root.style.fontSize = '14px';
      root.setAttribute('data-scale', 'small');
    } else if (scale === 'large') {
      root.style.fontSize = '17.5px';
      root.setAttribute('data-scale', 'large');
    } else {
      root.style.fontSize = '16px';
      root.setAttribute('data-scale', 'normal');
    }
  }

  setCareer(career) {
    this.activeCareer = career;
    this.updateHeaderAndSidebar();
    StorageManager.saveCareer(this.activeCareer);
  }

  switchView(viewName, params = {}) {
    this.currentView = viewName;

    if (window.audioEngine) window.audioEngine.playDecisionClick();

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    const contentContainer = document.getElementById('mainContentArea');
    if (!contentContainer) return;

    switch (viewName) {
      case 'creation':
        CreationView.render(contentContainer);
        break;
      case 'dashboard':
        DashboardView.render(contentContainer, this.activeCareer);
        break;
      case 'activities':
        ActivitiesView.render(contentContainer, this.activeCareer);
        break;
      case 'attributes':
        AttributesView.render(contentContainer, this.activeCareer);
        break;
      case 'training':
        TrainingView.render(contentContainer, this.activeCareer);
        break;
      case 'match':
        MatchView.render(contentContainer, this.activeCareer, params);
        break;
      case 'transfers':
        TransfersView.render(contentContainer, this.activeCareer);
        break;
      case 'squad':
        SquadTacticsView.render(contentContainer, this.activeCareer);
        break;
      case 'news':
        NewsView.render(contentContainer, this.activeCareer);
        break;
      case 'stats':
        StatsView.render(contentContainer, this.activeCareer);
        break;
      case 'season':
        SeasonView.render(contentContainer, this.activeCareer);
        break;
      case 'careerSummary':
        CareerSummaryView.render(contentContainer, this.activeCareer);
        break;
      case 'achievements':
        AchievementsView.render(contentContainer, this.activeCareer);
        break;
      default:
        DashboardView.render(contentContainer, this.activeCareer);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this._updateMobileNavActive(viewName);
    this.closeSidebar();
  }

  updateHeaderAndSidebar() {
    const career = this.activeCareer;
    const topBar = document.getElementById('topNavbar');
    const sidebar = document.getElementById('sidebarNav');
    const mobileBottomNav = document.getElementById('mobileBottomNav');

    if (!career) {
      if (topBar) topBar.style.display = 'none';
      if (sidebar) sidebar.style.display = 'none';
      if (mobileBottomNav) mobileBottomNav.classList.remove('career-active');
      return;
    }

    if (topBar) topBar.style.display = 'flex';
    if (sidebar) sidebar.style.display = 'flex';
    if (mobileBottomNav) mobileBottomNav.classList.add('career-active');

    const club = career.getCurrentClub();
    const isPlayer = career.type === 'player';

    const headerName = document.getElementById('hdrEntityName');
    const headerClub = document.getElementById('hdrEntityClub');
    const headerAge = document.getElementById('hdrEntityAge');
    const headerOvr = document.getElementById('hdrEntityOvr');
    const headerValue = document.getElementById('hdrEntityValue');
    const headerSeason = document.getElementById('hdrSeasonWeek');
    const headerClubBadge = document.getElementById('hdrClubBadge');

    if (headerName) headerName.textContent = isPlayer ? career.player.name : career.manager.name;
    if (headerClub) headerClub.textContent = club.name;
    if (headerAge) headerAge.textContent = `${isPlayer ? career.player.age : career.manager.age} anos`;
    if (headerOvr) headerOvr.textContent = isPlayer ? career.player.ovr : career.manager.reputation;
    if (headerValue) {
      headerValue.textContent = isPlayer 
        ? `R$ ${(career.player.marketValue / 1000000).toFixed(1)}M` 
        : `Orç: R$ ${(career.manager.transferBudget / 1000000).toFixed(1)}M`;
    }
    if (headerSeason) {
      const dateFormatted = typeof CalendarEngine !== 'undefined' ? CalendarEngine.formatDate(career.currentDate) : `${career.seasonName} • Rodada ${career.currentWeek}/38`;
      const nextMatch = typeof CalendarEngine !== 'undefined' ? CalendarEngine.getNextMatchInfo(career) : null;
      headerSeason.innerHTML = `<strong>${dateFormatted}</strong> ${nextMatch ? `• <span class="text-gold">Próximo jogo: ${nextMatch.daysLeft === 0 ? 'HOJE' : `em ${nextMatch.daysLeft}d`}</span>` : ''}`;
    }
    if (headerClubBadge) {
      headerClubBadge.style.backgroundColor = club.colors[0];
      headerClubBadge.style.color = club.colors[1] || '#fff';
      headerClubBadge.textContent = club.logoText;
    }

    this.updateCoinsDisplay();
    this.renderSidebarItems();
  }

  updateCoinsDisplay() {
    const el = document.getElementById('hdrEntityCoins');
    if (!el || !this.activeCareer) return;
    const career = this.activeCareer;
    if (career.type === 'player' && career.player) {
      el.textContent = (career.player.coins || 0).toLocaleString('pt-BR');
      const container = document.getElementById('hdrCoinContainer');
      if (container) container.style.display = 'flex';
    } else {
      const container = document.getElementById('hdrCoinContainer');
      if (container) container.style.display = 'none';
    }
  }

  renderSidebarItems() {
    const navList = document.getElementById('sidebarNavList');
    if (!navList || !this.activeCareer) return;

    const isPlayer = this.activeCareer.type === 'player';

    // Menu limpo e realista (sem abas artificiais de Vida ou Treinamento)
    const playerMenu = [
      { id: 'dashboard', label: 'Central & Calendário', icon: 'fa-calendar-days' },
      { id: 'match', label: 'Jogar Partida', icon: 'fa-futbol' },
      { id: 'attributes', label: 'Atributos & OVR', icon: 'fa-chart-simple' },
      { id: 'transfers', label: 'Mercado & Contrato', icon: 'fa-handshake' },
      { id: 'squad', label: 'Elenco do Clube', icon: 'fa-users' },
      { id: 'news', label: 'Mídia & Notícias', icon: 'fa-newspaper' },
      { id: 'stats', label: 'Estatísticas', icon: 'fa-chart-line' },
      { id: 'season', label: 'Tabela da Liga', icon: 'fa-table-list' },
      { id: 'careerSummary', label: 'Linha do Tempo', icon: 'fa-clock-rotate-left' },
      { id: 'achievements', label: 'Conquistas', icon: 'fa-trophy' }
    ];

    const managerMenu = [
      { id: 'dashboard', label: 'Central & Calendário', icon: 'fa-calendar-days' },
      { id: 'match', label: 'Comandar Partida', icon: 'fa-futbol' },
      { id: 'squad', label: 'Elenco & Táticas', icon: 'fa-users-gear' },
      { id: 'transfers', label: 'Contratações & Verba', icon: 'fa-handshake' },
      { id: 'news', label: 'Imprensa & Entrevistas', icon: 'fa-newspaper' },
      { id: 'stats', label: 'Desempenho Geral', icon: 'fa-chart-pie' },
      { id: 'season', label: 'Classificação da Liga', icon: 'fa-table-list' },
      { id: 'careerSummary', label: 'Histórico & Carreira', icon: 'fa-clock-rotate-left' },
      { id: 'achievements', label: 'Conquistas', icon: 'fa-trophy' }
    ];

    const menu = isPlayer ? playerMenu : managerMenu;

    navList.innerHTML = menu.map(item => `
      <li class="nav-item">
        <a href="javascript:void(0)" class="nav-link ${this.currentView === item.id ? 'active' : ''}" data-view="${item.id}">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      </li>
    `).join('');

    navList.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.switchView(link.dataset.view);
      });
    });
  }

  showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    if (window.audioEngine) window.audioEngine.playNotification();

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.innerHTML = `
      <div class="toast-header">
        <strong>${title}</strong>
        <button class="toast-close">&times;</button>
      </div>
      <div class="toast-body">${message}</div>
    `;

    toastContainer.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4500);
  }

  showModal(title, bodyHtml, buttons = []) {
    const modalOverlay = document.getElementById('genericModalOverlay');
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');
    const modalFooter = document.getElementById('genericModalFooter');

    if (!modalOverlay) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFooter.innerHTML = '';

    buttons.forEach(btn => {
      const b = document.createElement('button');
      b.className = `btn ${btn.className || 'btn-secondary'}`;
      b.textContent = btn.text;
      b.addEventListener('click', () => {
        if (btn.onClick) btn.onClick();
        this.closeModal();
      });
      modalFooter.appendChild(b);
    });

    modalOverlay.classList.add('active');
  }

  closeModal() {
    const modalOverlay = document.getElementById('genericModalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  bindGlobalEvents() {
    const btnSave = document.getElementById('btnSaveCareer');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        if (this.activeCareer) {
          StorageManager.saveCareer(this.activeCareer);
          this.showToast('Sucesso', 'Carreira salva com sucesso no navegador!', 'success');
        }
      });
    }

    const btnNew = document.getElementById('btnNewCareer');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        if (confirm('Deseja iniciar uma nova carreira? O progresso não salvo será perdido.')) {
          this.activeCareer = null;
          StorageManager.clearCurrentCareer();
          this.updateHeaderAndSidebar();
          this.switchView('creation');
        }
      });
    }

    // Botão de Ajuste de Escala da UI
    const btnScale = document.getElementById('btnToggleScale');
    if (btnScale) {
      btnScale.addEventListener('click', () => {
        const nextScale = this.uiScale === 'normal' ? 'large' : this.uiScale === 'large' ? 'small' : 'normal';
        this.applyUiScale(nextScale);
        const labelMap = { small: 'Pequena (85%)', normal: 'Normal (100%)', large: 'Grande (115%)' };
        this.showToast('Escala da Interface', `Tamanho ajustado para: ${labelMap[nextScale]}`, 'info');
      });
    }
  }

  // ─── MOBILE NAVIGATION ───────────────────────────────────────────
  bindMobileEvents() {
    // Hambúrguer abre sidebar
    const btnMenu = document.getElementById('btnMobileMenu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => this.openSidebar());
    }

    // Botão X fecha sidebar
    const btnClose = document.getElementById('btnSidebarClose');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeSidebar());
    }

    // Backdrop fecha sidebar ao clicar fora
    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeSidebar());
    }

    // Botão "Menu" na bottom nav abre sidebar
    const btnMore = document.getElementById('btnMobileMore');
    if (btnMore) {
      btnMore.addEventListener('click', () => this.openSidebar());
    }

    // Botões da bottom nav navegam para as views
    document.querySelectorAll('.mobile-nav-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view) this.switchView(view);
      });
    });
  }

  openSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  _updateMobileNavActive(viewName) {
    document.querySelectorAll('.mobile-nav-btn[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
  }
}
