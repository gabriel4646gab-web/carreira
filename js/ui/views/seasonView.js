// Tela de Tabela de Classificação e Calendário da Temporada
class SeasonView {
  static render(container, career) {
    if (!career) return;
    const userClub = career.getCurrentClub();

    container.innerHTML = `
      <div class="season-view-container">
        <div class="dash-card">
          <div class="card-header">
            <div>
              <h2><i class="fa-solid fa-table-list"></i> Classificação — ${userClub.league}</h2>
              <span class="text-muted">Temporada ${career.seasonName} • Rodada ${career.currentWeek} de 38</span>
            </div>
            ${career.currentWeek > 38 ? `
              <button class="btn btn-success" id="btnFinishSeasonManual"><i class="fa-solid fa-forward-fast"></i> Concluir Temporada & Avançar</button>
            ` : ''}
          </div>
          <div class="card-body" style="padding: 0;">
            <table class="league-table-full">
              <thead>
                <tr>
                  <th style="width: 50px;">Pos</th>
                  <th>Clube</th>
                  <th>P</th>
                  <th>J</th>
                  <th>V</th>
                  <th>E</th>
                  <th>D</th>
                  <th>GP</th>
                  <th>GC</th>
                  <th>SG</th>
                </tr>
              </thead>
              <tbody>
                ${career.leagueTable.map((team, idx) => {
                  const isUserTeam = team.clubId === userClub.id;
                  const pos = idx + 1;
                  let zoneClass = '';
                  if (pos === 1) zoneClass = 'zone-champion';
                  else if (pos <= 4) zoneClass = 'zone-libertadores';
                  else if (pos >= career.leagueTable.length - 3) zoneClass = 'zone-relegation';

                  return `
                    <tr class="${isUserTeam ? 'user-team-row' : ''} ${zoneClass}">
                      <td><strong>${pos}º</strong></td>
                      <td>
                        <span class="club-table-name">${team.name} ${isUserTeam ? '<span class="badge badge-primary">Você</span>' : ''}</span>
                      </td>
                      <td><strong>${team.points}</strong></td>
                      <td>${team.played}</td>
                      <td>${team.won}</td>
                      <td>${team.drawn}</td>
                      <td>${team.lost}</td>
                      <td>${team.goalsFor}</td>
                      <td>${team.goalsAgainst}</td>
                      <td>${team.goalDifference > 0 ? '+' + team.goalDifference : team.goalDifference}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="dash-card" style="margin-top: 20px;">
          <div class="card-header">
            <h3><i class="fa-solid fa-calendar-days"></i> Próximos Confrontos Agendados</h3>
          </div>
          <div class="card-body">
            <div class="fixtures-grid">
              ${career.fixtures.filter(f => !f.played).slice(0, 5).map(f => {
                const isHome = f.homeClubId === userClub.id;
                const opp = getClubById(isHome ? f.awayClubId : f.homeClubId);
                return `
                  <div class="fixture-card-mini">
                    <span class="fix-round">Rodada ${f.round}</span>
                    <div class="fix-teams">
                      <strong>${isHome ? userClub.name : opp.name}</strong>
                      <span>vs</span>
                      <strong>${isHome ? opp.name : userClub.name}</strong>
                    </div>
                    <span class="fix-place">${isHome ? 'Casa' : 'Fora'}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const btnFinish = document.getElementById('btnFinishSeasonManual');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        const summary = SeasonEngine.finishSeason(career);
        StorageManager.saveCareer(career);
        window.uiManager.updateHeaderAndSidebar();
        window.uiManager.showToast('Temporada Concluída!', `Temporada finalizada em ${summary.finalRank}º lugar! Nova temporada iniciada.`, 'success');
        SeasonView.render(container, career);
      });
    }
  }
}
