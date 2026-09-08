// Tela de Notícias e Central de Imprensa
class NewsView {
  static render(container, career) {
    if (!career) return;

    container.innerHTML = `
      <div class="dash-card">
        <div class="card-header">
          <h2><i class="fa-solid fa-newspaper"></i> Central de Mídia & Cobertura Jornalística</h2>
          <span class="badge badge-primary">${career.newsFeed.length} Manchetes</span>
        </div>
        <div class="card-body">
          <p class="text-muted" style="margin-bottom: 20px;">
            Acompanhe o que os principais veículos de comunicação, jornais esportivos e redes de TV estão repercutindo sobre sua carreira e seu clube.
          </p>

          <div class="news-feed-full">
            ${career.newsFeed.map(news => `
              <div class="news-card-full">
                <div class="news-card-meta">
                  <span class="badge badge-info">${news.category}</span>
                  <span class="news-time">${news.date}</span>
                </div>
                <h3 class="news-card-title">${news.title}</h3>
                <div class="news-card-footer">
                  <span><i class="fa-solid fa-globe"></i> Imprensa Esportiva Oficial</span>
                  <span><i class="fa-solid fa-share-nodes"></i> Alta Repercussão</span>
                </div>
              </div>
            `).join('')}

            ${career.newsFeed.length === 0 ? `
              <p class="text-muted">Nenhuma notícia publicada ainda nesta carreira.</p>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}
