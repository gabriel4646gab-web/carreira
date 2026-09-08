// Tela de Estatísticas Detalhadas e Recordes da Carreira
class StatsView {
  static render(container, career) {
    if (!career) return;
    const isPlayer = career.type === 'player';

    if (isPlayer) {
      const p = career.player;
      const s = p.currentSeasonStats;
      const c = p.careerStats;

      const avgRating = s.matches > 0 ? (s.ratingSum / s.matches).toFixed(2) : '0.00';

      container.innerHTML = `
        <div class="stats-overview-grid">
          <!-- CARD DA TEMPORADA ATUAL -->
          <div class="dash-card">
            <div class="card-header">
              <h2><i class="fa-solid fa-chart-line"></i> Temporada Atual (${career.seasonName})</h2>
            </div>
            <div class="card-body">
              <div class="stats-grid-cards">
                <div class="stat-box-large">
                  <span class="num">${s.matches}</span>
                  <span class="lbl">Partidas Disputadas</span>
                </div>
                <div class="stat-box-large highlight">
                  <span class="num">${s.goals}</span>
                  <span class="lbl">Gols Marcados</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${s.assists}</span>
                  <span class="lbl">Assistências</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${avgRating}</span>
                  <span class="lbl">Nota Média</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${s.minutesPlayed}'</span>
                  <span class="lbl">Minutos em Campo</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${s.yellowCards}</span>
                  <span class="lbl">Cartões Amarelos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD DOS TOTAIS DA CARREIRA -->
          <div class="dash-card">
            <div class="card-header">
              <h2><i class="fa-solid fa-trophy"></i> Números Totais na Carreira</h2>
            </div>
            <div class="card-body">
              <div class="stats-grid-cards">
                <div class="stat-box-large">
                  <span class="num">${c.matches}</span>
                  <span class="lbl">Jogos Oficiais</span>
                </div>
                <div class="stat-box-large highlight">
                  <span class="num">${c.goals}</span>
                  <span class="lbl">Gols na Carreira</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${c.assists}</span>
                  <span class="lbl">Assistências</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${c.titles.length}</span>
                  <span class="lbl">Títulos Conquistados</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">${c.highestOvr}</span>
                  <span class="lbl">Maior Overall (OVR)</span>
                </div>
                <div class="stat-box-large">
                  <span class="num">R$ ${(c.highestMarketValue / 1000000).toFixed(1)}M</span>
                  <span class="lbl">Pico de Valor de Mercado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TÍTULOS E CONQUISTAS COLETIVAS -->
        <div class="dash-card" style="margin-top: 20px;">
          <div class="card-header">
            <h3><i class="fa-solid fa-award"></i> Galeria de Troféus e Títulos</h3>
          </div>
          <div class="card-body">
            ${c.titles.length === 0 ? `
              <p class="text-muted">Ainda nenhum título oficial conquistado. Lute pelo campeonato!</p>
            ` : `
              <ul class="trophies-list">
                ${c.titles.map(t => `
                  <li><i class="fa-solid fa-trophy text-gold"></i> <strong>${t}</strong></li>
                `).join('')}
              </ul>
            `}
          </div>
        </div>
      `;
    } else {
      // Modo Técnico
      const m = career.manager;
      const cs = m.currentSeasonStats;
      const c = m.careerStats;

      container.innerHTML = `
        <div class="stats-overview-grid">
          <div class="dash-card">
            <div class="card-header">
              <h2><i class="fa-solid fa-chart-pie"></i> Temporada Atual do Técnico</h2>
            </div>
            <div class="card-body">
              <div class="stats-grid-cards">
                <div class="stat-box-large"><span class="num">${cs.matches}</span><span class="lbl">Jogos</span></div>
                <div class="stat-box-large highlight"><span class="num">${cs.wins}</span><span class="lbl">Vitórias</span></div>
                <div class="stat-box-large"><span class="num">${cs.draws}</span><span class="lbl">Empates</span></div>
                <div class="stat-box-large"><span class="num">${cs.losses}</span><span class="lbl">Derrotas</span></div>
                <div class="stat-box-large"><span class="num">${cs.points}</span><span class="lbl">Pontos Conquistados</span></div>
              </div>
            </div>
          </div>

          <div class="dash-card">
            <div class="card-header">
              <h2><i class="fa-solid fa-trophy"></i> Carreira do Treinador</h2>
            </div>
            <div class="card-body">
              <div class="stats-grid-cards">
                <div class="stat-box-large"><span class="num">${c.matches}</span><span class="lbl">Total de Jogos</span></div>
                <div class="stat-box-large highlight"><span class="num">${c.wins}</span><span class="lbl">Vitórias Totais</span></div>
                <div class="stat-box-large"><span class="num">${c.titles.length}</span><span class="lbl">Títulos</span></div>
                <div class="stat-box-large"><span class="num">${m.reputation}</span><span class="lbl">Reputação Atual</span></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
}
