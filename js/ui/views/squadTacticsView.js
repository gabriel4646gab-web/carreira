// Tela de Elenco e Prancheta Tática com Jogadores Parodiados e Níveis Coerentes
class SquadTacticsView {
  static render(container, career) {
    if (!career) return;
    const club = career.getCurrentClub();
    const isManager = career.type === 'manager';

    // Gera o elenco parodiado oficial do clube
    const squad = generateSquadForClub(club);

    container.innerHTML = `
      <div class="squad-tactics-container">
        <!-- CABEÇALHO DO CLUBE -->
        <div class="dash-card club-squad-hero">
          <div class="club-badge-large" style="background-color: ${club.colors[0]}; color: ${club.colors[1] || '#fff'}">
            ${club.logoText}
          </div>
          <div class="club-info">
            <h2>${club.name}</h2>
            <p class="text-muted">${club.league} • Força do Elenco: OVR ${club.ovr} (★ ${club.stars.toFixed(1)})</p>
          </div>
          <div class="club-stats-pills" style="margin-left: auto; display: flex; gap: 8px;">
            <span class="badge badge-success">ATK: ${club.atk}</span>
            <span class="badge badge-info">MEI: ${club.mid}</span>
            <span class="badge badge-warning">DEF: ${club.def}</span>
          </div>
        </div>

        <div class="tactics-layout-grid">
          <!-- PRANCHETA TÁTICA / FORMAÇÃO -->
          <div class="dash-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-chess-board"></i> Desenho Tático & Filosofia</h3>
            </div>
            <div class="card-body">
              ${isManager ? `
                <div class="form-group" style="margin-bottom: 15px;">
                  <label>Esquema Tático Ativo</label>
                  <select class="form-control" id="selectFormation">
                    <option value="4-3-3" ${career.manager.favoriteFormation === '4-3-3' ? 'selected' : ''}>4-3-3 Ofensivo</option>
                    <option value="4-2-3-1" ${career.manager.favoriteFormation === '4-2-3-1' ? 'selected' : ''}>4-2-3-1 Equilibrado</option>
                    <option value="4-4-2" ${career.manager.favoriteFormation === '4-4-2' ? 'selected' : ''}>4-4-2 em Linhas</option>
                    <option value="3-5-2" ${career.manager.favoriteFormation === '3-5-2' ? 'selected' : ''}>3-5-2 com Alas</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Mentalidade da Equipe</label>
                  <select class="form-control" id="selectMentalidade">
                    <option value="Pressão">Pressão Alta e Recuperação Rápida</option>
                    <option value="Posse" selected>Posse Paciente e Linhas Altas</option>
                    <option value="Contra-ataque">Contra-ataque Rápido</option>
                  </select>
                </div>
              ` : `
                <p><strong>Esquema Tático do Clube:</strong> 4-3-3 Ofensivo</p>
                <p><strong>Estilo do Treinador:</strong> Jogo Apoiado e Transição Rápida</p>
              `}

              <!-- CAMPO DE FUTEBOL VISUAL -->
              <div class="pitch-field-mini">
                <div class="pitch-line pitch-center-circle"></div>
                <div class="pitch-penalty-area top"></div>
                <div class="pitch-penalty-area bottom"></div>

                <div class="pitch-player pos-gk" title="Goleiro">GOL</div>
                <div class="pitch-player pos-lb" title="Lateral Esquerdo">LE</div>
                <div class="pitch-player pos-cb1" title="Zagueiro">ZAG</div>
                <div class="pitch-player pos-cb2" title="Zagueiro">ZAG</div>
                <div class="pitch-player pos-rb" title="Lateral Direito">LD</div>
                <div class="pitch-player pos-dm" title="Volante">VOL</div>
                <div class="pitch-player pos-cm1" title="Meia Central">MC</div>
                <div class="pitch-player pos-cm2" title="Meia Atacante">MEI</div>
                <div class="pitch-player pos-lw" title="Ponta Esquerda">PE</div>
                <div class="pitch-player pos-rw" title="Ponta Direita">PD</div>
                <div class="pitch-player pos-st" title="Centroavante">CA</div>
              </div>
            </div>
          </div>

          <!-- TABELA DE ATLETAS DO ELENCO (PARODIADOS) -->
          <div class="dash-card">
            <div class="card-header">
              <h3><i class="fa-solid fa-users"></i> Atletas do Elenco Profissional</h3>
              <span class="badge badge-secondary">${squad.length} Atletas</span>
            </div>
            <div class="card-body" style="padding: 0;">
              <table class="squad-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Nome do Atleta</th>
                    <th>OVR</th>
                    <th>Idade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${career.type === 'player' ? `
                    <tr class="player-highlight-row">
                      <td><span class="badge badge-primary">${career.player.position}</span></td>
                      <td><strong>${career.player.name} (Você)</strong></td>
                      <td><span class="badge badge-success">${career.player.ovr}</span></td>
                      <td>${career.player.age}</td>
                      <td><span class="badge badge-info">${career.player.squadRole}</span></td>
                    </tr>
                  ` : ''}
                  ${squad.map(sq => `
                    <tr>
                      <td><span class="badge badge-dark">${sq.position}</span></td>
                      <td>
                        <strong>${sq.name}</strong> 
                        ${sq.isStar ? '<i class="fa-solid fa-star text-gold" title="Destaque"></i>' : ''}
                      </td>
                      <td><strong class="${sq.ovr >= 82 ? 'text-gold' : ''}">${sq.ovr}</strong></td>
                      <td>${sq.age}</td>
                      <td>${sq.isStarter ? '<span class="text-success">Titular</span>' : '<span class="text-muted">Reserva</span>'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    const selForm = document.getElementById('selectFormation');
    if (selForm && isManager) {
      selForm.addEventListener('change', (e) => {
        career.manager.favoriteFormation = e.target.value;
        StorageManager.saveCareer(career);
        window.uiManager.showToast('Esquema Alterado', `Nova formação definida: ${e.target.value}`, 'info');
      });
    }
  }
}
