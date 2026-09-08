// ============================================================================
// CENTRAL DE CARREIRA & CALENDÁRIO VIVO (DASHBOARD VIEW)
// Exibe data real, contagem de dias, treinos, eventos contextuais e partidas.
// ============================================================================

class DashboardView {
  static currentDailyActivity = null;

  static render(container, career) {
    if (!career) return;
    const isPlayer = career.type === 'player';
    const club = career.getCurrentClub();
    const p = isPlayer ? career.player : career.manager;

    // Garantir que as datas do calendário estejam inicializadas
    if (typeof CalendarEngine !== 'undefined') {
      CalendarEngine.initSeasonDates(career);
    }
    const dateFormatted = typeof CalendarEngine !== 'undefined' ? CalendarEngine.formatDate(career.currentDate) : '2026';
    const nextMatchInfo = typeof CalendarEngine !== 'undefined' ? CalendarEngine.getNextMatchInfo(career) : null;

    // Se ainda não tiver gerado a atividade para o dia atual, gera agora
    if (!this.currentDailyActivity && nextMatchInfo && !nextMatchInfo.isMatchDay) {
      this.currentDailyActivity = CalendarEngine.generateDailyActivity(career, nextMatchInfo);
    }

    const isMatchDay = nextMatchInfo ? nextMatchInfo.isMatchDay : false;
    const daysLeft = nextMatchInfo ? nextMatchInfo.daysLeft : 0;
    const oppClub = nextMatchInfo ? nextMatchInfo.oppClub : { name: 'Adversário', stars: 3.5, logoText: 'OPP', colors: ['#ef4444', '#fff'] };
    const fixture = nextMatchInfo ? nextMatchInfo.fixture : null;
    const isHome = fixture ? fixture.homeClubId === club.id : true;
    const coach = career.coach || { name: 'Comandante Técnico', trust: 70, style: 'Equilibrado' };

    container.innerHTML = `
      <div class="dashboard-grid">
        <!-- 1. BANNER DO CALENDÁRIO & STATUS EM TEMPO REAL -->
        <div class="dash-card calendar-hero-card full-span">
          <div class="calendar-hero-content">
            <div class="calendar-date-display">
              <div class="calendar-icon-box"><i class="fa-solid fa-calendar-day"></i></div>
              <div>
                <span class="calendar-season-sub">${career.seasonName} • Rodada ${career.currentWeek}/38</span>
                <h1 class="calendar-date-title">${dateFormatted}</h1>
              </div>
            </div>

            <div class="calendar-status-badges">
              <div class="stat-pill-hero">
                <span class="lbl"><i class="fa-solid fa-user-tie"></i> Técnico: ${coach.name}</span>
                <span class="val text-gold">Confiança: ${coach.trust}%</span>
              </div>
              <div class="stat-pill-hero">
                <span class="lbl"><i class="fa-solid fa-bolt"></i> Condicionamento</span>
                <span class="val ${isPlayer && p.energy < 40 ? 'text-danger' : 'text-success'}">${isPlayer ? p.fitness : 100}%</span>
              </div>
              <div class="stat-pill-hero">
                <span class="lbl"><i class="fa-solid fa-heart"></i> Moral</span>
                <span class="val text-info">${p.morale || 75}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. CARD DA PRÓXIMA PARTIDA & CONTAGEM REGRESSIVA -->
        <div class="dash-card match-preview-card full-span">
          <div class="card-header">
            <div>
              <span class="competition-tag"><i class="fa-solid fa-trophy"></i> ${fixture ? fixture.competition : club.league}</span>
              <h2 class="card-title">
                ${isMatchDay ? '⚽ HOJE É DIA DE JOGO!' : `Próximo Confronto — ${nextMatchInfo ? nextMatchInfo.matchDateFormatted : ''}`}
              </h2>
            </div>
            <div class="match-days-badge ${isMatchDay ? 'badge-match-today' : 'badge-match-wait'}">
              <i class="fa-solid ${isMatchDay ? 'fa-fire' : 'fa-clock'}"></i>
              ${isMatchDay ? 'DIA DE JOGO' : `Faltam ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`}
            </div>
          </div>

          <div class="match-vs-banner">
            <div class="team-side ${isHome ? 'is-user' : ''}">
              <div class="team-badge-large" style="background-color: ${isHome ? club.colors[0] : oppClub.colors[0]}; color: ${isHome ? (club.colors[1] || '#fff') : (oppClub.colors[1] || '#fff')}">
                ${isHome ? club.logoText : oppClub.logoText}
              </div>
              <div class="team-meta">
                <span class="team-name">${isHome ? club.name : oppClub.name}</span>
                <span class="team-ovr-badge">OVR ${isHome ? club.ovr : oppClub.ovr} (★ ${isHome ? club.stars.toFixed(1) : oppClub.stars.toFixed(1)})</span>
              </div>
            </div>

            <div class="match-vs-center">
              <span class="vs-text">VS</span>
              <div class="match-actions-inline">
                ${isMatchDay ? `
                  <button class="btn btn-primary btn-lg btn-pulse" id="btnPlayMatchNow">
                    <i class="fa-solid fa-futbol"></i> ENTRAR EM CAMPO (JOGAR)
                  </button>
                ` : `
                  <button class="btn btn-primary btn-md" id="btnAdvanceOneDay">
                    <i class="fa-solid fa-calendar-plus"></i> Avançar 1 Dia
                  </button>
                  <button class="btn btn-secondary btn-md" id="btnAdvanceToMatch">
                    <i class="fa-solid fa-forward-fast"></i> Avançar até o Jogo
                  </button>
                `}
              </div>
            </div>

            <div class="team-side ${!isHome ? 'is-user' : ''}">
              <div class="team-badge-large" style="background-color: ${!isHome ? club.colors[0] : oppClub.colors[0]}; color: ${!isHome ? (club.colors[1] || '#fff') : (oppClub.colors[1] || '#fff')}">
                ${!isHome ? club.logoText : oppClub.logoText}
              </div>
              <div class="team-meta">
                <span class="team-name">${!isHome ? club.name : oppClub.name}</span>
                <span class="team-ovr-badge">OVR ${!isHome ? club.ovr : oppClub.ovr} (★ ${!isHome ? club.stars.toFixed(1) : oppClub.stars.toFixed(1)})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. ACONTECIMENTO DO DIA (TREINO / VIDA / TORCIDA / EVENTO COM ILUSTRAÇÃO) -->
        ${!isMatchDay && this.currentDailyActivity ? `
          <div class="dash-card full-span daily-activity-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-bell"></i> Programação do Dia no Calendário</h3>
              <span class="badge badge-info">${this.currentDailyActivity.title}</span>
            </div>
            <div class="card-body">
              <div class="daily-event-layout">
                <!-- ILUSTRAÇÃO CONTEXTUAL PROCEDURAL -->
                <div class="daily-event-visual">
                  ${window.visualEngine ? window.visualEngine.render(this.currentDailyActivity.visualType || 'extra_training') : ''}
                </div>

                <div class="daily-event-info">
                  <h4>${this.currentDailyActivity.title}</h4>
                  <p class="daily-event-desc">${this.currentDailyActivity.description}</p>

                  <div class="daily-event-options" id="dailyEventOptionsList">
                    ${this.currentDailyActivity.options ? this.currentDailyActivity.options.map((opt, idx) => `
                      <button class="btn btn-outline btn-block daily-opt-btn" data-choice-idx="${idx}">
                        <i class="fa-solid fa-chevron-right"></i> ${opt.text}
                      </button>
                    `).join('') : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 4. RESUMO DOS ATRIBUTOS PRINCIPAIS & FORMA -->
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-chart-line"></i> Desempenho & Atributos-Chave</h3>
            <button class="btn btn-sm btn-outline" id="btnGoToAttributes">Ver Todos</button>
          </div>
          <div class="card-body">
            ${isPlayer ? `
              <div class="attribute-bars-compact">
                <div class="attr-row-compact">
                  <span>Finalização</span>
                  <div class="progress-bar"><div class="progress-fill" style="width: ${p.attributes.finishing || 65}%;"></div></div>
                  <strong>${p.attributes.finishing || 65}</strong>
                </div>
                <div class="attr-row-compact">
                  <span>Passe Curto</span>
                  <div class="progress-bar"><div class="progress-fill" style="width: ${p.attributes.shortPassing || 65}%;"></div></div>
                  <strong>${p.attributes.shortPassing || 65}</strong>
                </div>
                <div class="attr-row-compact">
                  <span>Drible & Agilidade</span>
                  <div class="progress-bar"><div class="progress-fill" style="width: ${p.attributes.dribbling || 65}%;"></div></div>
                  <strong>${p.attributes.dribbling || 65}</strong>
                </div>
                <div class="attr-row-compact">
                  <span>Ritmo & Velocidade</span>
                  <div class="progress-bar"><div class="progress-fill" style="width: ${p.attributes.pace || 65}%;"></div></div>
                  <strong>${p.attributes.pace || 65}</strong>
                </div>
              </div>
            ` : `
              <p>Gerenciando a prancheta tática do ${club.name}.</p>
            `}
          </div>
        </div>

        <!-- 5. TABELA DA LIGA & CLASSIFICAÇÃO RÁPIDA -->
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-table-list"></i> Tabela — ${club.league}</h3>
            <button class="btn btn-sm btn-outline" id="btnGoToSeason">Tabela Completa</button>
          </div>
          <div class="card-body">
            <div class="mini-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Clube</th>
                    <th>Pts</th>
                    <th>J</th>
                    <th>SG</th>
                  </tr>
                </thead>
                <tbody>
                  ${career.leagueTable.slice(0, 5).map((row, idx) => `
                    <tr class="${row.clubId === club.id ? 'row-user-club' : ''}">
                      <td>${idx + 1}º</td>
                      <td><strong>${row.clubName}</strong></td>
                      <td><strong>${row.points}</strong></td>
                      <td>${row.played}</td>
                      <td>${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(career);
  }

  static bindEvents(career) {
    const btnPlay = document.getElementById('btnPlayMatchNow');
    const btnAdvance = document.getElementById('btnAdvanceOneDay');
    const btnToMatch = document.getElementById('btnAdvanceToMatch');
    const btnGoAttrs = document.getElementById('btnGoToAttributes');
    const btnGoSeason = document.getElementById('btnGoToSeason');

    if (btnPlay) {
      btnPlay.onclick = () => {
        window.uiManager.switchView('match');
      };
    }

    if (btnGoAttrs) {
      btnGoAttrs.onclick = () => {
        window.uiManager.switchView('attributes');
      };
    }

    if (btnGoSeason) {
      btnGoSeason.onclick = () => {
        window.uiManager.switchView('season');
      };
    }

    if (btnAdvance) {
      btnAdvance.onclick = () => {
        const eventResult = CalendarEngine.advanceOneDay(career);
        DashboardView.currentDailyActivity = eventResult && eventResult.type !== 'match_day' ? eventResult : null;
        StorageManager.saveCareer(career);
        window.uiManager.updateHeaderAndSidebar();
        DashboardView.render(document.getElementById('mainContentArea'), career);

        if (window.audioEngine) window.audioEngine.playDecisionClick();
        if (eventResult && eventResult.type === 'match_day') {
          window.uiManager.showToast('⚽ Dia de Jogo!', 'Hoje é dia de partida oficial! Entre no gramado.', 'info');
        }
      };
    }

    if (btnToMatch) {
      btnToMatch.onclick = () => {
        let loopLimit = 14;
        while (loopLimit > 0) {
          const nextInfo = CalendarEngine.getNextMatchInfo(career);
          if (nextInfo && nextInfo.isMatchDay) break;
          CalendarEngine.advanceOneDay(career);
          loopLimit--;
        }
        DashboardView.currentDailyActivity = null;
        StorageManager.saveCareer(career);
        window.uiManager.updateHeaderAndSidebar();
        DashboardView.render(document.getElementById('mainContentArea'), career);
        if (window.audioEngine) window.audioEngine.playWhistle('short');
        window.uiManager.showToast('⚽ Dia de Jogo Chegou!', 'Chegamos ao dia da partida!', 'info');
      };
    }

    // Associar cliques a cada opção diária
    const dailyOpts = document.querySelectorAll('.daily-opt-btn');
    dailyOpts.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-choice-idx'));
        DashboardView.handleDailyChoice(idx);
      };
    });
  }

  static handleDailyChoice(choiceIndex) {
    const career = window.uiManager ? window.uiManager.activeCareer : null;
    if (!career || !DashboardView.currentDailyActivity || !DashboardView.currentDailyActivity.options) return;

    const choice = DashboardView.currentDailyActivity.options[choiceIndex];
    if (choice) {
      let res = { success: true, msg: 'Opção registrada com sucesso.' };
      if (typeof choice.action === 'function') {
        try {
          const actionRes = choice.action(career);
          if (actionRes) res = actionRes;
        } catch (err) {
          console.error('Erro na ação da escolha:', err);
        }
      }

      if (career.player) {
        career.player.updateOverall();
      }

      StorageManager.saveCareer(career);

      if (window.audioEngine) {
        if (res.success !== false) window.audioEngine.playLevelUp();
        else window.audioEngine.playBoo();
      }

      window.uiManager.showToast(DashboardView.currentDailyActivity.title, res.msg || 'Consequência aplicada com sucesso.', res.success !== false ? 'success' : 'warning');
      DashboardView.currentDailyActivity = null;
      window.uiManager.updateHeaderAndSidebar();
      DashboardView.render(document.getElementById('mainContentArea'), career);
    }
  }
}

// Tornar explicitamente global no objeto window
window.DashboardView = DashboardView;
