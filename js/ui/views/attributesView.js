// Visualizador Completo de Atributos, OVR e Evolução
class AttributesView {
  static render(container, career) {
    if (!career || career.type !== 'player') {
      container.innerHTML = `
        <div class="dash-card">
          <h2>Painel de Atributos disponível apenas no Modo Jogador</h2>
          <p class="text-muted">No modo Técnico, acesse a aba Elenco & Táticas para gerenciar o time.</p>
        </div>
      `;
      return;
    }

    const p = career.player;
    const a = p.attributes;

    const renderAttrBar = (label, val) => {
      let colorClass = 'bg-danger';
      if (val >= 85) colorClass = 'bg-gold';
      else if (val >= 75) colorClass = 'bg-success';
      else if (val >= 65) colorClass = 'bg-info';
      else if (val >= 55) colorClass = 'bg-warning';

      return `
        <div class="attribute-row">
          <span class="attr-name">${label}</span>
          <div class="attr-bar-wrapper">
            <div class="attr-bar-fill ${colorClass}" style="width: ${val}%"></div>
          </div>
          <span class="attr-val ${val >= 80 ? 'highlight-val' : ''}">${val}</span>
        </div>
      `;
    };

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
              <span class="badge badge-dark">Pé ${p.dominantFoot}</span>
            </div>
          </div>
          <div class="ovr-potential-box">
            <span class="pot-label">Potencial Estimado</span>
            <span class="pot-val">${p.potential}</span>
          </div>
        </div>
      </div>

      <div class="attributes-category-grid">
        <!-- FÍSICOS -->
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-bolt"></i> Atributos Físicos</h3>
          </div>
          <div class="card-body">
            ${renderAttrBar('Aceleração', a.acceleration)}
            ${renderAttrBar('Velocidade', a.pace)}
            ${renderAttrBar('Agilidade', a.agility)}
            ${renderAttrBar('Equilíbrio', a.balance)}
            ${renderAttrBar('Força Física', a.strength)}
            ${renderAttrBar('Resistência / Stamina', a.stamina)}
            ${renderAttrBar('Impulsão / Salto', a.jumping)}
          </div>
        </div>

        <!-- TÉCNICOS -->
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-wand-magic-sparkles"></i> Atributos Técnicos</h3>
          </div>
          <div class="card-body">
            ${p.position === 'Goleiro' ? `
              ${renderAttrBar('Reflexos de Goleiro', a.gkReflexes)}
              ${renderAttrBar('Defesa / Mergulho', a.gkDiving)}
              ${renderAttrBar('Posicionamento no Gol', a.gkPositioning)}
              ${renderAttrBar('Jogo 1 contra 1', a.gkOneOnOne)}
              ${renderAttrBar('Pegada / Firmeza', a.gkHandling)}
              ${renderAttrBar('Reposição / Chute', a.gkKicking)}
            ` : `
              ${renderAttrBar('Finalização', a.finishing)}
              ${renderAttrBar('Chute de Longe', a.longShots)}
              ${renderAttrBar('Passe Curto', a.shortPassing)}
              ${renderAttrBar('Passe Longo', a.longPassing)}
              ${renderAttrBar('Cruzamento', a.crossing)}
              ${renderAttrBar('Drible', a.dribbling)}
              ${renderAttrBar('Controle de Bola', a.ballControl)}
              ${renderAttrBar('Primeiro Toque', a.firstTouch)}
              ${renderAttrBar('Cabeceio', a.heading)}
              ${renderAttrBar('Desarme no Chão', a.tackling)}
              ${renderAttrBar('Marcação', a.marking)}
              ${renderAttrBar('Interceptação', a.interceptions)}
            `}
          </div>
        </div>

        <!-- MENTAIS -->
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-brain"></i> Atributos Mentais</h3>
          </div>
          <div class="card-body">
            ${renderAttrBar('Visão de Jogo', a.vision)}
            ${renderAttrBar('Tomada de Decisão', a.decisions)}
            ${renderAttrBar('Posicionamento Ofensivo', a.positioning)}
            ${renderAttrBar('Compostura', a.composure)}
            ${renderAttrBar('Concentração', a.concentration)}
            ${renderAttrBar('Determinação', a.determination)}
            ${renderAttrBar('Inteligência Tática', a.tacticalAwareness)}
            ${renderAttrBar('Agressividade', a.aggression)}
          </div>
        </div>

        <!-- PERSONALIDADE & VESTIÁRIO -->
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fa-solid fa-user-gear"></i> Dinâmica & Personalidade</h3>
          </div>
          <div class="card-body">
            ${renderAttrBar('Profissionalismo', p.professionalism)}
            ${renderAttrBar('Disciplina', p.discipline)}
            ${renderAttrBar('Popularidade com Fãs', p.popularity)}
            ${renderAttrBar('Confiança Atual', p.confidence)}
            ${renderAttrBar('Relação com o Treinador', p.coachRelationship)}
            ${renderAttrBar('Harmonia no Vestiário', p.squadRelationship)}
          </div>
        </div>
      </div>
    `;
  }
}
