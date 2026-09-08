// Gerador dinâmico de notícias e repercussão da imprensa esportiva
class NewsEngine {
  static generateMatchNews(career, match) {
    const club = career.getCurrentClub();
    const isHome = match.isHome;
    const userGoals = isHome ? match.homeScore : match.awayScore;
    const oppGoals = isHome ? match.awayScore : match.homeScore;

    if (career.type === 'player') {
      const p = career.player;
      const goals = match.playerMatchStats.goals;
      const rating = match.playerMatchStats.rating;

      if (goals >= 3) {
        career.addNews(`HAT-TRICK HISTÓRICO! ${p.name} destrói a defesa adversária e marca 3 gols na vitória do ${club.name}!`, 'Destaque');
      } else if (goals >= 1 && rating >= 7.5) {
        career.addNews(`Decisivo! Com gol de ${p.name}, o ${club.name} garante resultado importante no campeonato.`, 'Partida');
      } else if (rating >= 8.0) {
        career.addNews(`Atuação de gala: ${p.name} rege o meio de campo e ganha nota ${rating} da imprensa especializada.`, 'Desempenho');
      } else if (rating < 5.5) {
        career.addNews(`Noite apagada: ${p.name} não consegue render o esperado no confronto do ${club.name}.`, 'Crítica');
      } else {
        const resText = userGoals > oppGoals ? 'vitória' : userGoals === oppGoals ? 'empate' : 'derrota';
        career.addNews(`Fim de jogo: ${club.name} ${userGoals} x ${oppGoals} ${match.oppClub.name}. ${p.name} atuou os 90 minutos.`, 'Resultado');
      }
    } else {
      // Modo Técnico
      const m = career.manager;
      if (userGoals > oppGoals) {
        career.addNews(`Vitória tática: ${m.name} supera adversário com estratégia precisa no comando do ${club.name}.`, 'Técnico');
      } else if (userGoals < oppGoals) {
        career.addNews(`Cobrança da torcida: ${m.name} lamenta desatenção defensiva na derrota do ${club.name}.`, 'Técnico');
      } else {
        career.addNews(`Equilíbrio em campo: ${club.name} de ${m.name} empata confronto movimentado.`, 'Resultado');
      }
    }
  }
}
