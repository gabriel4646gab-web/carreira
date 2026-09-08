// Classe e modelo de Técnico (Manager)
class Manager {
  constructor(config = {}) {
    this.name = config.name || 'Fernando Diniz Jr.';
    this.age = config.age || 42;
    this.nationality = config.nationality || 'Brasil';
    this.philosophy = config.philosophy || 'Posse de Bola Ofensiva';
    this.favoriteFormation = config.favoriteFormation || '4-3-3';
    this.license = config.license || 'Licença B CBF / CONMEBOL';

    // Clube e Contrato
    this.clubId = config.clubId || 'pon';
    this.contractYears = config.contractYears || 2;
    this.weeklySalary = config.weeklySalary || 15000;
    this.reputation = config.reputation || 65; // 0-100

    // Atributos de Treinador (0-100)
    this.tactics = config.tactics || 68;
    this.leadership = config.leadership || 72;
    this.manManagement = config.manManagement || 70;
    this.youthDevelopment = config.youthDevelopment || 75;
    this.negotiation = config.negotiation || 60;
    this.motivation = config.motivation || 74;
    this.scoutingAnalysis = config.scoutingAnalysis || 65;
    this.financialDiscipline = config.financialDiscipline || 66;

    // Métricas de Confiança e Relacionamento
    this.boardConfidence = config.boardConfidence !== undefined ? config.boardConfidence : 80; // 0-100
    this.fanConfidence = config.fanConfidence !== undefined ? config.fanConfidence : 78;       // 0-100
    this.squadMorale = config.squadMorale !== undefined ? config.squadMorale : 75;           // 0-100
    this.jobSecurity = config.jobSecurity || 'Estável'; // 'Muito Segura', 'Estável', 'Corda Bamba', 'Em Risco'

    // Finanças sob gestão
    this.transferBudget = config.transferBudget || 3000000;
    this.wageBudget = config.wageBudget || 150000;

    // Estatísticas da Temporada Atual
    this.currentSeasonStats = config.currentSeasonStats || {
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    };

    // Estatísticas Totais da Carreira
    this.careerStats = config.careerStats || {
      seasons: 0,
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      titles: [],
      sackedCount: 0,
      clubsManaged: []
    };
  }

  updateConfidence(matchResult) {
    if (matchResult === 'win') {
      this.boardConfidence = Math.min(100, this.boardConfidence + 3);
      this.fanConfidence = Math.min(100, this.fanConfidence + 4);
      this.squadMorale = Math.min(100, this.squadMorale + 4);
      this.reputation = Math.min(99, this.reputation + 0.5);
    } else if (matchResult === 'draw') {
      this.boardConfidence = Math.max(0, this.boardConfidence - 1);
      this.fanConfidence = Math.max(0, this.fanConfidence - 1);
    } else if (matchResult === 'loss') {
      this.boardConfidence = Math.max(0, this.boardConfidence - 4);
      this.fanConfidence = Math.max(0, this.fanConfidence - 5);
      this.squadMorale = Math.max(20, this.squadMorale - 5);
    }

    // Avalia segurança no cargo
    if (this.boardConfidence >= 80) this.jobSecurity = 'Muito Segura';
    else if (this.boardConfidence >= 60) this.jobSecurity = 'Estável';
    else if (this.boardConfidence >= 40) this.jobSecurity = 'Corda Bamba';
    else this.jobSecurity = 'Em Risco Iminente';
  }
}
