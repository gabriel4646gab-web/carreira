// Galeria de Conquistas e Troféus Desbloqueáveis
class AchievementsView {
  static render(container, career) {
    if (!career) return;

    const unlocked = career.unlockedAchievements || [];
    const total = ACHIEVEMENTS_LIST.length;
    const countUnlocked = unlocked.length;
    const percent = Math.round((countUnlocked / total) * 100);

    container.innerHTML = `
      <div class="achievements-container">
        <div class="dash-card achievements-hero-card">
          <div class="ach-hero-flex">
            <div>
              <h2><i class="fa-solid fa-trophy text-gold"></i> Galeria de Conquistas</h2>
              <p class="text-muted">Desbloqueie marcos históricos ao longo de sua trajetória profissional.</p>
            </div>
            <div class="ach-counter-badge">
              <span class="num">${countUnlocked}/${total}</span>
              <span class="lbl">${percent}% Concluído</span>
            </div>
          </div>
          <div class="progress-bar-bg" style="margin-top: 15px;">
            <div class="progress-bar-fill bg-gold" style="width: ${percent}%"></div>
          </div>
        </div>

        <div class="achievements-grid" style="margin-top: 20px;">
          ${ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return `
              <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="ach-icon-circle">
                  <i class="fa-solid ${ach.icon}"></i>
                </div>
                <div class="ach-info">
                  <h4>${ach.title}</h4>
                  <p>${ach.description}</p>
                  <span class="ach-status-badge">
                    ${isUnlocked ? '<i class="fa-solid fa-check"></i> Desbloqueado' : '<i class="fa-solid fa-lock"></i> Bloqueado'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}
