// Classe e modelo de Jogador (Player)
class Player {
  constructor(config = {}) {
    this.name = config.name || 'Gabriel Silva';
    this.age = config.age || 18;
    this.nationality = config.nationality || 'Brasil';
    this.position = config.position || 'Centroavante';
    this.dominantFoot = config.dominantFoot || 'Direito';
    this.height = config.height || 182; // cm
    this.weight = config.weight || 75;  // kg
    this.style = config.style || 'Oportunista e Veloz';

    // Clube atual e contrato
    this.clubId = config.clubId || 'san';
    this.contractYears = config.contractYears || 3;
    this.squadRole = config.squadRole || 'Promessa da Base'; // 'Titular Absoluto', 'Importante', 'Rotação', 'Promessa da Base', 'Reserva'
    this.weeklyWage = config.weeklyWage || 4500;
    this.marketValue = config.marketValue || 850000;

    // Atributos numéricos (35 a 99)
    this.attributes = config.attributes || generateInitialAttributes(this.position, this.style, config.initialOvr || 64);
    this.ovr = calculateOverall(this.attributes, this.position);
    this.potential = config.potential || Math.min(94, this.ovr + Math.floor(Math.random() * 18) + 10);
    this.peakOvr = this.ovr;

    // Condição física e mental
    this.fitness = config.fitness !== undefined ? config.fitness : 100; // 0-100 (Energia para o próximo jogo)
    this.fatigue = config.fatigue || 0; // 0-100 (Cansaço acumulado)
    this.morale = config.morale !== undefined ? config.morale : 80; // 0-100
    this.confidence = config.confidence !== undefined ? config.confidence : 75; // 0-100
    this.form = config.form !== undefined ? config.form : 7.0; // 1.0 a 10.0 (Nota recente)

    // Personalidade e Dinâmicas de Vestiário
    this.discipline = config.discipline || 80;
    this.professionalism = config.professionalism || 80;
    this.popularity = config.popularity || 40;
    this.coachRelationship = config.coachRelationship || 75;
    this.squadRelationship = config.squadRelationship || 75;
    this.fanPressure = config.fanPressure || 30;

    // Sistema de Lesões
    this.injury = config.injury || null; // { name: 'Estiramento Muscular', weeksRemaining: 3, severity: 'Leve' }

    // Estatísticas da Temporada Atual
    this.currentSeasonStats = config.currentSeasonStats || {
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0,
      ratingSum: 0,
      averageRating: 0.0,
      motmCount: 0 // Homem do Jogo
    };

    // Estatísticas Totais na Carreira
    this.careerStats = config.careerStats || {
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      titles: [],
      individualAwards: [],
      nationalTeamMatches: 0,
      nationalTeamGoals: 0,
      highestOvr: this.ovr,
      highestMarketValue: this.marketValue,
      highestWage: this.weeklyWage,
      injuriesSuffered: 0,
      clubsHistory: []
    };
  }

  // Atualiza o OVR recalculando pelos atributos atuais
  updateOverall() {
    this.ovr = calculateOverall(this.attributes, this.position);
    if (this.ovr > this.peakOvr) this.peakOvr = this.ovr;
    if (this.ovr > this.careerStats.highestOvr) this.careerStats.highestOvr = this.ovr;
    this.marketValue = calculateMarketValue(this.ovr, this.age, this.position);
    if (this.marketValue > this.careerStats.highestMarketValue) {
      this.careerStats.highestMarketValue = this.marketValue;
    }
  }

  // Aplica treino semanal
  train(trainingType) {
    if (this.injury) {
      return { success: false, message: 'Você está no departamento médico e só pode realizar fisioterapia!' };
    }

    let report = { name: trainingType, attributeGains: {}, fatigueIncrease: 10, injuryRisk: 5 };

    switch (trainingType) {
      case 'Foco em Finalização e Ataque':
        this.boostAttr('finishing', 0.4);
        this.boostAttr('longShots', 0.3);
        this.boostAttr('positioning', 0.2);
        report.attributeGains = { finishing: '+0.4', longShots: '+0.3' };
        report.fatigueIncrease = 12;
        break;

      case 'Foco em Físico e Força':
        this.boostAttr('strength', 0.4);
        this.boostAttr('stamina', 0.3);
        this.boostAttr('jumping', 0.2);
        report.attributeGains = { strength: '+0.4', stamina: '+0.3' };
        report.fatigueIncrease = 15;
        report.injuryRisk = 10;
        break;

      case 'Velocidade e Aceleração':
        this.boostAttr('pace', 0.3);
        this.boostAttr('acceleration', 0.3);
        this.boostAttr('agility', 0.2);
        report.attributeGains = { pace: '+0.3', acceleration: '+0.3' };
        report.fatigueIncrease = 14;
        break;

      case 'Passe e Visão de Jogo':
        this.boostAttr('shortPassing', 0.4);
        this.boostAttr('longPassing', 0.3);
        this.boostAttr('vision', 0.3);
        report.attributeGains = { shortPassing: '+0.4', vision: '+0.3' };
        report.fatigueIncrease = 10;
        break;

      case 'Drible e Habilidade Técnica':
        this.boostAttr('dribbling', 0.4);
        this.boostAttr('ballControl', 0.3);
        this.boostAttr('firstTouch', 0.3);
        report.attributeGains = { dribbling: '+0.4', ballControl: '+0.3' };
        report.fatigueIncrease = 11;
        break;

      case 'Defesa e Marcação':
        this.boostAttr('tackling', 0.4);
        this.boostAttr('marking', 0.3);
        this.boostAttr('interceptions', 0.3);
        report.attributeGains = { tackling: '+0.4', marking: '+0.3' };
        report.fatigueIncrease = 12;
        break;

      case 'Treino de Goleiro':
        this.boostAttr('gkReflexes', 0.4);
        this.boostAttr('gkDiving', 0.4);
        this.boostAttr('gkPositioning', 0.3);
        report.attributeGains = { gkReflexes: '+0.4', gkDiving: '+0.4' };
        report.fatigueIncrease = 12;
        break;

      case 'Descanso e Recuperação':
        this.fatigue = Math.max(0, this.fatigue - 35);
        this.fitness = Math.min(100, this.fitness + 30);
        this.morale = Math.min(100, this.morale + 5);
        report.attributeGains = { recuperacao: 'Fadiga reduzida expressivamente' };
        report.fatigueIncrease = 0;
        report.injuryRisk = 0;
        break;

      case 'Fisioterapia Preventiva':
        this.fatigue = Math.max(0, this.fatigue - 20);
        this.fitness = Math.min(100, this.fitness + 15);
        if (this.injury) {
          this.injury.weeksRemaining -= 1;
          if (this.injury.weeksRemaining <= 0) {
            this.injury = null;
            report.injuryCured = true;
          }
        }
        report.attributeGains = { condicao: 'Prevenção e alívio muscular' };
        report.fatigueIncrease = 0;
        report.injuryRisk = 0;
        break;
    }

    if (report.fatigueIncrease > 0) {
      this.fatigue = Math.min(100, this.fatigue + report.fatigueIncrease);
      this.fitness = Math.max(20, this.fitness - Math.floor(report.fatigueIncrease * 0.8));
    }

    // Risco de lesão no treino
    if (this.fatigue > 75 && Math.random() * 100 < report.injuryRisk + (this.fatigue - 70)) {
      this.applyRandomInjury();
      report.injuryHappened = this.injury;
    }

    this.updateOverall();
    return { success: true, report };
  }

  boostAttr(attrName, amount) {
    if (this.attributes[attrName] === undefined) return;
    
    // Quanto mais velho e mais próximo do potencial, mais lento é o ganho
    let potentialDiff = Math.max(0, this.potential - this.ovr);
    let ageFactor = this.age <= 21 ? 1.4 : this.age <= 27 ? 1.0 : this.age <= 31 ? 0.5 : 0.1;
    let actualGain = amount * (0.6 + (potentialDiff / 30)) * ageFactor;

    this.attributes[attrName] = Math.min(99, Math.round((this.attributes[attrName] + actualGain) * 10) / 10);
  }

  applyRandomInjury() {
    const injuries = [
      { name: 'Contusão Leve', weeksRemaining: 1, severity: 'Leve' },
      { name: 'Estiramento Muscular na Coxa', weeksRemaining: 3, severity: 'Moderada' },
      { name: 'Entorse no Tornozelo', weeksRemaining: 4, severity: 'Moderada' },
      { name: 'Fratura por Estresse', weeksRemaining: 8, severity: 'Grave' },
      { name: 'Lesão nos Ligamentos do Joelho', weeksRemaining: 16, severity: 'Muito Grave' }
    ];
    let selected = injuries[Math.floor(Math.random() * (this.fatigue > 85 ? injuries.length : 3))];
    this.injury = { ...selected };
    this.careerStats.injuriesSuffered += 1;
    this.morale = Math.max(20, this.morale - 15);
  }

  // Processa recuperação semanal
  recoverWeekly() {
    if (this.injury) {
      this.injury.weeksRemaining -= 1;
      if (this.injury.weeksRemaining <= 0) {
        this.injury = null;
      }
    } else {
      this.fatigue = Math.max(0, this.fatigue - 15);
      this.fitness = Math.min(100, this.fitness + 20);
    }
  }

  // Aplica declínio natural por idade no final da temporada
  applyAgeProgression() {
    this.age += 1;
    this.contractYears -= 1;

    if (this.age >= 31) {
      // Declínio físico
      const physicals = ['pace', 'acceleration', 'stamina', 'agility', 'jumping'];
      physicals.forEach(p => {
        if (this.attributes[p]) {
          let loss = Math.floor(Math.random() * (this.age - 29)) + 1;
          this.attributes[p] = Math.max(35, this.attributes[p] - loss);
        }
      });
      // Ganho mental de experiência
      const mentals = ['vision', 'positioning', 'decisions', 'tacticalAwareness', 'composure'];
      mentals.forEach(m => {
        if (this.attributes[m] && this.attributes[m] < 92) {
          this.attributes[m] += 1;
        }
      });
    }

    this.updateOverall();
  }
}
