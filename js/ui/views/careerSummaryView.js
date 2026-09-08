// Tela de Resumo da Carreira, Linha do Tempo e Aposentadoria
class CareerSummaryView {
  static render(container, career) {
    if (!career) return;
    const isPlayer = career.type === 'player';
    const entity = isPlayer ? career.player : career.manager;

    container.innerHTML = `
      <div class="career-summary-container">
        <!-- HERO CARD DA CARREIRA -->
        <div class="dash-card career-hero-card">
          <div class="career-hero-badge">
            <i class="fa-solid fa-crown text-gold"></i>
          </div>
          <h2>Legado de ${entity.name}</h2>
          <p class="text-muted">Início em ${career.startYear} • ${career.currentYear - career.startYear + 1} Temporadas como Profissional</p>

          <div class="career-milestones-row">
            <div class="milestone-item">
              <span class="val">${isPlayer ? entity.careerStats.matches : entity.careerStats.matches}</span>
              <span class="lbl">Partidas Totais</span>
            </div>
            ${isPlayer ? `
              <div class="milestone-item">
                <span class="val text-gold">${entity.careerStats.goals}</span>
                <span class="lbl">Gols Marcados</span>
              </div>
              <div class="milestone-item">
                <span class="val">${entity.careerStats.assists}</span>
                <span class="lbl">Assistências</span>
              </div>
              <div class="milestone-item">
                <span class="val">${entity.careerStats.highestOvr}</span>
                <span class="lbl">Pico de OVR</span>
              </div>
            ` : `
              <div class="milestone-item">
                <span class="val text-gold">${entity.careerStats.wins}</span>
                <span class="lbl">Vitórias</span>
              </div>
              <div class="milestone-item">
                <span class="val">${entity.reputation}</span>
                <span class="lbl">Reputação</span>
              </div>
            `}
            <div class="milestone-item">
              <span class="val text-success">${entity.careerStats.titles.length}</span>
              <span class="lbl">Troféus</span>
            </div>
          </div>
        </div>

        <!-- LINHA DO TEMPO DAS TEMPORADAS -->
        <div class="dash-card" style="margin-top: 20px;">
          <div class="card-header">
            <h3><i class="fa-solid fa-timeline"></i> Linha do Tempo da Carreira</h3>
          </div>
          <div class="card-body">
            ${career.seasonsHistory.length === 0 ? `
              <p class="text-muted">Você ainda está disputando sua primeira temporada como profissional.</p>
            ` : `
              <div class="timeline-container">
                ${career.seasonsHistory.map((s, idx) => `
                  <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <h4>Temporada ${s.seasonName} — ${s.clubName}</h4>
                        <span class="badge ${s.isChampion ? 'badge-warning' : 'badge-dark'}">${s.finalRank}º Lugar</span>
                      </div>
                      ${s.stats ? `
                        <p class="timeline-stats">
                          Jogos: <strong>${s.stats.matches}</strong> | Gols: <strong>${s.stats.goals}</strong> | Assistências: <strong>${s.stats.assists}</strong> | Nota Média: <strong>${s.stats.averageRating}</strong>
                        </p>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- OPÇÃO DE APOSENTADORIA VOLUNTÁRIA / TÉRMINO DE CARREIRA -->
        <div class="dash-card" style="margin-top: 20px;">
          <div class="card-header">
            <h3><i class="fa-solid fa-award"></i> Pendurar as Chuteiras / Aposentadoria</h3>
          </div>
          <div class="card-body">
            <p class="text-muted">
              Ao optar pela aposentadoria, você encerra oficialmente sua carreira em campo e entra para o Hall da Fama do futebol mundial com todos os seus recordes consolidados.
            </p>
            <button class="btn btn-danger" id="btnRetireCareer"><i class="fa-solid fa-hand-peace"></i> Anunciar Aposentadoria Oficial</button>
            <button class="btn btn-outline" id="btnExportSave"><i class="fa-solid fa-download"></i> Exportar Dados da Carreira (JSON)</button>
          </div>
        </div>
      </div>
    `;

    const btnRet = document.getElementById('btnRetireCareer');
    if (btnRet) {
      btnRet.addEventListener('click', () => {
        if (confirm('Tem certeza de que deseja encerrar sua carreira? Uma cerimônia de despedida será realizada!')) {
          career.isRetired = true;
          StorageManager.saveCareer(career);
          window.uiManager.showToast('Carreira Encerrada!', 'Parabéns por sua trajetória no futebol!', 'success');
          CareerSummaryView.render(container, career);
        }
      });
    }

    const btnExp = document.getElementById('btnExportSave');
    if (btnExp) {
      btnExp.addEventListener('click', () => {
        StorageManager.exportSaveFile(career);
        window.uiManager.showToast('Exportado', 'Arquivo de save gerado com sucesso.', 'info');
      });
    }
  }
}
