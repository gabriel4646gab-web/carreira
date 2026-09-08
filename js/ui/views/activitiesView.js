// Tela de Atividades Extracampo e Vida Profissional
class ActivitiesView {
  static render(container, career) {
    if (!career) return;
    const isPlayer = career.type === 'player';
    const entity = isPlayer ? career.player : career.manager;

    container.innerHTML = `
      <div class="activities-container">
        <!-- HEADER DA SEMANA -->
        <div class="dash-card activities-hero-card">
          <div class="card-header">
            <div>
              <span class="badge badge-info">Semana ${career.currentWeek} • ${career.seasonName}</span>
              <h2><i class="fa-solid fa-mug-hot"></i> Vida Fora das Quatro Linhas & Atividades</h2>
            </div>
            <div class="activities-status-pills">
              <span class="badge ${isPlayer && entity.energy < 40 ? 'badge-danger' : 'badge-success'}">
                <i class="fa-solid fa-bolt"></i> Energia: ${isPlayer ? entity.fitness : 100}%
              </span>
              <span class="badge badge-primary">
                <i class="fa-solid fa-heart"></i> Moral: ${entity.morale || entity.squadMorale}%
              </span>
            </div>
          </div>
          <p class="text-muted">
            O futebol profissional não termina quando o árbitro apita o fim do treino. Suas decisões extracampo moldam seu físico, inteligência tática, liderança no vestiário e reputação perante a imprensa e a torcida!
          </p>
        </div>

        <div class="activities-grid-layout" style="margin-top: 24px;">
          <!-- 1. ESTUDO TÁTICO -->
          <div class="dash-card activity-card" onclick="ActivitiesView.handleActivity('tactics')">
            <div class="act-icon bg-info-soft"><i class="fa-solid fa-tablet-screen-button text-info"></i></div>
            <div class="act-details">
              <h3>Estudo Tático de Vídeos</h3>
              <p>Analise 45 minutos de vídeos do próximo adversário para identificar pontos fracos na zaga e no goleiro.</p>
              <div class="act-rewards">
                <span class="badge badge-success">+Inteligência Tática</span>
                <span class="badge badge-info">+Visão</span>
              </div>
            </div>
            <button class="btn btn-primary btn-sm">Estudar Adversário</button>
          </div>

          <!-- 2. TREINO EXTRA PÓS-HORÁRIO -->
          <div class="dash-card activity-card" onclick="ActivitiesView.handleActivity('extra_train')">
            <div class="act-icon bg-primary-soft"><i class="fa-solid fa-stopwatch-20 text-primary"></i></div>
            <div class="act-details">
              <h3>Treino Extra no CT</h3>
              <p>Fique 30 minutos a mais calibrando cobranças de falta, finalizações ou trabalho muscular pesado.</p>
              <div class="act-rewards">
                <span class="badge badge-success">+Atributos</span>
                <span class="badge badge-warning">+12% Fadiga</span>
              </div>
            </div>
            <button class="btn btn-primary btn-sm">Treinar Extra</button>
          </div>

          <!-- 3. RELAÇÕES NO VESTIÁRIO & AMIGOS -->
          <div class="dash-card activity-card" onclick="ActivitiesView.handleActivity('social')">
            <div class="act-icon bg-success-soft"><i class="fa-solid fa-handshake-angle text-success"></i></div>
            <div class="act-details">
              <h3>Convivência & Liderança no Elenco</h3>
              <p>Almoce com os companheiros, apoie os jovens da base ou converse com os líderes do vestiário.</p>
              <div class="act-rewards">
                <span class="badge badge-success">+Química no Elenco</span>
                <span class="badge badge-info">+Liderança</span>
              </div>
            </div>
            <button class="btn btn-outline btn-sm">Fortalecer Relações</button>
          </div>

          <!-- 4. DESCANSO & LAZER / FAMÍLIA -->
          <div class="dash-card activity-card" onclick="ActivitiesView.handleActivity('rest')">
            <div class="act-icon bg-gold-soft"><i class="fa-solid fa-bed text-gold"></i></div>
            <div class="act-details">
              <h3>Descanso & Lazer com Família</h3>
              <p>Dia livre para videogame, almoço em família e recuperação profunda na banheira de hidromassagem.</p>
              <div class="act-rewards">
                <span class="badge badge-success">+30% Energia</span>
                <span class="badge badge-info">-25% Fadiga</span>
              </div>
            </div>
            <button class="btn btn-outline btn-sm">Descansar</button>
          </div>

          <!-- 5. IMPRENSA & COLETIVA DE MÍDIA -->
          <div class="dash-card activity-card" onclick="ActivitiesView.handleActivity('press')">
            <div class="act-icon bg-danger-soft"><i class="fa-solid fa-microphone-lines text-danger"></i></div>
            <div class="act-details">
              <h3>Entrevista Coletiva / Redes Sociais</h3>
              <p>Conceda entrevista aos jornalistas esportivos ou publique conteúdos oficiais para os torcedores.</p>
              <div class="act-rewards">
                <span class="badge badge-success">+Popularidade</span>
                <span class="badge badge-info">Repercussão</span>
              </div>
            </div>
            <button class="btn btn-outline btn-sm">Falar com a Mídia</button>
          </div>
        </div>
      </div>
    `;
  }

  static handleActivity(type) {
    const career = window.uiManager.activeCareer;
    if (!career) return;
    const isPlayer = career.type === 'player';
    const p = career.player;

    if (window.audioEngine) window.audioEngine.playDecisionClick();

    if (type === 'tactics') {
      if (p) {
        p.attributes.tacticalAwareness = Math.min(99, p.attributes.tacticalAwareness + 1.5);
        p.attributes.vision = Math.min(99, p.attributes.vision + 1.0);
        p.professionalism = Math.min(100, p.professionalism + 3);
        p.updateOverall();
      }
      if (window.audioEngine) window.audioEngine.playAttributeRise();
      career.addNews(`Estudo Tático: ${isPlayer ? p.name : career.manager.name} passou a tarde analisando padrões táticos do próximo adversário.`, 'Preparação');
      window.uiManager.showToast('Estudo Tático Concluído 🧠', 'Você identificou padrões defensivos do rival! +Tática e +Visão.', 'success');
    } else if (type === 'extra_train') {
      if (p) {
        p.attributes.finishing = Math.min(99, p.attributes.finishing + 1.0);
        p.attributes.longShots = Math.min(99, p.attributes.longShots + 1.0);
        p.fatigue = Math.min(100, p.fatigue + 14);
        p.fitness = Math.max(20, p.fitness - 12);
        p.professionalism = Math.min(100, p.professionalism + 4);
        p.updateOverall();
      }
      if (window.audioEngine) window.audioEngine.playKick('strong');
      career.addNews(`Dedicação: ${isPlayer ? p.name : career.manager.name} realizou trabalhos extras no gramado após o treino oficial.`, 'Treinamento');
      window.uiManager.showToast('Treino Extra Finalizado ⚡', 'Pontaria e chutes calibrados! Cuidado com a fadiga acumulada.', 'info');
    } else if (type === 'social') {
      if (p) {
        p.squadRelationship = Math.min(100, p.squadRelationship + 10);
        p.morale = Math.min(100, p.morale + 8);
      }
      if (window.audioEngine) window.audioEngine.playNotification();
      window.uiManager.showToast('Vestiário Unido 🤝', 'O clima e a química com seus companheiros melhoraram expressivamente!', 'success');
    } else if (type === 'rest') {
      if (p) {
        p.fatigue = Math.max(0, p.fatigue - 30);
        p.fitness = Math.min(100, p.fitness + 25);
        p.morale = Math.min(100, p.morale + 10);
      }
      if (window.audioEngine) window.audioEngine.playNotification();
      window.uiManager.showToast('Energia Restaurada 🛌', 'Descanso regenerativo completo! Suas pernas estão leves.', 'success');
    } else if (type === 'press') {
      if (p) {
        p.popularity = Math.min(100, p.popularity + 12);
        p.confidence = Math.min(100, p.confidence + 6);
      }
      if (window.audioEngine) window.audioEngine.playNotification();
      career.addNews(`Entrevista: Em declaração à imprensa, ${isPlayer ? p.name : career.manager.name} reforça ambição de títulos na temporada.`, 'Imprensa');
      window.uiManager.showToast('Entrevista Concedida 🎙️', 'Suas declarações repercutiram com carinho entre os torcedores!', 'info');
    }

    StorageManager.saveCareer(career);
    window.uiManager.updateHeaderAndSidebar();
    ActivitiesView.render(document.getElementById('mainContentArea'), career);
  }
}
