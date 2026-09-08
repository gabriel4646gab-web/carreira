// Tela de Criação de Personagem (Jogador ou Técnico)
class CreationView {
  static render(container) {
    container.innerHTML = `
      <div class="creation-container">
        <div class="creation-hero">
          <div class="hero-badge"><i class="fa-solid fa-trophy"></i> SIMULADOR DE CARREIRA PROFISSIONAL</div>
          <h1 class="hero-title">Construa seu Legado no Futebol</h1>
          <p class="hero-subtitle">Viva cada decisão, vitória, transferência e desafio em uma simulação profunda e realista.</p>
        </div>

        <div class="mode-selector-grid">
          <div class="mode-card active" id="modeCardPlayer" onclick="CreationView.selectMode('player')">
            <div class="mode-icon"><i class="fa-solid fa-person-running"></i></div>
            <div class="mode-info">
              <h3>Carreira de Jogador</h3>
              <p>Comece como uma jovem promessa da base, evolua seus atributos, treine duro, decida partidas e busque a glória mundial.</p>
            </div>
            <div class="mode-check"><i class="fa-solid fa-circle-check"></i></div>
          </div>

          <div class="mode-card" id="modeCardManager" onclick="CreationView.selectMode('manager')">
            <div class="mode-icon"><i class="fa-solid fa-clipboard-user"></i></div>
            <div class="mode-info">
              <h3>Carreira de Técnico</h3>
              <p>Comande a prancheta, defina formações táticas, comande o vestiário, contrate reforços e leve seu clube ao topo.</p>
            </div>
            <div class="mode-check"><i class="fa-regular fa-circle"></i></div>
          </div>
        </div>

        <div class="creation-card" id="creationFormCard">
          <!-- Formulário dinâmico carregado via JS -->
        </div>
      </div>
    `;

    this.selectedMode = 'player';
    this.renderForm();
  }

  static selectMode(mode) {
    this.selectedMode = mode;
    const cardP = document.getElementById('modeCardPlayer');
    const cardM = document.getElementById('modeCardManager');

    if (mode === 'player') {
      cardP.classList.add('active');
      cardP.querySelector('.mode-check i').className = 'fa-solid fa-circle-check';
      cardM.classList.remove('active');
      cardM.querySelector('.mode-check i').className = 'fa-regular fa-circle';
    } else {
      cardM.classList.add('active');
      cardM.querySelector('.mode-check i').className = 'fa-solid fa-circle-check';
      cardP.classList.remove('active');
      cardP.querySelector('.mode-check i').className = 'fa-regular fa-circle';
    }

    this.renderForm();
  }

  static renderForm() {
    const formCard = document.getElementById('creationFormCard');
    if (!formCard) return;

    if (this.selectedMode === 'player') {
      const startingClubs = getClubsForStartingCareer(64, 18, 'Brasil');

      formCard.innerHTML = `
        <div class="card-header">
          <h2><i class="fa-solid fa-id-card"></i> Ficha da Promessa</h2>
          <span class="badge badge-primary">Modo Jogador</span>
        </div>
        <form id="formNewPlayer" onsubmit="CreationView.handlePlayerSubmit(event)">
          <div class="form-grid">
            <div class="form-group">
              <label><i class="fa-solid fa-user"></i> Nome Completo / Apelido</label>
              <input type="text" id="pName" class="form-control" value="Gabriel Menino Jr." required maxlength="30" />
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-cake-candles"></i> Idade Inicial</label>
              <select id="pAge" class="form-control">
                <option value="17" selected>17 anos (Jovem Promessa)</option>
                <option value="18">18 anos (Estreante)</option>
                <option value="19">19 anos</option>
                <option value="20">20 anos</option>
                <option value="21">21 anos</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-flag"></i> Nacionalidade</label>
              <select id="pNat" class="form-control">
                <option value="Brasil" selected>Brasil 🇧🇷</option>
                <option value="Argentina">Argentina 🇦🇷</option>
                <option value="Portugal">Portugal 🇵🇹</option>
                <option value="Espanha">Espanha 🇪🇸</option>
                <option value="Inglaterra">Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
                <option value="França">França 🇫🇷</option>
                <option value="Alemanha">Alemanha 🇩🇪</option>
                <option value="Itália">Itália 🇮🇹</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-crosshairs"></i> Posição Principal</label>
              <select id="pPos" class="form-control">
                <option value="Centroavante" selected>Centroavante (CA)</option>
                <option value="Ponta-direita">Ponta-direita (PD)</option>
                <option value="Ponta-esquerda">Ponta-esquerda (PE)</option>
                <option value="Meia-atacante">Meia-atacante (MEI)</option>
                <option value="Meia">Meia Central (MC)</option>
                <option value="Volante">Volante (VOL)</option>
                <option value="Lateral-direito">Lateral-direito (LD)</option>
                <option value="Lateral-esquerdo">Lateral-esquerdo (LE)</option>
                <option value="Zagueiro">Zagueiro (ZAG)</option>
                <option value="Goleiro">Goleiro (GOL)</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-shoe-prints"></i> Pé Dominante</label>
              <select id="pFoot" class="form-control">
                <option value="Direito" selected>Destro (Pé Direito)</option>
                <option value="Canhoto">Canhoto (Pé Esquerdo)</option>
                <option value="Ambidestro">Ambidestro (Ambos os Pés)</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-ruler-vertical"></i> Altura e Peso</label>
              <div class="input-inline">
                <input type="number" id="pHeight" class="form-control" value="182" min="160" max="205" placeholder="Altura (cm)" />
                <input type="number" id="pWeight" class="form-control" value="76" min="55" max="105" placeholder="Peso (kg)" />
              </div>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-bolt"></i> Estilo de Jogo</label>
              <select id="pStyle" class="form-control">
                <option value="Veloz e Incisivo" selected>Veloz e Incisivo</option>
                <option value="Técnico e Armador">Técnico e Armador</option>
                <option value="Físico e Imponente">Físico e Imponente</option>
                <option value="Goleador Oportunista">Goleador Oportunista</option>
                <option value="Marcador Incansável">Marcador Incansável</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-shield-halved"></i> Clube Inicial (Base/Acesso)</label>
              <select id="pClub" class="form-control">
                ${startingClubs.map(c => `
                  <option value="${c.id}">${c.name} (${c.league} - OVR ${c.ovr})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-play"></i> Iniciar Carreira Profissional
            </button>
          </div>
        </form>
      `;
    } else {
      // Formulário do Técnico
      const managerClubs = CLUBS_DATA.filter(c => c.tier >= 2 || (c.country === 'Brasil' && c.ovr <= 75));

      formCard.innerHTML = `
        <div class="card-header">
          <h2><i class="fa-solid fa-clipboard-list"></i> Prancheta do Comandante</h2>
          <span class="badge badge-success">Modo Técnico</span>
        </div>
        <form id="formNewManager" onsubmit="CreationView.handleManagerSubmit(event)">
          <div class="form-grid">
            <div class="form-group">
              <label><i class="fa-solid fa-user-tie"></i> Nome do Treinador</label>
              <input type="text" id="mName" class="form-control" value="Prof. Rogério Menezes" required maxlength="30" />
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-cake-candles"></i> Idade</label>
              <input type="number" id="mAge" class="form-control" value="44" min="30" max="75" />
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-flag"></i> Nacionalidade</label>
              <select id="mNat" class="form-control">
                <option value="Brasil" selected>Brasil 🇧🇷</option>
                <option value="Portugal">Portugal 🇵🇹</option>
                <option value="Argentina">Argentina 🇦🇷</option>
                <option value="Espanha">Espanha 🇪🇸</option>
                <option value="Itália">Itália 🇮🇹</option>
                <option value="Alemanha">Alemanha 🇩🇪</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-chess-board"></i> Filosofia de Jogo Principal</label>
              <select id="mPhil" class="form-control">
                <option value="Posse de Bola Envolvente" selected>Posse de Bola Envolvente (Tiki-Taka)</option>
                <option value="Contra-ataque Fulminante">Contra-ataque Fulminante</option>
                <option value="Pressão Alta Asfixiante (Gegenpressing)">Pressão Alta Asfixiante (Gegenpressing)</option>
                <option value="Jogo Direto e Físico">Jogo Direto e Físico</option>
                <option value="Solidez Defensiva e Retranca">Solidez Defensiva e Retranca</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-diagram-project"></i> Esquema Tático Preferido</label>
              <select id="mForm" class="form-control">
                <option value="4-3-3" selected>4-3-3 Ofensivo</option>
                <option value="4-2-3-1">4-2-3-1 Equilibrado</option>
                <option value="4-4-2">4-4-2 Clássico</option>
                <option value="3-5-2">3-5-2 com Alas</option>
                <option value="5-3-2">5-3-2 Linha de Cinco</option>
              </select>
            </div>

            <div class="form-group">
              <label><i class="fa-solid fa-certificate"></i> Licença Inicial</label>
              <select id="mLic" class="form-control">
                <option value="Licença B Nacional" selected>Licença B Nacional (Iniciante Promissor)</option>
                <option value="Licença A CONMEBOL / UEFA">Licença A Continental</option>
                <option value="Licença PRO Internacional">Licença PRO Internacional</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label><i class="fa-solid fa-shield-halved"></i> Clube de Estreia</label>
              <select id="mClub" class="form-control">
                ${managerClubs.map(c => `
                  <option value="${c.id}">${c.name} (${c.league} - OVR ${c.ovr})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-success btn-lg">
              <i class="fa-solid fa-play"></i> Assumir Comando Técnico
            </button>
          </div>
        </form>
      `;
    }
  }

  static handlePlayerSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('pName').value.trim() || 'Gabriel Silva';
    const age = parseInt(document.getElementById('pAge').value) || 18;
    const nationality = document.getElementById('pNat').value;
    const position = document.getElementById('pPos').value;
    const dominantFoot = document.getElementById('pFoot').value;
    const height = parseInt(document.getElementById('pHeight').value) || 180;
    const weight = parseInt(document.getElementById('pWeight').value) || 75;
    const style = document.getElementById('pStyle').value;
    const clubId = document.getElementById('pClub').value;

    const initialOvr = 63 + Math.floor(Math.random() * 4); // 63-66 inicial realista
    const initialAttrs = generateInitialAttributes(position, style, initialOvr);
    const calculatedOvr = calculateOverall(initialAttrs, position);
    const startWage = calculateWeeklyWage(calculatedOvr, age, getClubById(clubId).tier);
    const startValue = calculateMarketValue(calculatedOvr, age, position);

    const career = new Career({
      type: 'player',
      player: {
        name,
        age,
        nationality,
        position,
        dominantFoot,
        height,
        weight,
        style,
        clubId,
        attributes: initialAttrs,
        initialOvr: calculatedOvr,
        weeklyWage: startWage,
        marketValue: startValue
      }
    });

    // Inicia tabela e calendário da liga
    SeasonEngine.initLeagueTable(career);

    // Registra primeira notícia
    const club = career.getCurrentClub();
    career.addNews(`PROMESSA NA ÁREA: O jovem ${position.toLowerCase()} ${name} assina seu primeiro vínculo profissional com o ${club.name}!`, 'Apresentação');

    // Inicializa a aplicação com a nova carreira
    window.uiManager.setCareer(career);
    window.uiManager.switchView('dashboard');
    window.uiManager.showToast('Carreira Iniciada!', `Bem-vindo ao ${club.name}, ${name}! Boa sorte na sua trajetória.`, 'success');
  }

  static handleManagerSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('mName').value.trim() || 'Treinador';
    const age = parseInt(document.getElementById('mAge').value) || 45;
    const nationality = document.getElementById('mNat').value;
    const philosophy = document.getElementById('mPhil').value;
    const favoriteFormation = document.getElementById('mForm').value;
    const license = document.getElementById('mLic').value;
    const clubId = document.getElementById('mClub').value;
    const club = getClubById(clubId);

    const career = new Career({
      type: 'manager',
      manager: {
        name,
        age,
        nationality,
        philosophy,
        favoriteFormation,
        license,
        clubId,
        transferBudget: club.budget,
        weeklySalary: 18000
      }
    });

    SeasonEngine.initLeagueTable(career);
    career.addNews(`NOVO COMANDANTE: ${name} é apresentado oficialmente no comando técnico do ${club.name}!`, 'Apresentação');

    window.uiManager.setCareer(career);
    window.uiManager.switchView('dashboard');
    window.uiManager.showToast('Comando Assumido!', `Você é o novo técnico do ${club.name}. Bons trabalhos!`, 'success');
  }
}
