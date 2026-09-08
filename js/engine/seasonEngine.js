// Motor de Temporadas, Calendário de Rodadas e Tabelas de Classificação
class SeasonEngine {
  // Inicializa ou recria a tabela da liga atual
  static initLeagueTable(career) {
    const club = career.getCurrentClub();
    const competition = COMPETITIONS_DATA[club.league] || COMPETITIONS_DATA['Brasileirão Série A'];
    
    // Lista de clubes na liga
    let clubIds = competition.clubs || [];
    if (!clubIds.includes(club.id)) {
      clubIds = [club.id, ...clubIds];
    }

    career.leagueTable = clubIds.map(cId => {
      const c = getClubById(cId);
      return {
        clubId: c.id,
        name: c.name,
        ovr: c.ovr,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    this.generateFixtures(career, competition);
  }

  // Gera o calendário de jogos para 38 rodadas
  static generateFixtures(career, competition) {
    const club = career.getCurrentClub();
    const opponents = career.leagueTable.filter(t => t.clubId !== club.id);
    const fixtures = [];

    let totalRounds = competition.rounds || 38;

    for (let round = 1; round <= totalRounds; round++) {
      // Sorteia um adversário para a rodada
      const oppIndex = (round - 1) % opponents.length;
      const oppClub = getClubById(opponents[oppIndex].clubId);
      const isHome = round % 2 !== 0;

      fixtures.push({
        round: round,
        competition: competition.name,
        homeClubId: isHome ? club.id : oppClub.id,
        awayClubId: isHome ? oppClub.id : club.id,
        played: false,
        homeScore: null,
        awayScore: null
      });
    }

    career.fixtures = fixtures;
  }

  // Simula os jogos dos outros clubes da rodada
  static simulateOtherMatches(career) {
    career.leagueTable.forEach(team => {
      const userClubId = career.getCurrentClub().id;
      if (team.clubId !== userClubId) {
        // Simulação baseada no OVR do time
        const strength = team.ovr;
        const roll = Math.random() * 100;
        let result = 'draw';
        let gf = 1;
        let ga = 1;

        if (roll < (strength - 35)) {
          result = 'win';
          gf = Math.floor(Math.random() * 3) + 1;
          ga = Math.floor(Math.random() * gf);
        } else if (roll > (strength + 15)) {
          result = 'loss';
          ga = Math.floor(Math.random() * 3) + 1;
          gf = Math.floor(Math.random() * ga);
        } else {
          result = 'draw';
          gf = Math.floor(Math.random() * 2);
          ga = gf;
        }

        team.played += 1;
        team.goalsFor += gf;
        team.goalsAgainst += ga;
        team.goalDifference = team.goalsFor - team.goalsAgainst;

        if (result === 'win') {
          team.won += 1;
          team.points += 3;
        } else if (result === 'draw') {
          team.drawn += 1;
          team.points += 1;
        } else {
          team.lost += 1;
        }
      }
    });

    // Ordena tabela por pontos, saldo de gols e gols marcados
    career.leagueTable.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }

  // Finaliza a temporada e prepara a seguinte
  static finishSeason(career) {
    const userClub = career.getCurrentClub();
    const tableRank = career.leagueTable.findIndex(t => t.clubId === userClub.id) + 1;
    const isChampion = tableRank === 1;

    let seasonSummary = {
      seasonName: career.seasonName,
      clubName: userClub.name,
      finalRank: tableRank,
      isChampion: isChampion
    };

    if (career.type === 'player') {
      const p = career.player;
      p.currentSeasonStats.averageRating = p.currentSeasonStats.matches > 0 
        ? Math.round((p.currentSeasonStats.ratingSum / p.currentSeasonStats.matches) * 10) / 10 
        : 6.0;

      seasonSummary.stats = { ...p.currentSeasonStats };
      seasonSummary.ovr = p.ovr;
      seasonSummary.marketValue = p.marketValue;

      // Se foi campeão
      if (isChampion) {
        p.careerStats.titles.push(`${career.seasonName} - Campeão da ${userClub.league} (${userClub.name})`);
        career.unlockAchievement('first_trophy');
      }

      // Verificações de conquistas de temporada
      if (p.currentSeasonStats.goals >= 10) career.unlockAchievement('ten_goals_season');
      if (p.currentSeasonStats.goals >= 25) career.unlockAchievement('twenty_five_goals_season');
      if (p.ovr >= 80) career.unlockAchievement('ovr_80');
      if (p.ovr >= 88) career.unlockAchievement('ovr_88');
      if (p.careerStats.goals >= 100) career.unlockAchievement('hundred_goals');

      // Aplica envelhecimento e declínio/evolução
      p.applyAgeProgression();

      // Reseta estatísticas da temporada atual
      p.currentSeasonStats = {
        matches: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        ratingSum: 0,
        averageRating: 0.0,
        motmCount: 0
      };

      if (p.age >= 40) {
        career.isRetired = true;
      }
    } else {
      // Modo Técnico
      const m = career.manager;
      m.careerStats.seasons += 1;
      if (isChampion) {
        m.careerStats.titles.push(`${career.seasonName} - Campeão da ${userClub.league} (${userClub.name})`);
        career.unlockAchievement('manager_title');
      }
      m.age += 1;
      m.contractYears -= 1;
      m.currentSeasonStats = {
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
    }

    // Registra no histórico da carreira
    career.seasonsHistory.push(seasonSummary);
    if (career.seasonsHistory.length >= 10) {
      career.unlockAchievement('career_10_years');
    }

    // Avança o ano da temporada
    career.currentYear += 1;
    career.currentWeek = 1;
    career.seasonName = `${career.currentYear}/${(career.currentYear + 1).toString().slice(-2)}`;

    // Reinicia calendário e tabela
    this.initLeagueTable(career);
    career.addNews(`Início da Temporada Oficial ${career.seasonName}! As equipes voltam aos gramados em busca de glórias.`, 'Temporada');

    return seasonSummary;
  }
}
