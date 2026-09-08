// Visualizador + Loja de Upgrades de Atributos com Sistema de Moedas
class AttributesView {
  static render(container, career) {
    if (!career || career.type !== 'player') {
      container.innerHTML = `
        <div class="dash-card">
          <h2>Painel de Atributos disponível apenas no Modo Jogador</h2>
          <p class="text-muted">No modo Técnico, acesse a aba Elenco &amp; Táticas para gerenciar o time.</p>
        </div>
      `;
      return;
    }
    AttributesView._renderContent(container, career);
  }

  static _renderContent(container, career) {
    const p = career.player;
    const a = p.attributes;
    const coins = p.coins || 0;

    const renderUpgradeRow = (label, attrKey, val) => {
      let colorClass = 'attr-bar-danger';
      if (val >= 85) colorClass = 'attr-bar-gold';
      else if (val >= 75) colorClass = 'attr-bar-success';
      else if (val >= 65) colorClass = 'attr-bar-info';
      else if (val >= 55) colorClass = 'attr-bar-warning';

      const cost = p.getAttributeUpgradeCost(attrKey);
      const maxed = val >= 99;
      const canAfford = coins >= cost;

      let btnClass = 'btn btn-sm btn-upgrade';
      if (maxed) btnClass += ' btn-maxed';
      else if (!canAfford) btnClass += ' btn-cant-afford';
      else btnClass += ' btn-primary';

      return `
        <div class="upgrade-row" data-attr="${attrKey}">
          <span class="attr-name">${label}</span>
          <div class="attr-bar-wrapper">
            <div class="attr-bar-fill ${colorClass}" style="width:${Math.min(val,99)}%"></div>
          </div>
          <span class="attr-val ${val >= 80 ? 'highlight-val' : ''}">${val}</span>
          ${maxed
            ? `<span class="badge-cost maxed">MAX</span>`
            : `<span class="badge-cost ${canAfford ? 'affordable' : 'expensive'}">&#x1FA99;${cost}</span>
               <button class="${btnClass}" data-upgrade="${attrKey}">
                 ${canAfford ? '&#9650;' : '&#128274;'}
               </button>`
          }
        </div>
      `;
    };

    const gk = p.position === 'Goleiro';

    container.innerHTML = `
      <div class="attributes-view-header">
        <div class="ovr-card-hero">
          <div class="ovr-badge-huge">${p.ovr}</div>
          <div class="ovr-details">
            <h2>${p.name}</h2>
            <div class="ovr-subtags">
              <span class="badge badge-primary">${p.position}</span>
              <span class="badge badge-secondary">${p.age} anos</span>
              <span class="badge badge-info">${p.style}</span>
              <span class="badge badge-dark">P&#233; ${p.dominantFoot}</span>
            </div>
          </div>
          <div class="ovr-potential-box">
            <span class="pot-label">Potencial Estimado</span>
            <span class="pot-val">${p.potential}</span>
          </div>
        </div>
      </div>

      <div class="coins-banner">
        <span class="coins-icon">&#x1FA99;</span>
        <div class="coins-info">
          <span class="coins-label">Moedas Dispon&#237;veis</span>
          <span class="coins-value" id="upgradeShopCoins">${coins.toLocaleString('pt-BR')}</span>
        </div>
        <div class="coins-hint">
          <small>Ganhe moedas jogando partidas e terminando temporadas.</small>
        </div>
      </div>

      <div class="attributes-category-grid">

        <div class="dash-card">
          <div class="card-header"><h3><i class="fa-solid fa-bolt"></i> Atributos F&#237;sicos</h3></div>
          <div class="card-body upgrade-list">
            ${renderUpgradeRow('Acelera&#231;&#227;o', 'acceleration', a.acceleration)}
            ${renderUpgradeRow('Velocidade', 'pace', a.pace)}
            ${renderUpgradeRow('Agilidade', 'agility', a.agility)}
            ${renderUpgradeRow('Equil&#237;brio', 'balance', a.balance)}
            ${renderUpgradeRow('For&#231;a F&#237;sica', 'strength', a.strength)}
            ${renderUpgradeRow('Resist&#234;ncia / Stamina', 'stamina', a.stamina)}
            ${renderUpgradeRow('Impuls&#227;o / Salto', 'jumping', a.jumping)}
          </div>
        </div>

        <div class="dash-card">
          <div class="card-header"><h3><i class="fa-solid fa-wand-magic-sparkles"></i> Atributos T&#233;cnicos</h3></div>
          <div class="card-body upgrade-list">
            ${gk ? `
              ${renderUpgradeRow('Reflexos de Goleiro', 'gkReflexes', a.gkReflexes)}
              ${renderUpgradeRow('Defesa / Mergulho', 'gkDiving', a.gkDiving)}
              ${renderUpgradeRow('Posicionamento no Gol', 'gkPositioning', a.gkPositioning)}
              ${renderUpgradeRow('Jogo 1 contra 1', 'gkOneOnOne', a.gkOneOnOne)}
              ${renderUpgradeRow('Pegada / Firmeza', 'gkHandling', a.gkHandling)}
              ${renderUpgradeRow('Reposi&#231;&#227;o / Chute', 'gkKicking', a.gkKicking)}
            ` : `
              ${renderUpgradeRow('Finaliza&#231;&#227;o', 'finishing', a.finishing)}
              ${renderUpgradeRow('Chute de Longe', 'longShots', a.longShots)}
              ${renderUpgradeRow('Passe Curto', 'shortPassing', a.shortPassing)}
              ${renderUpgradeRow('Passe Longo', 'longPassing', a.longPassing)}
              ${renderUpgradeRow('Cruzamento', 'crossing', a.crossing)}
              ${renderUpgradeRow('Drible', 'dribbling', a.dribbling)}
              ${renderUpgradeRow('Controle de Bola', 'ballControl', a.ballControl)}
              ${renderUpgradeRow('Primeiro Toque', 'firstTouch', a.firstTouch)}
              ${renderUpgradeRow('Cabece&#239;o', 'heading', a.heading)}
              ${renderUpgradeRow('Desarme no Ch&#227;o', 'tackling', a.tackling)}
              ${renderUpgradeRow('Marca&#231;&#227;o', 'marking', a.marking)}
              ${renderUpgradeRow('Intercept&#231;&#227;o', 'interceptions', a.interceptions)}
            `}
          </div>
        </div>

        <div class="dash-card">
          <div class="card-header"><h3><i class="fa-solid fa-brain"></i> Atributos Mentais</h3></div>
          <div class="card-body upgrade-list">
            ${renderUpgradeRow('Vis&#227;o de Jogo', 'vision', a.vision)}
            ${renderUpgradeRow('Tomada de Decis&#227;o', 'decisions', a.decisions)}
            ${renderUpgradeRow('Posicionamento Ofensivo', 'positioning', a.positioning)}
            ${renderUpgradeRow('Compostura', 'composure', a.composure)}
            ${renderUpgradeRow('Concentra&#231;&#227;o', 'concentration', a.concentration)}
            ${renderUpgradeRow('Determina&#231;&#227;o', 'determination', a.determination)}
            ${renderUpgradeRow('Intelig&#234;ncia T&#225;tica', 'tacticalAwareness', a.tacticalAwareness)}
            ${renderUpgradeRow('Agressividade', 'aggression', a.aggression)}
          </div>
        </div>

        <div class="dash-card">
          <div class="card-header"><h3><i class="fa-solid fa-user-gear"></i> Din&#226;mica &amp; Personalidade</h3></div>
          <div class="card-body upgrade-list read-only">
            <p class="text-muted" style="font-size:0.8rem;margin-bottom:8px">
              <i class="fa-solid fa-lock"></i> Evoluem por eventos e decis&#245;es na carreira.
            </p>
            ${AttributesView._readOnlyBar('Profissionalismo', p.professionalism)}
            ${AttributesView._readOnlyBar('Disciplina', p.discipline)}
            ${AttributesView._readOnlyBar('Popularidade com F&#227;s', p.popularity)}
            ${AttributesView._readOnlyBar('Confian&#231;a Atual', p.confidence)}
            ${AttributesView._readOnlyBar('Rela&#231;&#227;o com o Treinador', p.coachRelationship)}
            ${AttributesView._readOnlyBar('Harmonia no Vestiário', p.squadRelationship)}
          </div>
        </div>

      </div>
    `;

    container.querySelectorAll('button[data-upgrade]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.upgrade;
        const result = p.upgradeAttribute(key);
        if (result.success) {
          StorageManager.saveCareer(career);
          if (window.uiManager) {
            window.uiManager.updateCoinsDisplay();
            window.uiManager.showToast(
              'Atributo Melhorado!',
              `${key} foi para ${result.newValue} — custou ${result.cost} moedas`,
              'success'
            );
          }
          AttributesView._renderContent(container, career);
        } else {
          if (window.uiManager) {
            window.uiManager.showToast('Moedas insuficientes', result.reason || 'Voce nao tem moedas suficientes.', 'danger');
          }
        }
      });
    });
  }

  static _readOnlyBar(label, val) {
    let colorClass = 'attr-bar-danger';
    if (val >= 85) colorClass = 'attr-bar-gold';
    else if (val >= 75) colorClass = 'attr-bar-success';
    else if (val >= 65) colorClass = 'attr-bar-info';
    else if (val >= 55) colorClass = 'attr-bar-warning';
    return `
      <div class="attribute-row">
        <span class="attr-name">${label}</span>
        <div class="attr-bar-wrapper">
          <div class="attr-bar-fill ${colorClass}" style="width:${val}%"></div>
        </div>
        <span class="attr-val">${val}</span>
      </div>
    `;
  }
}

