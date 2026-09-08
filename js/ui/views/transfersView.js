// Painel de Mercado da Bola, Contratos e Propostas de Transferência
class TransfersView {
  static render(container, career) {
    if (!career) return;
    const isPlayer = career.type === 'player';
    const club = career.getCurrentClub();

    container.innerHTML = `
      <div class="transfers-container">
        <!-- CARD DO CONTRATO ATUAL -->
        <div class="dash-card current-contract-card">
          <div class="card-header">
            <h2><i class="fa-solid fa-file-contract"></i> Situação Contratual Atual</h2>
            <span class="badge badge-primary">${club.name}</span>
          </div>
          <div class="card-body">
            <div class="contract-details-grid">
              <div class="contract-item">
                <span class="lbl">Clube Empregador</span>
                <strong>${club.name} (${club.league})</strong>
              </div>
              <div class="contract-item">
                <span class="lbl">Valor de Mercado Estimado</span>
                <strong>R$ ${isPlayer ? (career.player.marketValue).toLocaleString('pt-BR') : 'N/A'}</strong>
              </div>
              <div class="contract-item">
                <span class="lbl">Salário Semanal</span>
                <strong>R$ ${isPlayer ? career.player.weeklyWage.toLocaleString('pt-BR') : career.manager.weeklySalary.toLocaleString('pt-BR')}</strong>
              </div>
              <div class="contract-item">
                <span class="lbl">Duração do Vínculo</span>
                <strong>${isPlayer ? career.player.contractYears : career.manager.contractYears} anos restantes</strong>
              </div>
              ${isPlayer ? `
                <div class="contract-item">
                  <span class="lbl">Papel Esperado no Elenco</span>
                  <strong>${career.player.squadRole}</strong>
                </div>
              ` : `
                <div class="contract-item">
                  <span class="lbl">Orçamento de Contratações</span>
                  <strong>R$ ${(career.manager.transferBudget / 1000000).toFixed(1)} Milhões</strong>
                </div>
              `}
            </div>

            <div class="contract-actions" style="margin-top: 20px;">
              ${isPlayer ? `
                <button class="btn btn-outline" id="btnRequestTransfer"><i class="fa-solid fa-plane"></i> Solicitar Transferência à Diretoria</button>
                <button class="btn btn-outline" id="btnDemandRaise"><i class="fa-solid fa-money-bill-trend-up"></i> Negociar Aumento Salarial</button>
              ` : `
                <button class="btn btn-outline" id="btnRequestBudget"><i class="fa-solid fa-sack-dollar"></i> Solicitar Verba Extra à Diretoria</button>
              `}
            </div>
          </div>
        </div>

        <!-- PROPOSTAS RECEBIDAS -->
        <div class="dash-card">
          <div class="card-header">
            <h2><i class="fa-solid fa-envelope-open-text"></i> Propostas Oficiais Recebidas</h2>
            <span class="badge badge-info">${career.transferOffers.length} Propostas</span>
          </div>
          <div class="card-body">
            ${career.transferOffers.length === 0 ? `
              <div class="empty-state">
                <i class="fa-solid fa-inbox" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 12px;"></i>
                <p class="text-muted">Nenhuma proposta na mesa no momento. Continue se destacando nas partidas para atrair o interesse de grandes clubes!</p>
              </div>
            ` : `
              <div class="offers-list">
                ${career.transferOffers.map(offer => `
                  <div class="offer-card">
                    <div class="offer-club-badge" style="background-color: ${offer.clubColors[0]}; color: ${offer.clubColors[1] || '#fff'}">
                      ${offer.clubLogoText}
                    </div>
                    <div class="offer-info">
                      <h3>${offer.clubName}</h3>
                      <p class="text-muted">${offer.league} • ${offer.country}</p>
                      <div class="offer-specs">
                        <span><strong>Salário:</strong> R$ ${offer.weeklyWage.toLocaleString('pt-BR')}/sem</span>
                        <span><strong>Vínculo:</strong> ${offer.contractYears} Anos</span>
                        ${offer.squadRole ? `<span><strong>Papel:</strong> ${offer.squadRole}</span>` : ''}
                        ${offer.transferFee ? `<span><strong>Taxa de Transf.:</strong> R$ ${(offer.transferFee / 1000000).toFixed(1)}M</span>` : ''}
                      </div>
                    </div>
                    <div class="offer-actions">
                      <button class="btn btn-success" onclick="TransfersView.handleAcceptOffer('${offer.id}')">
                        <i class="fa-solid fa-check"></i> Aceitar Proposta
                      </button>
                      <button class="btn btn-danger" onclick="TransfersView.handleRejectOffer('${offer.id}')">
                        <i class="fa-solid fa-xmark"></i> Recusar
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    // Ações contratuais
    const btnReq = document.getElementById('btnRequestTransfer');
    if (btnReq) {
      btnReq.addEventListener('click', () => {
        career.player.morale = Math.max(20, career.player.morale - 10);
        career.player.coachRelationship = Math.max(20, career.player.coachRelationship - 15);
        TransferEngine.generatePlayerOffer(career);
        StorageManager.saveCareer(career);
        window.uiManager.showToast('Transferência Solicitada', 'A diretoria colocou seu nome na lista de transferências do mercado.', 'info');
        TransfersView.render(container, career);
      });
    }

    const btnRaise = document.getElementById('btnDemandRaise');
    if (btnRaise) {
      btnRaise.addEventListener('click', () => {
        if (career.player.form >= 7.2) {
          career.player.weeklyWage = Math.round(career.player.weeklyWage * 1.25);
          career.player.morale = Math.min(100, career.player.morale + 15);
          StorageManager.saveCareer(career);
          window.uiManager.updateHeaderAndSidebar();
          window.uiManager.showToast('Aumento Aprovado!', `Seu excelente desempenho convenceu a diretoria! Novo salário: R$ ${career.player.weeklyWage.toLocaleString('pt-BR')}/sem`, 'success');
          TransfersView.render(container, career);
        } else {
          career.player.morale = Math.max(20, career.player.morale - 8);
          window.uiManager.showToast('Pedido Negado', 'A diretoria considerou que seu rendimento atual não justifica um aumento salarial.', 'warning');
        }
      });
    }
  }

  static handleAcceptOffer(offerId) {
    const career = window.uiManager.activeCareer;
    if (!career) return;

    if (confirm('Deseja realmente aceitar esta proposta e assinar com o novo clube?')) {
      const success = TransferEngine.acceptOffer(career, offerId);
      if (success) {
        StorageManager.saveCareer(career);
        window.uiManager.updateHeaderAndSidebar();
        window.uiManager.showToast('Transferência Concluída! ✍️', `Apresentação oficial realizada no ${career.getCurrentClub().name}!`, 'success');
        window.uiManager.switchView('dashboard');
      }
    }
  }

  static handleRejectOffer(offerId) {
    const career = window.uiManager.activeCareer;
    if (!career) return;
    TransferEngine.rejectOffer(career, offerId);
    StorageManager.saveCareer(career);
    window.uiManager.showToast('Proposta Recusada', 'A oferta foi descartada.', 'info');
    TransfersView.render(document.getElementById('mainContentArea'), career);
  }
}
