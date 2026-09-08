// Tela de Treinamentos, Desenvolvimento e Gestão de Condicionamento
class TrainingView {
  static render(container, career) {
    if (!career) return;
    const isPlayer = career.type === 'player';

    if (!isPlayer) {
      container.innerHTML = `
        <div class="dash-card">
          <div class="card-header">
            <h2><i class="fa-solid fa-clipboard-list"></i> Sessão de Treinamento da Equipe</h2>
          </div>
          <div class="card-body">
            <p>Selecione a diretriz dos treinos coletivos da semana para o elenco:</p>
            <div class="training-options-grid">
              <div class="training-card" onclick="TrainingView.handleManagerTrain('Tática e Posicionamento')">
                <div class="train-icon"><i class="fa-solid fa-chess"></i></div>
                <h4>Tática e Posicionamento</h4>
                <p>Melhora a coesão defensiva e a disciplina em campo.</p>
                <button class="btn btn-outline btn-block">Aplicar Treino</button>
              </div>

              <div class="training-card" onclick="TrainingView.handleManagerTrain('Finalização e Pressão Alta')">
                <div class="train-icon"><i class="fa-solid fa-bullseye"></i></div>
                <h4>Finalização e Pressão Alta</h4>
                <p>Foco na eficácia ofensiva e recuperação rápida da posse.</p>
                <button class="btn btn-outline btn-block">Aplicar Treino</button>
              </div>

              <div class="training-card" onclick="TrainingView.handleManagerTrain('Recuperação Física Coletiva')">
                <div class="train-icon"><i class="fa-solid fa-bed"></i></div>
                <h4>Recuperação Física</h4>
                <p>Reduz o desgaste físico do elenco para a próxima partida.</p>
                <button class="btn btn-outline btn-block">Aplicar Treino</button>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const p = career.player;

    container.innerHTML = `
      <div class="training-header-card">
        <div class="train-status-hero">
          <div class="train-status-item">
            <span class="lbl">Energia / Fôlego</span>
            <strong class="${p.fitness > 70 ? 'text-success' : 'text-danger'}">${p.fitness}%</strong>
          </div>
          <div class="train-status-item">
            <span class="lbl">Fadiga Muscular</span>
            <strong class="${p.fatigue > 70 ? 'text-danger' : 'text-success'}">${p.fatigue}%</strong>
          </div>
          <div class="train-status-item">
            <span class="lbl">Risco de Lesão</span>
            <strong class="${p.fatigue > 75 ? 'text-danger' : 'text-muted'}">${p.fatigue > 75 ? 'ALTO (Cuidado!)' : p.fatigue > 50 ? 'Moderado' : 'Baixo'}</strong>
          </div>
        </div>
      </div>

      <div class="dash-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-dumbbell"></i> Escolha seu Treinamento da Semana</h2>
          <span class="badge badge-info">Semana ${career.currentWeek}</span>
        </div>
        <div class="card-body">
          <p class="text-muted" style="margin-bottom: 20px;">
            Cada sessão aprimora atributos específicos, mas gera fadiga. O excesso de treinamento contínuo sem descanso pode provocar lesões musculares severas!
          </p>

          <div class="training-options-grid">
            <div class="training-card" onclick="TrainingView.executePlayerTraining('Foco em Finalização e Ataque')">
              <div class="train-icon"><i class="fa-solid fa-bullseye"></i></div>
              <h4>Finalização & Ataque</h4>
              <p>Trabalha precisão nos chutes, chutes de fora da área e posicionamento.</p>
              <div class="train-meta">
                <span class="badge badge-success">+Finalização</span>
                <span class="badge badge-warning">+12% Fadiga</span>
              </div>
              <button class="btn btn-primary btn-block">Treinar</button>
            </div>

            <div class="training-card" onclick="TrainingView.executePlayerTraining('Foco em Físico e Força')">
              <div class="train-icon"><i class="fa-solid fa-dumbbell"></i></div>
              <h4>Físico & Força</h4>
              <p>Musculação e resistência aeróbica pesada no CT.</p>
              <div class="train-meta">
                <span class="badge badge-success">+Força / Stamina</span>
                <span class="badge badge-danger">+15% Fadiga</span>
              </div>
              <button class="btn btn-primary btn-block">Treinar</button>
            </div>

            <div class="training-card" onclick="TrainingView.executePlayerTraining('Velocidade e Aceleração')">
              <div class="train-icon"><i class="fa-solid fa-bolt"></i></div>
              <h4>Velocidade & Sprints</h4>
              <p>Trabalho de tiros curtos, explosão e agilidade.</p>
              <div class="train-meta">
                <span class="badge badge-success">+Velocidade</span>
                <span class="badge badge-warning">+14% Fadiga</span>
              </div>
              <button class="btn btn-primary btn-block">Treinar</button>
            </div>

            <div class="training-card" onclick="TrainingView.executePlayerTraining('Passe e Visão de Jogo')">
              <div class="train-icon"><i class="fa-solid fa-diagram-project"></i></div>
              <h4>Passe & Criação</h4>
              <p>Aprimoramento de lançamentos, passes curtos e visão espacial.</p>
              <div class="train-meta">
                <span class="badge badge-success">+Passes / Visão</span>
                <span class="badge badge-info">+10% Fadiga</span>
              </div>
              <button class="btn btn-primary btn-block">Treinar</button>
            </div>

            <div class="training-card" onclick="TrainingView.executePlayerTraining('Drible e Habilidade Técnica')">
              <div class="train-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
              <h4>Drible & Controle</h4>
              <p>Exercícios de condução em espaço reduzido e primeiro toque.</p>
              <div class="train-meta">
                <span class="badge badge-success">+Drible / Domínio</span>
                <span class="badge badge-info">+11% Fadiga</span>
              </div>
              <button class="btn btn-primary btn-block">Treinar</button>
            </div>

            <div class="training-card" onclick="TrainingView.executePlayerTraining('Defesa e Marcação')">
              <div class="train-icon"><i class="fa-solid fa-shield"></i></div>
              <h4>Defesa & Desarme</h4>
              <p>Combates no mano a mano, interceptações e posicionamento defensivo.</p>
              <div class="train-meta">
                <span class="badge badge-success">+Desarme / Marcação</span>
                <span class="badge badge-warning">+12% Fadiga</span>
              </div>
              <button class="btn btn-primary btn-block">Treinar</button>
            </div>

            ${p.position === 'Goleiro' ? `
              <div class="training-card" onclick="TrainingView.executePlayerTraining('Treino de Goleiro')">
                <div class="train-icon"><i class="fa-solid fa-hands"></i></div>
                <h4>Fundamentos de Goleiro</h4>
                <p>Reflexos à queima-roupa, saídas de gol e pegada firme.</p>
                <div class="train-meta">
                  <span class="badge badge-success">+Reflexos / Defesa</span>
                  <span class="badge badge-warning">+12% Fadiga</span>
                </div>
                <button class="btn btn-primary btn-block">Treinar</button>
              </div>
            ` : ''}

            <!-- DESCANSO E FISIOTERAPIA -->
            <div class="training-card highlight-card" onclick="TrainingView.executePlayerTraining('Descanso e Recuperação')">
              <div class="train-icon"><i class="fa-solid fa-bed"></i></div>
              <h4>Descanso Completo</h4>
              <p>Dia livre para descanso total e regeneração da musculatura.</p>
              <div class="train-meta">
                <span class="badge badge-success">-35% Fadiga</span>
                <span class="badge badge-info">+30% Energia</span>
              </div>
              <button class="btn btn-secondary btn-block">Descansar</button>
            </div>

            <div class="training-card highlight-card" onclick="TrainingView.executePlayerTraining('Fisioterapia Preventiva')">
              <div class="train-icon"><i class="fa-solid fa-spa"></i></div>
              <h4>Fisioterapia / DM</h4>
              <p>Sessão de massagem desportiva, banho de gelo e alívio de dores.</p>
              <div class="train-meta">
                <span class="badge badge-success">Recupera Lesões</span>
                <span class="badge badge-info">-20% Fadiga</span>
              </div>
              <button class="btn btn-secondary btn-block">Fisioterapia</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static executePlayerTraining(trainingType) {
    const career = window.uiManager.activeCareer;
    if (!career || career.type !== 'player') return;

    const res = career.player.train(trainingType);
    if (!res.success) {
      window.uiManager.showToast('Aviso', res.message, 'warning');
      return;
    }

    StorageManager.saveCareer(career);
    window.uiManager.updateHeaderAndSidebar();
    TrainingView.render(document.getElementById('mainContentArea'), career);

    if (res.report.injuryHappened) {
      window.uiManager.showToast('⚠️ LESÃO SOFRIDA!', `Você sofreu uma lesão: ${res.report.injuryHappened.name}! Desfalcará o time por ${res.report.injuryHappened.weeksRemaining} semanas.`, 'danger');
      career.addNews(`DM: ${career.player.name} sofreu ${res.report.injuryHappened.name} no treinamento e está fora dos gramados.`, 'Departamento Médico');
    } else {
      window.uiManager.showToast('Treinamento Concluído!', `Sessão de ${trainingType} finalizada com sucesso.`, 'success');
    }
  }

  static handleManagerTrain(trainingName) {
    const career = window.uiManager.activeCareer;
    if (!career || career.type !== 'manager') return;

    career.manager.squadMorale = Math.min(100, career.manager.squadMorale + 4);
    StorageManager.saveCareer(career);
    window.uiManager.showToast('Treino Aplicado', `O elenco realizou a sessão de ${trainingName}.`, 'success');
  }
}
