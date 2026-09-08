// Tela Interativa de Partidas com Decisões Situacionais (🟢/🟡/🔴/🔒), Justificativas e Áudio
class MatchView {
  static render(container, career, params = {}) {
    if (!career) return;
    const club = career.getCurrentClub();

    let fixture = params.fixture || career.fixtures.find(f => !f.played);
    if (!fixture) {
      container.innerHTML = `
        <div class="dash-card">
          <h2>Todas as partidas da temporada foram concluídas!</h2>
          <button class="btn btn-primary" onclick="window.uiManager.switchView('season')">Ver Tabela e Encerrar Temporada</button>
        </div>
      `;
      return;
    }

    const match = new MatchEngine(career, fixture);
    this.activeMatch = match;
    this.simInterval = null;

    const isHome = match.isHome;
    const oppClub = match.oppClub;
    const audio = window.audioEngine;

    container.innerHTML = `
      <div class="match-screen-container">
        <!-- BARRA DE CLIMA & CONTROLES DE ÁUDIO -->
        <div class="match-top-toolbar">
          <div class="match-context-badges">
            <span class="badge badge-info"><i class="fa-solid fa-cloud-sun"></i> ${match.matchContext.weather}</span>
            <span class="badge ${match.isHome ? 'badge-success' : 'badge-warning'}">
              <i class="fa-solid fa-users"></i> ${match.isHome ? 'Mando de Campo (Casa)' : 'Ambiente Hostil (Visitante)'}
            </span>
            <span class="badge badge-dark">Força Rival: ★ ${oppClub.stars.toFixed(1)}</span>
          </div>

          <div class="audio-controls-toolbar">
            <button class="btn btn-sm btn-outline" id="btnToggleMute" title="Ativar/Desativar Sons">
              <i class="fa-solid ${audio && audio.isMuted ? 'fa-volume-xmark text-danger' : 'fa-volume-high text-success'}"></i>
              <span id="muteLabel">${audio && audio.isMuted ? 'Mudo' : 'Som Ativo'}</span>
            </button>
            <button class="btn btn-sm btn-outline" id="btnOpenAudioSettings">
              <i class="fa-solid fa-sliders"></i> Volumes
            </button>
          </div>
        </div>

        <!-- PLACAR ELETRÔNICO AO VIVO -->
        <div class="scoreboard-hero">
          <div class="score-team-panel ${isHome ? 'home-team' : ''}">
            <div class="score-badge" style="background-color: ${isHome ? club.colors[0] : oppClub.colors[0]}; color: ${isHome ? (club.colors[1] || '#fff') : (oppClub.colors[1] || '#fff')}">
              ${isHome ? club.logoText : oppClub.logoText}
            </div>
            <div class="score-team-title">${isHome ? club.name : oppClub.name}</div>
            <div class="score-points" id="scoreHome">0</div>
          </div>

          <div class="score-center-panel">
            <div class="match-time-badge" id="matchClock">0'</div>
            <div class="match-competition-name">${fixture.competition} • Rodada ${career.currentWeek}</div>
            <div class="match-sim-controls" id="matchControls">
              <button class="btn btn-primary btn-pulse" id="btnStartMatch"><i class="fa-solid fa-play"></i> Rolar a Bola</button>
              <button class="btn btn-secondary" id="btnSpeedUp" style="display: none;"><i class="fa-solid fa-forward"></i> Avançar Rápido</button>
            </div>
          </div>

          <div class="score-team-panel ${!isHome ? 'away-team' : ''}">
            <div class="score-points" id="scoreAway">0</div>
            <div class="score-team-title">${!isHome ? club.name : oppClub.name}</div>
            <div class="score-badge" style="background-color: ${!isHome ? club.colors[0] : oppClub.colors[0]}; color: ${!isHome ? (club.colors[1] || '#fff') : (oppClub.colors[1] || '#fff')}">
              ${!isHome ? club.logoText : oppClub.logoText}
            </div>
          </div>
        </div>

        <!-- MODAL INTERATIVO DE DECISÃO SITUACIONAL (🟢 / 🟡 / 🔴 / 🔒) -->
        <div class="decision-modal-overlay" id="decisionOverlay" style="display: none;">
          <div class="decision-modal-card">
            <div class="decision-header">
              <span class="decision-tag"><i class="fa-solid fa-crosshairs"></i> LANCE SITUACIONAL • <span id="decisionZone">Entrada da Área</span></span>
              <h3 id="decisionTitle">Lance de Perigo!</h3>
              <p id="decisionDesc">Você recebe a bola com liberdade.</p>
            </div>

            <!-- ILUSTRAÇÃO CONTEXTUAL DINÂMICA (VISUAL ENGINE) -->
            <div class="decision-visual-box" id="decisionVisualBox">
              <!-- SVG tático injetado via VisualEngine -->
            </div>

            <div class="decision-choices-list" id="decisionChoices">
              <!-- Gerado dinamicamente -->
            </div>
          </div>
        </div>

        <!-- FEED DE LANCES E ESTATÍSTICAS DO JOGADOR -->
        <div class="match-live-grid">
          <div class="dash-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-microphone-lines"></i> Transmissão Minuto a Minuto & Narração</h3>
            </div>
            <div class="card-body">
              <div class="match-feed-box" id="matchFeed">
                <div class="feed-event feed-system">
                  <span>Os times entram no gramado. Concentração máxima para o apito inicial!</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dash-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-chart-simple"></i> Desempenho & Avaliação do Técnico</h3>
            </div>
            <div class="card-body">
              ${career.type === 'player' ? `
                <div class="player-live-stats-box">
                  <div class="live-rating-hero">
                    <span class="lbl">Nota do Jogador</span>
                    <strong class="rating-num" id="livePlayerRating">6.0</strong>
                  </div>

                  <!-- AVALIAÇÃO DO TREINADOR EM TEMPO REAL -->
                  <div class="coach-live-eval-box">
                    <div class="coach-eval-header">
                      <span><i class="fa-solid fa-user-tie"></i> <strong>${match.coach.name}</strong></span>
                      <span class="badge ${match.coachEvaluation.subRisk > 50 ? 'badge-danger' : 'badge-success'}" id="liveSubRiskBadge">
                        Risco Substituição: <strong id="liveSubRiskVal">0%</strong>
                      </span>
                    </div>
                    <div class="progress-bar sub-risk-bar">
                      <div class="progress-fill fill-danger" id="liveSubRiskBar" style="width: 0%;"></div>
                    </div>
                    <div class="coach-eval-feedback" id="liveCoachFeedback">
                      <i class="fa-solid fa-comment-dots"></i> Concentrado e cumprindo as orientações táticas.
                    </div>
                  </div>

                  <div class="live-stats-list">
                    <div class="live-stat-item"><span>Gols Marcados:</span> <strong id="liveGoals">0</strong></div>
                    <div class="live-stat-item"><span>Assistências:</span> <strong id="liveAssists">0</strong></div>
                    <div class="live-stat-item"><span>Finalizações (No Alvo):</span> <strong><span id="liveShots">0</span> (<span id="liveShotsTarget">0</span>)</strong></div>
                    <div class="live-stat-item"><span>Passes Certos:</span> <strong id="livePasses">0</strong></div>
                    <div class="live-stat-item"><span>Dribles Certos:</span> <strong id="liveDribbles">0</strong></div>
                    <div class="live-stat-item"><span>Desarmes / Defesas:</span> <strong id="liveTackles">0</strong></div>
                  </div>
                </div>
              ` : `
                <div class="manager-live-controls">
                  <h4>Postura Tática da Equipe</h4>
                  <div class="tactical-buttons-group">
                    <button class="btn btn-outline active" onclick="MatchView.setPosture('Equilibrado', this)">Equilibrado</button>
                    <button class="btn btn-outline" onclick="MatchView.setPosture('Ofensivo', this)">Ofensivo (Pressão)</button>
                    <button class="btn btn-outline" onclick="MatchView.setPosture('Defensivo', this)">Retranca / Contra-ataque</button>
                  </div>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- PAINEL PÓS-JOGO -->
        <div class="post-match-modal" id="postMatchPanel" style="display: none;">
          <div class="dash-card">
            <div class="card-header">
              <h2><i class="fa-solid fa-flag-checkered"></i> Apito Final — Resumo do Confronto</h2>
            </div>
            <div class="card-body">
              <div class="post-match-score" id="postMatchScoreSummary"></div>
              <div class="post-match-details" id="postMatchDetails"></div>
              <div class="form-actions" style="margin-top: 20px;">
                <button class="btn btn-primary btn-lg" id="btnContinueAfterMatch">
                  <i class="fa-solid fa-arrow-right"></i> Avançar para Próxima Semana
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindAudioToolbar();
    this.bindMatchControls(match, career);
  }

  static bindAudioToolbar() {
    const audio = window.audioEngine;
    const btnMute = document.getElementById('btnToggleMute');
    const muteLbl = document.getElementById('muteLabel');
    const btnSettings = document.getElementById('btnOpenAudioSettings');

    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnMute.querySelector('i').className = `fa-solid ${isMuted ? 'fa-volume-xmark text-danger' : 'fa-volume-high text-success'}`;
        if (muteLbl) muteLbl.textContent = isMuted ? 'Mudo' : 'Som Ativo';
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        MatchView.showAudioSettingsModal();
      });
    }
  }

  static showAudioSettingsModal() {
    const audio = window.audioEngine;
    const html = `
      <div class="audio-modal-form">
        <div class="form-group">
          <label>Volume Geral (Master): <span id="valMaster">${Math.round(audio.masterVolume * 100)}%</span></label>
          <input type="range" class="form-control" id="sliderMaster" min="0" max="1" step="0.05" value="${audio.masterVolume}" />
        </div>
        <div class="form-group">
          <label>Efeitos Sonoros (Chutes, Apitos, Trave, Gols): <span id="valSfx">${Math.round(audio.sfxVolume * 100)}%</span></label>
          <input type="range" class="form-control" id="sliderSfx" min="0" max="1" step="0.05" value="${audio.sfxVolume}" />
        </div>
        <div class="form-group">
          <label>Ambiente de Estádio & Torcida: <span id="valCrowd">${Math.round(audio.crowdVolume * 100)}%</span></label>
          <input type="range" class="form-control" id="sliderCrowd" min="0" max="1" step="0.05" value="${audio.crowdVolume}" />
        </div>
        <div class="form-group">
          <label>Eventos & Notificações: <span id="valEvents">${Math.round(audio.eventsVolume * 100)}%</span></label>
          <input type="range" class="form-control" id="sliderEvents" min="0" max="1" step="0.05" value="${audio.eventsVolume}" />
        </div>
        <div style="margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-outline" id="btnTestWhistle"><i class="fa-solid fa-bullhorn"></i> Testar Apito</button>
          <button class="btn btn-sm btn-outline" id="btnTestKick"><i class="fa-solid fa-futbol"></i> Testar Chute</button>
          <button class="btn btn-sm btn-outline" id="btnTestCheer"><i class="fa-solid fa-hands-clapping"></i> Testar Torcida</button>
        </div>
      </div>
    `;

    window.uiManager.showModal('Configurações de Áudio & Volume', html, [
      { text: 'Concluir', className: 'btn-primary' }
    ]);

    const sMaster = document.getElementById('sliderMaster');
    const sSfx = document.getElementById('sliderSfx');
    const sCrowd = document.getElementById('sliderCrowd');
    const sEvents = document.getElementById('sliderEvents');

    if (sMaster) {
      sMaster.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.setMasterVolume(val);
        document.getElementById('valMaster').textContent = `${Math.round(val * 100)}%`;
      });
    }
    if (sSfx) {
      sSfx.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.setSfxVolume(val);
        document.getElementById('valSfx').textContent = `${Math.round(val * 100)}%`;
      });
    }
    if (sCrowd) {
      sCrowd.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.setCrowdVolume(val);
        document.getElementById('valCrowd').textContent = `${Math.round(val * 100)}%`;
      });
    }
    if (sEvents) {
      sEvents.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.setEventsVolume(val);
        document.getElementById('valEvents').textContent = `${Math.round(val * 100)}%`;
      });
    }

    const btnTW = document.getElementById('btnTestWhistle');
    const btnTK = document.getElementById('btnTestKick');
    const btnTC = document.getElementById('btnTestCheer');

    if (btnTW) btnTW.onclick = () => audio.playWhistle('foul');
    if (btnTK) btnTK.onclick = () => { audio.playKick('strong'); setTimeout(() => audio.playNet(), 100); };
    if (btnTC) btnTC.onclick = () => audio.playCheer();
  }

  static bindMatchControls(match, career) {
    const btnStart = document.getElementById('btnStartMatch');
    const btnSpeed = document.getElementById('btnSpeedUp');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        btnStart.style.display = 'none';
        if (btnSpeed) btnSpeed.style.display = 'inline-block';
        
        if (window.audioEngine) {
          window.audioEngine.playWhistle('kickoff');
          window.audioEngine.startStadiumAmbience();
        }

        MatchView.runMatchLoop(match, career, 1000);
      });
    }

    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => {
        clearInterval(MatchView.simInterval);
        MatchView.runMatchLoop(match, career, 200);
      });
    }
  }

  static runMatchLoop(match, career, intervalMs = 800) {
    MatchView.simInterval = setInterval(() => {
      if (match.isFinished) {
        clearInterval(MatchView.simInterval);
        MatchView.showPostMatchSummary(match, career);
        return;
      }

      if (match.isPausedForDecision) {
        clearInterval(MatchView.simInterval);
        MatchView.showDecisionModal(match, career);
        return;
      }

      match.tickSimulation(5);
      MatchView.updateMatchUI(match);
    }, intervalMs);
  }

  static updateMatchUI(match) {
    const clock = document.getElementById('matchClock');
    const sHome = document.getElementById('scoreHome');
    const sAway = document.getElementById('scoreAway');
    const feed = document.getElementById('matchFeed');

    if (clock) clock.textContent = `${match.minute}'`;
    if (sHome) sHome.textContent = match.homeScore;
    if (sAway) sAway.textContent = match.awayScore;

    if (feed && match.eventsLog.length > 0) {
      feed.innerHTML = match.eventsLog.map(ev => `
        <div class="feed-event ${ev.type === 'goal' || ev.type === 'assist' ? 'feed-goal' : ev.type === 'danger' ? 'feed-danger' : 'feed-normal'}">
          <span>${ev.text}</span>
        </div>
      `).join('');
    }

    if (match.career.type === 'player') {
      const liveRating = document.getElementById('livePlayerRating');
      const liveGoals = document.getElementById('liveGoals');
      const liveAssists = document.getElementById('liveAssists');
      const liveShots = document.getElementById('liveShots');
      const liveShotsTarget = document.getElementById('liveShotsTarget');
      const livePasses = document.getElementById('livePasses');
      const liveDribbles = document.getElementById('liveDribbles');
      const liveTackles = document.getElementById('liveTackles');

      const liveSubRiskVal = document.getElementById('liveSubRiskVal');
      const liveSubRiskBar = document.getElementById('liveSubRiskBar');
      const liveCoachFeedback = document.getElementById('liveCoachFeedback');
      const liveSubRiskBadge = document.getElementById('liveSubRiskBadge');

      if (liveRating) liveRating.textContent = match.playerMatchStats.rating.toFixed(1);
      if (liveGoals) liveGoals.textContent = match.playerMatchStats.goals;
      if (liveAssists) liveAssists.textContent = match.playerMatchStats.assists;
      if (liveShots) liveShots.textContent = match.playerMatchStats.shots;
      if (liveShotsTarget) liveShotsTarget.textContent = match.playerMatchStats.shotsOnTarget;
      if (livePasses) livePasses.textContent = match.playerMatchStats.passesCompleted;
      if (liveDribbles) liveDribbles.textContent = match.playerMatchStats.dribblesSuccess;
      if (liveTackles) liveTackles.textContent = match.playerMatchStats.tackles + match.playerMatchStats.saves;

      if (liveSubRiskVal) liveSubRiskVal.textContent = `${match.coachEvaluation.subRisk}%`;
      if (liveSubRiskBar) liveSubRiskBar.style.width = `${match.coachEvaluation.subRisk}%`;
      if (liveCoachFeedback) liveCoachFeedback.innerHTML = `<i class="fa-solid fa-comment-dots"></i> ${match.coachEvaluation.feedback}`;
      if (liveSubRiskBadge) {
        liveSubRiskBadge.className = `badge ${match.coachEvaluation.subRisk > 50 ? 'badge-danger' : 'badge-success'}`;
      }
    }
  }

  static showDecisionModal(match, career) {
    const overlay = document.getElementById('decisionOverlay');
    const title = document.getElementById('decisionTitle');
    const desc = document.getElementById('decisionDesc');
    const zone = document.getElementById('decisionZone');
    const visualBox = document.getElementById('decisionVisualBox');
    const choicesList = document.getElementById('decisionChoices');

    if (!overlay || !match.currentDecision) return;

    title.textContent = `[${match.currentDecision.minute}'] ${match.currentDecision.title}`;
    desc.textContent = match.currentDecision.description;
    if (zone && match.currentDecision.zone) zone.textContent = match.currentDecision.zone;

    // Renderizar ilustração contextual dinâmica
    if (visualBox && window.visualEngine) {
      const vType = match.currentDecision.visualType || 'holding_midfield';
      const vOpts = match.currentDecision.visualOptions || {};
      visualBox.innerHTML = window.visualEngine.render(vType, vOpts);
    }

    choicesList.innerHTML = match.currentDecision.options.map((opt, idx) => {
      if (opt.isBlocked) {
        return `
          <div class="btn-choice-card choice-blocked" title="${opt.reason}">
            <div class="choice-main-info">
              <div class="choice-title-text"><i class="fa-solid fa-lock"></i> ${opt.title}</div>
              <div class="choice-reason-subtext">${opt.reason}</div>
            </div>
            <span class="badge badge-dark">Bloqueada</span>
          </div>
        `;
      }

      let badgeClass = 'badge-success';
      if (opt.riskLevel === 'yellow') badgeClass = 'badge-warning';
      else if (opt.riskLevel === 'red') badgeClass = 'badge-danger';

      return `
        <button class="btn btn-choice-card choice-${opt.riskLevel}" data-choice-idx="${idx}">
          <div class="choice-main-info">
            <div class="choice-title-text">${opt.title}</div>
            <div class="choice-reason-subtext">${opt.reason}</div>
          </div>
          <span class="badge ${badgeClass}">${opt.riskLabel}</span>
        </button>
      `;
    }).join('');

    // Associar cliques a cada card de escolha
    choicesList.querySelectorAll('.btn-choice-card').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-choice-idx'));
        if (!isNaN(idx)) {
          MatchView.handleUserChoice(idx);
        }
      };
    });

    overlay.style.display = 'flex';
  }

  static handleUserChoice(choiceIndex) {
    const overlay = document.getElementById('decisionOverlay');
    const visualBox = document.getElementById('decisionVisualBox');
    const choicesList = document.getElementById('decisionChoices');
    const desc = document.getElementById('decisionDesc');

    // Executar a escolha no motor
    MatchView.activeMatch.executeChoice(choiceIndex);
    MatchView.updateMatchUI(MatchView.activeMatch);

    const outcome = MatchView.activeMatch.lastOutcome;

    // Se tiver desfecho e motor visual, exibir a transição do resultado
    if (outcome && visualBox && window.visualEngine) {
      visualBox.innerHTML = window.visualEngine.render(outcome.visualType);
      if (desc) desc.textContent = outcome.narrative;
      if (choicesList) {
        choicesList.innerHTML = `
          <div class="outcome-resolution-banner">
            <span class="badge ${outcome.logType === 'goal' || outcome.logType === 'assist' ? 'badge-success' : outcome.logType === 'danger' ? 'badge-danger' : 'badge-info'}">
              ${outcome.logType === 'goal' ? 'GOL MARCADO! ⚽' : outcome.logType === 'assist' ? 'ASSISTÊNCIA! 🎯' : outcome.logType === 'opp_goal' ? 'GOL ADVERSÁRIO' : 'LANCE FINALIZADO'}
            </span>
            <button class="btn btn-primary btn-sm" id="btnResumeMatchNow" style="margin-top: 12px; display: inline-block;">
              <i class="fa-solid fa-play"></i> Continuar Partida
            </button>
          </div>
        `;
      }

      let resumed = false;
      const resume = () => {
        if (resumed) return;
        resumed = true;
        if (overlay) overlay.style.display = 'none';
        MatchView.runMatchLoop(MatchView.activeMatch, MatchView.activeMatch.career, 800);
      };

      const btnResume = document.getElementById('btnResumeMatchNow');
      if (btnResume) btnResume.onclick = resume;

      setTimeout(resume, 1400);
    } else {
      if (overlay) overlay.style.display = 'none';
      MatchView.runMatchLoop(MatchView.activeMatch, MatchView.activeMatch.career, 800);
    }
  }

  static showPostMatchSummary(match, career) {
    const panel = document.getElementById('postMatchPanel');
    const scoreSummary = document.getElementById('postMatchScoreSummary');
    const details = document.getElementById('postMatchDetails');
    const btnContinue = document.getElementById('btnContinueAfterMatch');

    if (!panel) return;

    const userClub = match.userClub;
    const oppClub = match.oppClub;
    const userGoals = match.isHome ? match.homeScore : match.awayScore;
    const oppGoals = match.isHome ? match.awayScore : match.homeScore;
    const resultText = userGoals > oppGoals ? 'VITÓRIA IMPORTANTE! 🎉' : userGoals === oppGoals ? 'EMPATE DISPUTADO! ⚖️' : 'DERROTA DOLOROSA... 💔';

    scoreSummary.innerHTML = `
      <div class="post-result-badge">${resultText}</div>
      <h3>${userClub.name} ${userGoals} x ${oppGoals} ${oppClub.name}</h3>
    `;

    if (career.type === 'player') {
      const pStats = match.playerMatchStats;
      details.innerHTML = `
        <div class="post-stats-grid">
          <div class="post-stat-box"><span>Nota do Jogador:</span> <strong>${pStats.rating.toFixed(1)}</strong></div>
          <div class="post-stat-box"><span>Gols Marcados:</span> <strong>${pStats.goals}</strong></div>
          <div class="post-stat-box"><span>Assistências:</span> <strong>${pStats.assists}</strong></div>
          <div class="post-stat-box"><span>Finalizações (No Alvo):</span> <strong>${pStats.shots} (${pStats.shotsOnTarget})</strong></div>
          <div class="post-stat-box"><span>Passes Certos:</span> <strong>${pStats.passesCompleted}</strong></div>
          <div class="post-stat-box"><span>Dribles Certos:</span> <strong>${pStats.dribblesSuccess}</strong></div>
          <div class="post-stat-box"><span>Minutos Jogados:</span> <strong>${pStats.minutes}'</strong></div>
        </div>
      `;
    }

    panel.style.display = 'block';

    if (btnContinue) {
      btnContinue.onclick = () => {
        career.currentWeek += 1;
        if (career.player) career.player.recoverWeekly();

        if (career.currentWeek > 38) {
          const summary = SeasonEngine.finishSeason(career);
          StorageManager.saveCareer(career);
          window.uiManager.showToast('Fim de Temporada!', `A temporada ${summary.seasonName} foi encerrada. Veja o balanço anual!`, 'success');
          window.uiManager.switchView('season');
          return;
        }

        // Se houver evento pós-jogo especial, exibe com ilustração
        if (match.postMatchEvent) {
          MatchView.showNarrativeEvent(match.postMatchEvent, career);
          return;
        }

        StorageManager.saveCareer(career);
        window.uiManager.updateHeaderAndSidebar();
        window.uiManager.switchView('dashboard');
      };
    }
  }

  static showNarrativeEvent(eventData, career) {
    if (window.audioEngine) window.audioEngine.playNotification();

    const visualSvg = window.visualEngine ? window.visualEngine.render(eventData.visualType || 'coach_talk') : '';

    const htmlContent = `
      <div class="event-modal-visual-wrap">
        ${visualSvg}
        <p style="font-size: 1.05rem; line-height: 1.6; margin-top: 15px;">${eventData.description}</p>
      </div>
    `;

    const buttons = eventData.options ? eventData.options.map(choice => ({
      text: choice.text,
      className: 'btn-choice-modal',
      onClick: () => {
        if (typeof choice.action === 'function') {
          try {
            const res = choice.action(career);
            if (res && res.msg) {
              window.uiManager.showToast(eventData.title, res.msg, res.success !== false ? 'success' : 'warning');
            }
          } catch (e) {
            console.error('Erro na ação do evento narrativo:', e);
          }
        }
        if (career.player) career.player.updateOverall();
        StorageManager.saveCareer(career);
        window.uiManager.updateHeaderAndSidebar();
        window.uiManager.switchView('dashboard');
      }
    })) : [
      {
        text: 'Continuar',
        className: 'btn-primary',
        onClick: () => {
          StorageManager.saveCareer(career);
          window.uiManager.updateHeaderAndSidebar();
          window.uiManager.switchView('dashboard');
        }
      }
    ];

    window.uiManager.showModal(eventData.title, htmlContent, buttons);
  }

  static setPosture(posture, btn) {
    if (MatchView.activeMatch) {
      MatchView.activeMatch.tacticalPosture = posture;
      btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }
}

// Tornar explicitamente global no objeto window
window.MatchView = MatchView;
