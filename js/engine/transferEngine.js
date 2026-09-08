// Motor de Mercado da Bola, Propostas Realistas e Contratos
class TransferEngine {
  // Avalia se o jogador ou técnico deve receber propostas no período atual
  static checkTransferOffers(career) {
    if (career.type === 'player') {
      const p = career.player;
      const currentClub = career.getCurrentClub();

      // Fatores de atração: OVR, Idade, Forma e Reputação
      const formBonus = p.form >= 7.5 ? 20 : p.form >= 7.0 ? 10 : 0;
      const ovrChance = Math.min(80, (p.ovr - 55) * 1.5 + formBonus);

      // Probabilidade de oferta nesta semana (mais alta se estiver bem)
      if (Math.random() * 100 < ovrChance * 0.25 && career.transferOffers.length < 3) {
        this.generatePlayerOffer(career);
      }
    } else {
      // Modo Técnico
      const m = career.manager;
      if (m.reputation > 65 && Math.random() * 100 < 15 && career.transferOffers.length < 2) {
        this.generateManagerOffer(career);
      }
    }
  }

  static generatePlayerOffer(career) {
    const p = career.player;
    const currentClub = career.getCurrentClub();

    // Filtra clubes compatíveis (podem ser do mesmo nível ou um degrau acima)
    const minOvr = Math.max(58, p.ovr - 5);
    const maxOvr = Math.min(92, p.ovr + 8);

    const candidates = CLUBS_DATA.filter(c => c.id !== currentClub.id && c.ovr >= minOvr && c.ovr <= maxOvr);
    if (candidates.length === 0) return;

    const interestedClub = candidates[Math.floor(Math.random() * candidates.length)];
    
    // Valor da transferência realista
    const baseValue = p.marketValue;
    const transferFee = Math.round(baseValue * (0.85 + Math.random() * 0.4));
    const weeklyWage = calculateWeeklyWage(p.ovr, p.age, interestedClub.tier);
    const contractYears = Math.floor(Math.random() * 3) + 2;

    // Papel no elenco do novo clube
    let squadRole = 'Titular Importante';
    if (p.ovr > interestedClub.ovr + 2) squadRole = 'Estrela da Equipe';
    else if (p.ovr < interestedClub.ovr - 2) squadRole = 'Rotação / Reserva';

    const offer = {
      id: 'offer_' + Date.now(),
      clubId: interestedClub.id,
      clubName: interestedClub.name,
      clubLogoText: interestedClub.logoText,
      clubColors: interestedClub.colors,
      league: interestedClub.league,
      country: interestedClub.country,
      transferFee: transferFee,
      weeklyWage: weeklyWage,
      contractYears: contractYears,
      squadRole: squadRole,
      createdAtWeek: career.currentWeek
    };

    career.transferOffers.push(offer);
    career.addNews(`Mercado: O ${interestedClub.name} formalizou proposta oficial de R$ ${transferFee.toLocaleString('pt-BR')} por ${p.name}!`, 'Mercado');
  }

  static generateManagerOffer(career) {
    const m = career.manager;
    const currentClub = career.getCurrentClub();

    const candidates = CLUBS_DATA.filter(c => c.id !== currentClub.id && c.rep <= m.reputation + 10 && c.rep >= m.reputation - 15);
    if (candidates.length === 0) return;

    const interestedClub = candidates[Math.floor(Math.random() * candidates.length)];
    const salary = Math.round(m.weeklySalary * (1.1 + Math.random() * 0.4));

    const offer = {
      id: 'mgr_offer_' + Date.now(),
      clubId: interestedClub.id,
      clubName: interestedClub.name,
      clubLogoText: interestedClub.logoText,
      clubColors: interestedClub.colors,
      league: interestedClub.league,
      weeklyWage: salary,
      contractYears: 2,
      transferBudget: interestedClub.budget
    };

    career.transferOffers.push(offer);
    career.addNews(`Diretoria do ${interestedClub.name} quer ${m.name} como novo treinador da equipe!`, 'Mercado');
  }

  // Aceita uma proposta de transferência
  static acceptOffer(career, offerId) {
    const offerIndex = career.transferOffers.findIndex(o => o.id === offerId);
    if (offerIndex === -1) return false;

    const offer = career.transferOffers[offerIndex];
    const newClub = getClubById(offer.clubId);

    if (career.type === 'player') {
      const p = career.player;
      p.clubId = newClub.id;
      p.weeklyWage = offer.weeklyWage;
      p.contractYears = offer.contractYears;
      p.squadRole = offer.squadRole;
      p.morale = 95; // Motivação de novo clube

      if (offer.weeklyWage > p.careerStats.highestWage) {
        p.careerStats.highestWage = offer.weeklyWage;
      }
      p.careerStats.clubsHistory.push(newClub.name);

      // Conquista de liga europeia
      const euroLeagues = ['Premier League', 'La Liga', 'Serie A Italiana', 'Bundesliga', 'Ligue 1'];
      if (euroLeagues.includes(newClub.league)) {
        career.unlockAchievement('big_league_transfer');
      }

      career.addNews(`OFICIAL: ${p.name} assina com o ${newClub.name} por ${offer.contractYears} anos com salário semanal de R$ ${offer.weeklyWage.toLocaleString('pt-BR')}!`, 'Mercado');
    } else {
      const m = career.manager;
      m.clubId = newClub.id;
      m.weeklySalary = offer.weeklyWage;
      m.contractYears = offer.contractYears;
      m.transferBudget = offer.transferBudget;
      m.boardConfidence = 80;
      m.careerStats.clubsManaged.push(newClub.name);

      career.addNews(`ANÚNCIO: ${m.name} é o novo comandante técnico do ${newClub.name}!`, 'Mercado');
    }

    career.transferOffers = [];
    SeasonEngine.initLeagueTable(career);
    return true;
  }

  // Recusa uma proposta
  static rejectOffer(career, offerId) {
    career.transferOffers = career.transferOffers.filter(o => o.id !== offerId);
  }
}
