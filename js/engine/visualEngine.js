// ============================================================================
// MOTOR DE ILUSTRAÇÕES E VISUAIS CONTEXTUAIS (VISUAL ENGINE)
// Gera representações gráficas vetoriais (SVG) dinâmicas, limpas e contextuais
// para TODAS as situações da carreira (em campo, desfechos de lances e extracampo).
// ============================================================================

class VisualEngine {
  constructor() {
    this.defaultPlayerColor = '#3b82f6'; // Azul padrão (Aliado)
    this.defaultRivalColor = '#ef4444';  // Vermelho padrão (Adversário)
    this.teammateColor = '#10b981';     // Verde (Companheiro Livre)
    this.ballColor = '#ffffff';
    this.pitchGrassDark = '#143823';
    this.pitchGrassLight = '#1b4d31';
    this.pitchLine = 'rgba(255, 255, 255, 0.25)';
  }

  // Obter cores do clube atual do jogador
  getClubColors() {
    try {
      if (window.appState && window.appState.career && window.appState.career.entity) {
        const clubId = window.appState.career.entity.clubId;
        const club = CLUBS_DATA.find(c => c.id === clubId);
        if (club && club.colors && club.colors.length > 0) {
          return {
            primary: club.colors[0],
            secondary: club.colors[1] || '#ffffff'
          };
        }
      }
    } catch (e) {
      // Fallback
    }
    return { primary: this.defaultPlayerColor, secondary: '#ffffff' };
  }

  /**
   * Renderiza uma ilustração contextual em formato SVG string.
   * @param {string} visualType - Tipo de situação (ex: 'blocked_pass', 'blocked_shot', 'goal_net', 'party_nightclub')
   * @param {Object} options - Parâmetros customizados de contexto
   * @returns {string} Código HTML/SVG pronto para inserção no DOM
   */
  render(visualType, options = {}) {
    const clubColors = this.getClubColors();
    const pColor = options.playerColor || clubColors.primary;
    const rColor = options.rivalColor || this.defaultRivalColor;

    switch (visualType) {
      // ======================================================================
      // 1. SITUAÇÕES TÁTICAS EM CAMPO (DECISÕES DO JOGADOR)
      // ======================================================================
      
      case 'blocked_shot':
      case 'zagueiro_bloqueando_chute':
        return this._renderBlockedShot(pColor, rColor, options);

      case 'blocked_pass':
      case 'zagueiro_bloqueando_passe':
        return this._renderBlockedPass(pColor, rColor, options);

      case 'free_teammate_right':
      case 'free_teammate_left':
      case 'free_teammate':
      case 'companheiro_livre':
        return this._renderFreeTeammate(pColor, rColor, options);

      case 'surrounded_3':
      case 'jogador_cercado':
        return this._renderSurrounded(pColor, rColor, options);

      case '1v1_duel':
      case 'drible_1v1':
        return this._render1v1Duel(pColor, rColor, options);

      case 'gk_advanced':
      case 'goleiro_adiantado':
        return this._renderGkAdvanced(pColor, rColor, options);

      case 'open_space':
      case 'espaco_aberto':
        return this._renderOpenSpace(pColor, rColor, options);

      case 'counter_attack':
      case 'contra_ataque':
        return this._renderCounterAttack(pColor, rColor, options);

      case 'crossing_wing':
      case 'cruzamento_lateral':
        return this._renderCrossingWing(pColor, rColor, options);

      case 'aerial_duel':
      case 'bola_aerea':
        return this._renderAerialDuel(pColor, rColor, options);

      case 'holding_midfield':
      case 'armacao_meio':
        return this._renderMidfieldPlaymaking(pColor, rColor, options);

      case 'defense_clearance':
      case 'corte_defensivo':
        return this._renderDefensiveIntervention(pColor, rColor, options);

      // ======================================================================
      // 2. DESFECHOS E RESULTADOS DAS JOGADAS
      // ======================================================================

      case 'goal_net':
      case 'gol':
        return this._renderGoalNet(pColor, options);

      case 'ball_post':
      case 'bola_na_trave':
        return this._renderBallPost(pColor, options);

      case 'gk_save':
      case 'defesa_goleiro':
        return this._renderGkSave(pColor, rColor, options);

      case 'shot_blocked':
      case 'chute_bloqueado':
        return this._renderShotBlockedOutcome(pColor, rColor, options);

      case 'shot_wide':
      case 'chute_fora':
        return this._renderShotWide(pColor, options);

      case 'tackle_success':
      case 'desarme':
      case 'carrinho':
        return this._renderTackle(pColor, rColor, options);

      case 'interception':
      case 'passe_interceptado':
        return this._renderInterception(pColor, rColor, options);

      case 'dribble_success':
      case 'drible_concluido':
        return this._renderDribbleSuccess(pColor, rColor, options);

      case 'foul_card':
      case 'falta':
        return this._renderFoulCard(pColor, rColor, options);

      case 'injury_down':
      case 'jogador_lesionado':
        return this._renderInjury(pColor, options);

      // ======================================================================
      // 3. EVENTOS NARRATIVOS & VIDA EXTRACAMPO
      // ======================================================================

      case 'party_nightclub':
      case 'balada':
        return this._renderPartyNightclub();

      case 'extra_training':
      case 'treino_extra':
        return this._renderExtraTraining(pColor);

      case 'gym_fitness':
      case 'academia':
        return this._renderGymFitness(pColor);

      case 'tactical_board':
      case 'estudo_tatico':
        return this._renderTacticalBoard();

      case 'coach_talk':
      case 'conversa_treinador':
        return this._renderCoachTalk(pColor);

      case 'locker_dispute':
      case 'discussao_vestiario':
        return this._renderLockerDispute(pColor);

      case 'press_conference':
      case 'entrevista':
        return this._renderPressConference(pColor);

      case 'fans_autograph':
      case 'torcedor':
        return this._renderFansAutograph(pColor);

      case 'contract_signing':
      case 'contrato':
        return this._renderContractSigning();

      case 'transfer_airport':
      case 'transferencia':
        return this._renderTransfer();

      case 'physio_recovery':
      case 'fisioterapia':
      case 'recuperacao':
        return this._renderPhysioRecovery(pColor);

      case 'trophy_award':
      case 'premiacao':
        return this._renderTrophyAward();

      default:
        return this._renderGenericMatchScene(pColor, rColor, options);
    }
  }

  // ==========================================================================
  // HELPERS DE RENDERIZAÇÃO SVG INTERNA
  // ==========================================================================

  _svgContainer(content, viewBox = "0 0 380 140", title = "") {
    return `
      <div class="situation-visual-canvas" role="img" aria-label="${title}">
        <svg viewBox="${viewBox}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#123824"/>
              <stop offset="100%" stop-color="#0d2919"/>
            </linearGradient>
            <linearGradient id="dangerGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.2"/>
            </linearGradient>
            <linearGradient id="passGreenGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#34d399" stop-opacity="0.3"/>
            </linearGradient>
            <radialGradient id="ballShine" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="70%" stop-color="#cbd5e1"/>
              <stop offset="100%" stop-color="#64748b"/>
            </radialGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
          </defs>
          ${content}
        </svg>
      </div>
    `;
  }

  _renderPitchBackground() {
    return `
      <rect width="380" height="140" fill="url(#pitchGrad)" rx="8"/>
      <!-- Linhas do gramado tático -->
      <line x1="0" y1="35" x2="380" y2="35" stroke="${this.pitchLine}" stroke-dasharray="3,3" stroke-width="1"/>
      <line x1="0" y1="70" x2="380" y2="70" stroke="${this.pitchLine}" stroke-width="1.5"/>
      <line x1="0" y1="105" x2="380" y2="105" stroke="${this.pitchLine}" stroke-dasharray="3,3" stroke-width="1"/>
      <!-- Círculo ou semicírculo de área -->
      <path d="M 330 30 A 40 40 0 0 0 330 110" fill="none" stroke="${this.pitchLine}" stroke-width="1.5"/>
      <rect x="340" y="35" width="40" height="70" fill="none" stroke="${this.pitchLine}" stroke-width="1.5"/>
    `;
  }

  // Desenha um jogador tático com número/letra e sombra
  _drawPlayer(x, y, color, label, isUser = false, aura = null) {
    let auraSvg = '';
    if (aura === 'user') {
      auraSvg = `<circle cx="${x}" cy="${y}" r="18" fill="${color}" fill-opacity="0.25">
        <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>`;
    } else if (aura === 'danger') {
      auraSvg = `<circle cx="${x}" cy="${y}" r="17" fill="#ef4444" fill-opacity="0.3"/>`;
    } else if (aura === 'free') {
      auraSvg = `<circle cx="${x}" cy="${y}" r="17" fill="#10b981" fill-opacity="0.3">
        <animate attributeName="r" values="15;19;15" dur="1.8s" repeatCount="indefinite"/>
      </circle>`;
    }

    return `
      <g filter="url(#dropShadow)">
        ${auraSvg}
        <circle cx="${x}" cy="${y}" r="12" fill="${color}" stroke="#ffffff" stroke-width="${isUser ? '2.5' : '1.5'}"/>
        <text x="${x}" y="${y + 4}" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
        ${isUser ? `<polygon points="${x-4},${y-15} ${x+4},${y-15} ${x},${y-11}" fill="#f59e0b"/>` : ''}
      </g>
    `;
  }

  // Desenha a bola de futebol
  _drawBall(x, y) {
    return `
      <g filter="url(#dropShadow)">
        <circle cx="${x}" cy="${y}" r="6" fill="url(#ballShine)" stroke="#0f172a" stroke-width="1"/>
        <circle cx="${x}" cy="${y}" r="2" fill="#0f172a"/>
      </g>
    `;
  }

  // ==========================================================================
  // CENÁRIOS ESPECÍFICOS EM CAMPO
  // ==========================================================================

  _renderBlockedShot(pColor, rColor, options) {
    const pX = 80, pY = 70;
    const defX = 180, defY = 70;
    const goalX = 360, goalY = 70;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Trajetória Bloqueada Vermelha para o Gol -->
      <line x1="${pX + 14}" y1="${pY}" x2="${defX - 14}" y2="${defY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3"/>
      <line x1="${defX}" y1="${defY}" x2="${goalX}" y2="${goalY}" stroke="#ef4444" stroke-width="3" stroke-dasharray="4,4"/>
      
      <!-- Trave do Gol no fundo -->
      <rect x="360" y="45" width="8" height="50" fill="none" stroke="#ffffff" stroke-width="3"/>
      <line x1="360" y1="45" x2="375" y2="45" stroke="#ffffff" stroke-width="2"/>
      <line x1="360" y1="95" x2="375" y2="95" stroke="#ffffff" stroke-width="2"/>

      <!-- Ícone de Bloqueio 🔒/🚫 -->
      <g transform="translate(${defX - 10}, ${defY - 32})">
        <rect x="0" y="0" width="20" height="16" rx="3" fill="#dc2626"/>
        <text x="10" y="12" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">🚫</text>
      </g>
      
      <!-- Jogadores -->
      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 16, pY + 4)}
      ${this._drawPlayer(defX, defY, rColor, 'ZAG', false, 'danger')}
      
      <!-- Companheiro livre de lado como alternativa -->
      <line x1="${pX + 10}" y1="${pY - 10}" x2="160" y2="30" stroke="#10b981" stroke-width="2" stroke-dasharray="3,2"/>
      ${this._drawPlayer(170, 30, this.teammateColor, 'COMP', false, 'free')}

      <!-- Tag de legenda -->
      <text x="190" y="128" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fca5a5" text-anchor="middle">
        🔒 LINHA DE CHUTE FECHADA PELO ZAGUEIRO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Zagueiro bloqueando linha de chute");
  }

  _renderBlockedPass(pColor, rColor, options) {
    const pX = 60, pY = 90;
    const defX = 170, defY = 65;
    const teamX = 290, teamY = 40;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Linha de passe bloqueada no meio -->
      <line x1="${pX}" y1="${pY}" x2="${defX}" y2="${defY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
      <line x1="${defX}" y1="${defY}" x2="${teamX}" y2="${teamY}" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,4"/>
      
      <!-- Marcação de Bloqueio -->
      <g transform="translate(${defX - 8}, ${defY - 28})">
        <circle cx="8" cy="8" r="9" fill="#dc2626"/>
        <line x1="4" y1="4" x2="12" y2="12" stroke="#ffffff" stroke-width="2"/>
        <line x1="12" y1="4" x2="4" y2="12" stroke="#ffffff" stroke-width="2"/>
      </g>

      <!-- Jogadores -->
      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 14, pY - 2)}
      ${this._drawPlayer(defX, defY, rColor, 'DEF', false, 'danger')}
      ${this._drawPlayer(teamX, teamY, this.teammateColor, 'COMP', false)}
      
      <!-- Espaço livre aberto na lateral -->
      <path d="M ${pX + 10} ${pY + 5} Q 150 115 240 110" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
      <polygon points="245,110 237,106 238,114" fill="#10b981"/>

      <!-- Tag de legenda -->
      <text x="190" y="132" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#fca5a5" text-anchor="middle">
        🔒 LINHA DE PASSE CORTADA PELO DEFENSOR
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Zagueiro bloqueando passe em profundidade");
  }

  _renderFreeTeammate(pColor, rColor, options) {
    const isRight = options.side !== 'left';
    const pX = 70, pY = 75;
    const teamX = 260, teamY = isRight ? 35 : 105;
    const defX = 160, defY = isRight ? 85 : 55;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Linha de passe livre verde luminosa -->
      <line x1="${pX + 10}" y1="${pY}" x2="${teamX - 10}" y2="${teamY}" stroke="#10b981" stroke-width="3"/>
      <polygon points="${teamX - 12},${teamY} ${teamX - 22},${teamY - 5} ${teamX - 22},${teamY + 5}" fill="#10b981"/>
      
      <!-- Jogadores -->
      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 14, pY + 2)}
      ${this._drawPlayer(defX, defY, rColor, 'DEF', false)}
      ${this._drawPlayer(teamX, teamY, this.teammateColor, 'COMP', false, 'free')}
      
      <!-- Seta de projeção do companheiro -->
      <line x1="${teamX + 14}" y1="${teamY}" x2="${teamX + 50}" y2="${teamY + (isRight ? 10 : -10)}" stroke="#34d399" stroke-width="2" stroke-dasharray="3,2"/>
      <polygon points="${teamX + 54},${teamY + (isRight ? 11 : -11)} ${teamX + 46},${teamY + (isRight ? 6 : -16)} ${teamX + 48},${teamY + (isRight ? 16 : -6)}" fill="#34d399"/>

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        🟢 COMPANHEIRO LIVRE DESMARCADO NA ${isRight ? 'DIREITA' : 'ESQUERDA'}
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Companheiro livre para receber passe");
  }

  _renderSurrounded(pColor, rColor, options) {
    const pX = 170, pY = 65;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Cone de pressão vermelha -->
      <circle cx="${pX}" cy="${pY}" r="38" fill="url(#dangerGlow)"/>
      
      <!-- Setas de pressão convergindo -->
      <line x1="120" y1="40" x2="${pX - 12}" y2="${pY - 8}" stroke="#ef4444" stroke-width="2"/>
      <line x1="220" y1="40" x2="${pX + 12}" y2="${pY - 8}" stroke="#ef4444" stroke-width="2"/>
      <line x1="170" y1="110" x2="${pX}" y2="${pY + 14}" stroke="#ef4444" stroke-width="2"/>

      <!-- Jogador com a bola no centro -->
      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 10, pY + 8)}

      <!-- 3 Marcadores Pressionando -->
      ${this._drawPlayer(115, 35, rColor, 'DEF 1', false, 'danger')}
      ${this._drawPlayer(225, 35, rColor, 'DEF 2', false, 'danger')}
      ${this._drawPlayer(170, 115, rColor, 'VOL', false, 'danger')}

      <!-- Tag de alerta -->
      <text x="190" y="132" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#fca5a5" text-anchor="middle">
        🔴 PRESSÃO INTENSA: CERCADO POR 3 MARCADORES
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Jogador cercado por múltiplos adversários");
  }

  _render1v1Duel(pColor, rColor, options) {
    const pX = 110, pY = 70;
    const defX = 220, defY = 70;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Setas de opções de drible (esquerda / direita) -->
      <path d="M ${pX + 15} ${pY - 5} Q 165 30 ${defX + 35} ${pY - 25}" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
      <polygon points="${defX + 38},${pY - 25} ${defX + 28},${pY - 30} ${defX + 30},${pY - 20}" fill="#f59e0b"/>

      <path d="M ${pX + 15} ${pY + 5} Q 165 110 ${defX + 35} ${pY + 25}" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
      <polygon points="${defX + 38},${pY + 25} ${defX + 30},${pY + 20} ${defX + 28},${pY + 30}" fill="#f59e0b"/>

      <!-- Duelo Frontal -->
      <line x1="${pX + 14}" y1="${pY}" x2="${defX - 14}" y2="${defY}" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="2,2"/>
      
      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 14, pY + 2)}
      ${this._drawPlayer(defX, defY, rColor, 'DEF', false, 'danger')}

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fde68a" text-anchor="middle">
        🟡 CONFRONTO DIRETO 1 CONTRA 1
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Duelo direto 1 contra 1 com o defensor");
  }

  _renderGkAdvanced(pColor, rColor, options) {
    const pX = 70, pY = 70;
    const gkX = 250, gkY = 70;
    const goalX = 360;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Gol Desprotegido -->
      <rect x="${goalX}" y="40" width="8" height="60" fill="none" stroke="#ef4444" stroke-width="3"/>
      <line x1="${goalX}" y1="40" x2="375" y2="40" stroke="#ef4444" stroke-width="2"/>
      <line x1="${goalX}" y1="100" x2="375" y2="100" stroke="#ef4444" stroke-width="2"/>

      <!-- Trajetória de Cobertura por Cima -->
      <path d="M ${pX + 12} ${pY - 5} Q 190 10 ${goalX + 2} 55" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,3"/>
      <polygon points="${goalX},55 ${goalX - 8},47 ${goalX - 6},57" fill="#10b981"/>

      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 14, pY + 2)}
      
      <!-- Goleiro fora da área com indicador -->
      ${this._drawPlayer(gkX, gkY, '#f97316', 'GOL', false, 'danger')}
      <text x="${gkX}" y="${gkY - 20}" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#fdba74" text-anchor="middle">ADIANTADO!</text>

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        🟢 GOLEIRO FORA DA ÁREA — ESPAÇO PARA ENCOBRIR OU CHUTE RÁPIDO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Goleiro adiantado fora da pequena área");
  }

  _renderOpenSpace(pColor, rColor, options) {
    const pX = 60, pY = 70;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Faixa de aceleração verde brilhante -->
      <rect x="90" y="45" width="220" height="50" fill="url(#passGreenGlow)" rx="6"/>
      <line x1="90" y1="70" x2="290" y2="70" stroke="#34d399" stroke-width="2.5"/>
      <polygon points="300,70 288,64 288,76" fill="#34d399"/>

      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 16, pY + 2)}

      <!-- Defensores distantes -->
      ${this._drawPlayer(320, 35, rColor, 'DEF', false)}
      ${this._drawPlayer(320, 105, rColor, 'DEF', false)}

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        🟢 CORREDOR LIVRE PARA CONDUÇÃO EM VELOCIDADE
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Espaço livre à frente para avançar");
  }

  _renderCounterAttack(pColor, rColor, options) {
    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Vetores de contra-ataque rápido 3x2 -->
      <line x1="90" y1="40" x2="260" y2="35" stroke="#10b981" stroke-width="2"/>
      <line x1="70" y1="70" x2="250" y2="70" stroke="#10b981" stroke-width="2"/>
      <line x1="90" y1="100" x2="260" y2="105" stroke="#10b981" stroke-width="2"/>

      ${this._drawPlayer(70, 70, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(84, 72)}
      ${this._drawPlayer(95, 35, this.teammateColor, 'ATA', false, 'free')}
      ${this._drawPlayer(95, 105, this.teammateColor, 'PON', false, 'free')}

      <!-- Apenas 2 defensores na recomposição -->
      ${this._drawPlayer(260, 50, rColor, 'ZAG', false)}
      ${this._drawPlayer(260, 90, rColor, 'ZAG', false)}

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        🟢 CONTRA-ATAQUE RÁPIDO: SUPERIORIDADE NUMÉRICA
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Contra-ataque com superioridade numérica");
  }

  _renderCrossingWing(pColor, rColor, options) {
    const pX = 140, pY = 115;
    const goalX = 350, goalY = 65;

    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Arco de cruzamento para o miolo da área -->
      <path d="M ${pX} ${pY - 10} Q 250 120 300 65" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,3"/>
      <polygon points="303,63 294,59 295,69" fill="#f59e0b"/>

      <!-- Gol e Pequena Área -->
      <rect x="350" y="40" width="8" height="50" fill="none" stroke="#ffffff" stroke-width="2.5"/>

      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 12, pY - 5)}
      
      <!-- Atacante na área e Zagueiro -->
      ${this._drawPlayer(295, 55, this.teammateColor, 'CENT', false, 'free')}
      ${this._drawPlayer(315, 65, rColor, 'ZAG', false)}

      <text x="190" y="22" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fde68a" text-anchor="middle">
        🟡 BOLA ABERTA NA LINHA DE FUNDO — PREPARAR CRUZAMENTO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Preparando cruzamento da lateral");
  }

  _renderAerialDuel(pColor, rColor, options) {
    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Bola no Alto -->
      ${this._drawBall(190, 30)}
      
      <!-- Linhas de impulsão vertical -->
      <line x1="165" y1="85" x2="185" y2="40" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>
      <line x1="215" y1="85" x2="195" y2="40" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>

      ${this._drawPlayer(160, 85, pColor, 'VOCÊ', true, 'user')}
      ${this._drawPlayer(220, 85, rColor, 'ZAG', false, 'danger')}

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fde68a" text-anchor="middle">
        🟡 DISPUTA DE BOLA AÉREA PELO ALTO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Disputa aérea de cabeça");
  }

  _renderMidfieldPlaymaking(pColor, rColor, options) {
    const pX = 140, pY = 70;
    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Linhas de opções de passe para os dois lados -->
      <line x1="${pX + 12}" y1="${pY - 5}" x2="260" y2="35" stroke="#10b981" stroke-width="2"/>
      <line x1="${pX + 12}" y1="${pY + 5}" x2="260" y2="105" stroke="#10b981" stroke-width="2"/>
      <line x1="${pX + 12}" y1="${pY}" x2="280" y2="70" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>

      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(pX + 14, pY + 2)}

      ${this._drawPlayer(270, 35, this.teammateColor, 'PON D', false, 'free')}
      ${this._drawPlayer(270, 105, this.teammateColor, 'PON E', false, 'free')}
      ${this._drawPlayer(220, 70, rColor, 'VOL', false)}

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        🟢 CONTROLE DE MEIO-CAMPO: LEITURA E DISTRIBUIÇÃO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Armação no meio-campo");
  }

  _renderDefensiveIntervention(pColor, rColor, options) {
    const pX = 220, pY = 70;
    const rX = 140, rY = 70;
    const content = `
      ${this._renderPitchBackground()}
      
      <!-- Linha de desarme cortando o avanço -->
      <line x1="${rX + 14}" y1="${rY}" x2="${pX - 14}" y2="${pY}" stroke="#ef4444" stroke-width="2"/>
      <line x1="${pX - 5}" y1="${pY - 15}" x2="${pX - 5}" y2="${pY + 15}" stroke="#10b981" stroke-width="3"/>

      ${this._drawPlayer(pX, pY, pColor, 'VOCÊ', true, 'user')}
      ${this._drawPlayer(rX, rY, rColor, 'RIVAL', false, 'danger')}
      ${this._drawBall(rX + 14, rY + 2)}

      <text x="190" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fde68a" text-anchor="middle">
        🛡️ OPORTUNIDADE DE DESARME / INTERCEPTAÇÃO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Intervenção defensiva e bote");
  }

  // ==========================================================================
  // DESFECHOS E RESULTADOS (PÓS-AÇÃO)
  // ==========================================================================

  _renderGoalNet(pColor, options) {
    const content = `
      <rect width="380" height="140" fill="#064e3b" rx="8"/>
      
      <!-- Rede estufando com malha e bola no ângulo -->
      <g stroke="#ffffff" stroke-width="1.5" opacity="0.75">
        <line x1="160" y1="20" x2="340" y2="20"/>
        <line x1="160" y1="120" x2="340" y2="120"/>
        <line x1="160" y1="20" x2="160" y2="120"/>
        <line x1="340" y1="20" x2="340" y2="120"/>
        <!-- Malhas da rede -->
        <line x1="190" y1="20" x2="190" y2="120"/>
        <line x1="220" y1="20" x2="220" y2="120"/>
        <line x1="250" y1="20" x2="250" y2="120"/>
        <line x1="280" y1="20" x2="280" y2="120"/>
        <line x1="310" y1="20" x2="310" y2="120"/>
        <line x1="160" y1="45" x2="340" y2="45"/>
        <line x1="160" y1="70" x2="340" y2="70"/>
        <line x1="160" y1="95" x2="340" y2="95"/>
      </g>

      <!-- Bola balançando a rede no ângulo -->
      <circle cx="310" cy="45" r="14" fill="url(#ballShine)" stroke="#0f172a" stroke-width="2"/>
      
      <!-- Faíscas de celebração de GOL -->
      <text x="310" y="49" font-family="Inter, sans-serif" font-size="12" font-weight="black" fill="#0f172a" text-anchor="middle">⚽</text>
      <text x="90" y="75" font-family="Inter, sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle">
        GOOOL!
      </text>
      <text x="90" y="100" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#a7f3d0" text-anchor="middle">
        BOLA NA REDE
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Gol! Bola estufando a rede");
  }

  _renderBallPost(pColor, options) {
    const content = `
      <rect width="380" height="140" fill="#450a0a" rx="8"/>
      
      <!-- Trave e Travessão -->
      <rect x="220" y="20" width="14" height="100" fill="#ffffff" rx="2"/>
      <rect x="100" y="20" width="134" height="14" fill="#ffffff" rx="2"/>
      
      <!-- Impacto e ondas de choque no metal -->
      <circle cx="220" cy="25" r="22" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,2"/>
      <circle cx="220" cy="25" r="32" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6"/>

      <!-- Bola ricocheteando -->
      <circle cx="205" cy="40" r="12" fill="url(#ballShine)" stroke="#0f172a" stroke-width="1.5"/>
      
      <text x="80" y="70" font-family="Inter, sans-serif" font-size="24" font-weight="900" fill="#f87171" text-anchor="middle">
        NA TRAVE!
      </text>
      <text x="80" y="95" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fca5a5" text-anchor="middle">
        ESTALO METÁLICO NO POSTE
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Bola batendo na trave");
  }

  _renderGkSave(pColor, rColor, options) {
    const content = `
      <rect width="380" height="140" fill="#1e1b4b" rx="8"/>
      
      <!-- Trave ao fundo -->
      <rect x="280" y="20" width="8" height="100" fill="none" stroke="#ffffff" stroke-width="3"/>
      
      <!-- Goleiro voando e espalmando -->
      <g transform="translate(230, 45)">
        <ellipse cx="20" cy="20" rx="28" ry="12" fill="#f97316" transform="rotate(-25, 20, 20)"/>
        <!-- Luvas -->
        <circle cx="45" cy="5" r="8" fill="#ffffff" stroke="#000" stroke-width="1.5"/>
        <!-- Bola espalmada para fora -->
        <circle cx="58" cy="0" r="10" fill="url(#ballShine)" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="45" y1="5" x2="70" y2="-10" stroke="#facc15" stroke-width="2" stroke-dasharray="3,2"/>
      </g>

      <text x="90" y="70" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="#818cf8" text-anchor="middle">
        DEFESAÇA!
      </text>
      <text x="90" y="95" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#c7d2fe" text-anchor="middle">
        GOLEIRO ESPALMA PARA ESCANTEIO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Defesa espetacular do goleiro");
  }

  _renderShotBlockedOutcome(pColor, rColor, options) {
    const content = `
      <rect width="380" height="140" fill="#312e81" rx="8"/>
      
      <!-- Zagueiro travando o chute -->
      ${this._drawPlayer(190, 70, rColor, 'DEF', false, 'danger')}
      <!-- Bola desviada -->
      <line x1="120" y1="70" x2="175" y2="70" stroke="#f59e0b" stroke-width="3"/>
      <line x1="175" y1="70" x2="220" y2="25" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,2"/>
      ${this._drawBall(180, 70)}

      <text x="90" y="70" font-family="Inter, sans-serif" font-size="20" font-weight="900" fill="#f87171" text-anchor="middle">
        BLOQUEADO!
      </text>
      <text x="90" y="95" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#cbd5e1" text-anchor="middle">
        ZAGUEIRO TRAVOU A FINALIZAÇÃO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Finalização bloqueada pelo zagueiro");
  }

  _renderShotWide(pColor, options) {
    const content = `
      <rect width="380" height="140" fill="#1e293b" rx="8"/>
      
      <!-- Trave e Bola passando por fora -->
      <rect x="260" y="30" width="8" height="80" fill="none" stroke="#ffffff" stroke-width="3"/>
      
      <path d="M 80 85 Q 180 50 295 15" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="4,3"/>
      <circle cx="300" cy="12" r="10" fill="url(#ballShine)" stroke="#0f172a" stroke-width="1.5"/>

      <text x="90" y="65" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="#94a3b8" text-anchor="middle">
        PRA FORA!
      </text>
      <text x="90" y="90" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#cbd5e1" text-anchor="middle">
        CHUTE TIROU TINTA DA TRAVE
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Chute para fora");
  }

  _renderTackle(pColor, rColor, options) {
    const content = `
      <rect width="380" height="140" fill="#0f172a" rx="8"/>
      
      <!-- Rastro do carrinho na grama -->
      <line x1="140" y1="85" x2="220" y2="85" stroke="#22c55e" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
      ${this._drawPlayer(200, 80, pColor, 'DESARME', false)}
      ${this._drawBall(225, 75)}

      <text x="80" y="65" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="#4ade80" text-anchor="middle">
        DESARME LIMPO!
      </text>
      <text x="80" y="90" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#bbf7d0" text-anchor="middle">
        CARRINHO PERFEITO NA BOLA
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Carrinho e desarme preciso");
  }

  _renderInterception(pColor, rColor, options) {
    const content = `
      <rect width="380" height="140" fill="#1e1b4b" rx="8"/>
      
      <line x1="100" y1="90" x2="260" y2="40" stroke="#f87171" stroke-width="2" stroke-dasharray="4,4"/>
      ${this._drawPlayer(180, 65, rColor, 'INT', false, 'danger')}
      ${this._drawBall(182, 50)}

      <text x="80" y="65" font-family="Inter, sans-serif" font-size="20" font-weight="900" fill="#f87171" text-anchor="middle">
        INTERCEPTADO!
      </text>
      <text x="80" y="90" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fecaca" text-anchor="middle">
        LEITURA DEFENSIVA DO ADVERSÁRIO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Passe interceptado");
  }

  _renderDribbleSuccess(pColor, rColor, options) {
    const content = `
      <rect width="380" height="140" fill="#042f2e" rx="8"/>
      
      <!-- Finta desconcertante -->
      <path d="M 120 70 Q 180 20 240 70" fill="none" stroke="#2dd4bf" stroke-width="3"/>
      ${this._drawPlayer(240, 70, pColor, 'VOCÊ', true, 'user')}
      ${this._drawBall(255, 72)}
      ${this._drawPlayer(180, 75, rColor, 'DEF', false)}

      <text x="80" y="65" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="#2dd4bf" text-anchor="middle">
        DRIBLE ESPETACULAR!
      </text>
      <text x="80" y="90" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#99f6e4" text-anchor="middle">
        FINTA DEIXOU O MARCADOR PRA TRÁS
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Drible bem-sucedido");
  }

  _renderFoulCard(pColor, rColor, options) {
    const isRed = options.card === 'red';
    const content = `
      <rect width="380" height="140" fill="#18181b" rx="8"/>
      
      <!-- Cartão Amarelo ou Vermelho do Árbitro -->
      <rect x="220" y="30" width="36" height="52" rx="4" fill="${isRed ? '#dc2626' : '#facc15'}" stroke="#ffffff" stroke-width="2"/>
      
      <!-- Apito -->
      <text x="180" y="65" font-family="Inter, sans-serif" font-size="26">📢</text>

      <text x="90" y="65" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="${isRed ? '#f87171' : '#fde047'}" text-anchor="middle">
        ${isRed ? 'CARTÃO VERMELHO' : 'FALTA MARCADA'}
      </text>
      <text x="90" y="90" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#d4d4d8" text-anchor="middle">
        ÁRBITRO PARALISA O JOGO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Falta e advertência do árbitro");
  }

  _renderInjury(pColor, options) {
    const content = `
      <rect width="380" height="140" fill="#27272a" rx="8"/>
      
      <!-- Cruz médica e atendimento no chão -->
      <g transform="translate(220, 45)">
        <circle cx="25" cy="25" r="24" fill="#dc2626"/>
        <rect x="21" y="10" width="8" height="30" fill="#ffffff" rx="2"/>
        <rect x="10" y="21" width="30" height="8" fill="#ffffff" rx="2"/>
      </g>

      <text x="100" y="65" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="#f87171" text-anchor="middle">
        LESÃO DETECTADA!
      </text>
      <text x="100" y="90" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#fca5a5" text-anchor="middle">
        EQUIPE MÉDICA EM CAMPO
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Atendimento médico por lesão");
  }

  // ==========================================================================
  // CENÁRIOS EXTRACAMPO & ATIVIDADES
  // ==========================================================================

  _renderPartyNightclub() {
    const content = `
      <rect width="380" height="140" fill="#2e1065" rx="8"/>
      
      <!-- Luzes de balada e silhuetas -->
      <circle cx="100" cy="20" r="40" fill="#c084fc" opacity="0.4"/>
      <circle cx="280" cy="20" r="50" fill="#f43f5e" opacity="0.4"/>
      
      <text x="190" y="55" font-family="Inter, sans-serif" font-size="32" text-anchor="middle">🎉 🍸 🎵</text>
      
      <text x="190" y="95" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#f5d0fe" text-anchor="middle">
        VIDA NOTURNA & FESTA
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#e9d5ff" text-anchor="middle">
        Diversão com risco de repercussão na imprensa
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Balada e vida noturna");
  }

  _renderExtraTraining(pColor) {
    const content = `
      <rect width="380" height="140" fill="#064e3b" rx="8"/>
      
      <!-- Cones de treino -->
      <polygon points="120,75 110,95 130,95" fill="#f97316"/>
      <polygon points="180,75 170,95 190,95" fill="#f97316"/>
      <polygon points="240,75 230,95 250,95" fill="#f97316"/>

      ${this._drawBall(270, 90)}

      <text x="190" y="45" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#6ee7b7" text-anchor="middle">
        TREINO EXTRA INDIVIDUAL
      </text>
      <text x="190" y="125" font-family="Inter, sans-serif" font-size="11" fill="#a7f3d0" text-anchor="middle">
        Aprimoramento técnico e finalizações após o expediente
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Treino extra no campo com cones");
  }

  _renderGymFitness(pColor) {
    const content = `
      <rect width="380" height="140" fill="#1c1917" rx="8"/>
      
      <!-- Halteres e peso -->
      <g transform="translate(140, 30)">
        <rect x="0" y="15" width="100" height="8" fill="#a8a29e" rx="2"/>
        <rect x="10" y="0" width="12" height="38" fill="#44403c" rx="3"/>
        <rect x="78" y="0" width="12" height="38" fill="#44403c" rx="3"/>
      </g>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#fb923c" text-anchor="middle">
        ACADEMIA & PREPARAÇÃO FÍSICA
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#fed7aa" text-anchor="middle">
        Ganho de força, impulsão e resistência muscular
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Treinamento físico na academia");
  }

  _renderTacticalBoard() {
    const content = `
      <rect width="380" height="140" fill="#0f172a" rx="8"/>
      
      <!-- Prancheta tática e esquema -->
      <rect x="130" y="20" width="120" height="70" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="4"/>
      <circle cx="160" cy="45" r="5" fill="#3b82f6"/>
      <circle cx="220" cy="65" r="5" fill="#ef4444"/>
      <line x1="160" y1="45" x2="210" y2="60" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2"/>

      <text x="190" y="112" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#93c5fd" text-anchor="middle">
        ANÁLISE DE VÍDEO & PRANCHETA TÁTICA
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Estudo de prancheta e vídeo tático");
  }

  _renderCoachTalk(pColor) {
    const content = `
      <rect width="380" height="140" fill="#1e293b" rx="8"/>
      
      <!-- Silhuetas de Treinador e Jogador conversando -->
      <text x="190" y="60" font-family="Inter, sans-serif" font-size="34" text-anchor="middle">👔 💬 🏃</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#e2e8f0" text-anchor="middle">
        CONVERSA COM O COMANDANTE
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">
        Alinhamento tático, minutagem e cobranças individuais
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Conversa individual com treinador");
  }

  _renderLockerDispute(pColor) {
    const content = `
      <rect width="380" height="140" fill="#3f1d2e" rx="8"/>
      
      <text x="190" y="60" font-family="Inter, sans-serif" font-size="32" text-anchor="middle">⚡ 👥 🗯️</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#fca5a5" text-anchor="middle">
        DISCUSSÃO NO VESTIÁRIO
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#fecaca" text-anchor="middle">
        Conflito interno de egos e química do elenco
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Discussão acalorada no vestiário");
  }

  _renderPressConference(pColor) {
    const content = `
      <rect width="380" height="140" fill="#09090b" rx="8"/>
      
      <!-- Microfones de imprensa e flashes -->
      <text x="190" y="55" font-family="Inter, sans-serif" font-size="30" text-anchor="middle">🎙️ 📸 📹 🎤</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#f4f4f5" text-anchor="middle">
        COLETIVA DE IMPRENSA & MÍDIA
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#a1a1aa" text-anchor="middle">
        Declarações com impacto direto na reputação
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Coletiva de imprensa com microfones");
  }

  _renderFansAutograph(pColor) {
    const content = `
      <rect width="380" height="140" fill="#14532d" rx="8"/>
      
      <text x="190" y="55" font-family="Inter, sans-serif" font-size="30" text-anchor="middle">✍️ 🤳 👕 👏</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#86efac" text-anchor="middle">
        INTERAÇÃO COM A TORCIDA
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#bbf7d0" text-anchor="middle">
        Autógrafos, fotos e carinho dos fãs
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Interação com fãs e autógrafos");
  }

  _renderContractSigning() {
    const content = `
      <rect width="380" height="140" fill="#172554" rx="8"/>
      
      <!-- Contrato com caneta dourada -->
      <rect x="150" y="20" width="80" height="60" fill="#f8fafc" rx="3"/>
      <line x1="160" y1="35" x2="210" y2="35" stroke="#94a3b8" stroke-width="2"/>
      <line x1="160" y1="45" x2="220" y2="45" stroke="#94a3b8" stroke-width="2"/>
      <line x1="160" y1="60" x2="195" y2="60" stroke="#3b82f6" stroke-width="2"/>

      <text x="190" y="105" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#93c5fd" text-anchor="middle">
        ASSINATURA DE CONTRATO PROFISSIONAL
      </text>
      <text x="190" y="125" font-family="Inter, sans-serif" font-size="11" fill="#bfdbfe" text-anchor="middle">
        Vínculo salarial, multas rescisórias e metas
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Assinatura de contrato");
  }

  _renderTransfer() {
    const content = `
      <rect width="380" height="140" fill="#18181b" rx="8"/>
      
      <text x="190" y="55" font-family="Inter, sans-serif" font-size="32" text-anchor="middle">✈️ 🧳 🏟️</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">
        TRANSFERÊNCIA & NOVO DESAFIO
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#bae6fd" text-anchor="middle">
        Mudança de clube e adaptação a uma nova casa
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Transferência internacional ou nacional");
  }

  _renderPhysioRecovery(pColor) {
    const content = `
      <rect width="380" height="140" fill="#0c4a6e" rx="8"/>
      
      <text x="190" y="55" font-family="Inter, sans-serif" font-size="30" text-anchor="middle">🩺 🧊 🩹 💆</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#38bdf8" text-anchor="middle">
        FISIOTERAPIA & RECUPERAÇÃO
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#7dd3fc" text-anchor="middle">
        Tratamento médico para regeneração muscular
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Fisioterapia e departamento médico");
  }

  _renderTrophyAward() {
    const content = `
      <rect width="380" height="140" fill="#451a03" rx="8"/>
      
      <text x="190" y="55" font-family="Inter, sans-serif" font-size="36" text-anchor="middle">🏆 ✨ 🥇</text>

      <text x="190" y="95" font-family="Inter, sans-serif" font-size="16" font-weight="900" fill="#facc15" text-anchor="middle">
        PREMIAÇÃO & CONSAGRAÇÃO
      </text>
      <text x="190" y="120" font-family="Inter, sans-serif" font-size="11" fill="#fef08a" text-anchor="middle">
        Conquista de título ou premiação individual de ouro
      </text>
    `;
    return this._svgContainer(content, "0 0 380 140", "Premiação e troféu");
  }

  _renderGenericMatchScene(pColor, rColor, options) {
    return this._renderMidfieldPlaymaking(pColor, rColor, options);
  }
}

// Instância global do motor de visualização
window.visualEngine = new VisualEngine();
