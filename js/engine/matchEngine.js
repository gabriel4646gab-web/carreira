// Motor Avançado de Simulação de Partidas com Imprevisibilidade Realista, Decisões Narrativas e Áudio
class MatchEngine {
  constructor(career, fixture) {
    this.career = career;
    this.fixture = fixture;
    this.userClub = career.getCurrentClub();
    this.isHome = fixture.homeClubId === this.userClub.id;
    this.oppClub = getClubById(this.isHome ? fixture.awayClubId : fixture.homeClubId);

    // Estado da partida em tempo real
    this.minute = 0;
    this.homeScore = 0;
    this.awayScore = 0;
    this.isFinished = false;
    this.isPausedForDecision = false;
    this.currentDecision = null;

    // Estatísticas do jogador na partida
    this.playerMatchStats = {
      minutes: 0,
      goals: 0,
      assists: 0,
      shots: 0,
      shotsOnTarget: 0,
      passesCompleted: 0,
      passesFailed: 0,
      dribblesSuccess: 0,
      dribblesFailed: 0,
      tackles: 0,
      saves: 0,
      foulsCommitted: 0,
      foulsSuffered: 0,
      yellowCard: false,
      redCard: false,
      rating: 6.0,
      isSubstituted: false,
      isInjuredInMatch: false
    };

    // Contexto climático e de ambiente gerado para a partida
    this.matchContext = this.generateMatchContext();

    // Feed de comentários e lances narrativos
    this.eventsLog = [];
    
    // Perfil e Personalidade do Treinador da equipe
    this.coach = career.coach || (typeof CalendarEngine !== 'undefined' ? CalendarEngine.generateCoachProfile(this.userClub) : {
      name: 'Comandante Técnico',
      patience: 60,
      strictness: 65,
      subTiming: 70,
      trust: 70
    });

    // Avaliação em tempo real a cada 10 minutos
    this.coachEvaluation = {
      trust: this.coach.trust || 70,
      subRisk: 0,
      feedback: 'Concentrado e atento às instruções.',
      lastCheckMinute: 0
    };

    // Tática ativa (modo técnico)
    this.tacticalPosture = 'Equilibrado';
  }

  generateMatchContext() {
    const weathers = [
      { name: 'Céu Aberto / Tarde Ensolarada', friction: 1.0, fatigueRate: 1.0 },
      { name: 'Chuva Forte e Gramado Molhado', friction: 1.3, fatigueRate: 1.25, slipChance: 15 },
      { name: 'Noite Fria com Garoa', friction: 1.1, fatigueRate: 1.1 },
      { name: 'Calor Intenso e Abafado', friction: 1.0, fatigueRate: 1.35 }
    ];
    const weather = weathers[Math.floor(Math.random() * weathers.length)];
    const stadiumPressure = this.isHome ? 25 : 75;

    return {
      weather: weather.name,
      fatigueRate: weather.fatigueRate,
      slipChance: weather.slipChance || 5,
      stadiumPressure: stadiumPressure
    };
  }

  // Gera o momento de decisão contextual usando o DecisionEngine
  generateDecisionPoint(minute) {
    return DecisionEngine.generateContextualScenario(this.career.player, this, minute);
  }

  // =========================================================================
  // SISTEMA DE PROBABILIDADE, CONTEXTO E MÚLTIPLOS DESFECHOS (IMPREVISIBILIDADE)
  // Fórmula: ATRIBUTOS + CONTEXTO + PROBABILIDADE + ALEATORIEDADE
  // =========================================================================
  executeChoice(choiceIndex) {
    if (!this.currentDecision) return;
    const choice = this.currentDecision.options[choiceIndex];
    if (choice.isBlocked) return; // Ações bloqueadas não podem ser executadas

    const p = this.career.player;
    const primeVal = p.attributes[choice.primaryAttr] || 60;
    const secVal = p.attributes[choice.secondaryAttr] || 60;
    const effectiveAttr = primeVal * 0.7 + secVal * 0.3;

    // Modificadores de Contexto
    const fatiguePenalty = (p.fatigue / 100) * 14;
    const energyBonus = (p.fitness / 100) * 10;
    const moraleMod = (p.morale - 75) * 0.15;
    const confidenceMod = (p.confidence - 75) * 0.2;
    const minutePressure = this.minute >= 80 ? 4 : 0;
    const awayPressure = !this.isHome ? 3 : 0;
    const oppDefensePower = Math.max(0, (this.oppClub.ovr - 68) * 0.3);

    let successChance = effectiveAttr - choice.difficulty + energyBonus - fatiguePenalty + moraleMod + confidenceMod - minutePressure - awayPressure - oppDefensePower;
    successChance = Math.max(22, Math.min(94, successChance + 54));

    const roll = Math.random() * 100;
    const isPerfect = roll < (successChance * 0.52);
    const isSuccess = roll < successChance;
    const isCloseFail = roll < (successChance + 22);

    this.resolveActionOutcome(choice, isSuccess, isPerfect, isCloseFail, p);

    this.isPausedForDecision = false;
    this.currentDecision = null;
  }

  resolveActionOutcome(choice, isSuccess, isPerfect, isCloseFail, p) {
    const action = choice.actionType;
    let narrative = '';
    let logType = 'normal';
    let visualType = 'holding_midfield';

    if (action.startsWith('shoot') || action.startsWith('chip') || action.startsWith('zero_angle')) {
      this.playerMatchStats.shots += 1;
      if (window.audioEngine) window.audioEngine.playKick('strong');

      if (isPerfect) {
        this.addGoal(true);
        this.playerMatchStats.goals += 1;
        this.playerMatchStats.shotsOnTarget += 1;
        this.playerMatchStats.rating += 1.3;
        logType = 'goal';
        visualType = 'goal_net';

        narrative = `⚽ [${this.minute}'] PINTURA HISTÓRICA! Você acertou um chute no ângulo indefensável! A bola estufou a gaveta!`;
        if (window.audioEngine) {
          setTimeout(() => window.audioEngine.playNet(), 80);
          setTimeout(() => window.audioEngine.playCheer(), 200);
        }
      } else if (isSuccess) {
        this.addGoal(true);
        this.playerMatchStats.goals += 1;
        this.playerMatchStats.shotsOnTarget += 1;
        this.playerMatchStats.rating += 1.0;
        logType = 'goal';
        visualType = 'goal_net';

        narrative = `⚽ [${this.minute}'] GOOOOOOOOOL! Você bateu firme rasteiro, o goleiro tentou espalmar mas a bola morreu no fundo das redes!`;
        if (window.audioEngine) {
          setTimeout(() => window.audioEngine.playNet(), 90);
          setTimeout(() => window.audioEngine.playCheer(), 220);
        }
      } else if (isCloseFail) {
        if (Math.random() < 0.5) {
          narrative = `💥 [${this.minute}'] NO TRAVESSÃO! Que bomba! O chute explodiu na trave e levantou a torcida nas arquibancadas!`;
          logType = 'danger';
          visualType = 'ball_post';
          if (window.audioEngine) {
            setTimeout(() => window.audioEngine.playPostHit(), 70);
            setTimeout(() => window.audioEngine.playGasp(), 300);
          }
        } else {
          this.playerMatchStats.shotsOnTarget += 1;
          narrative = `🧤 [${this.minute}'] MILAGRE DO GOLEIRO! Você bateu com veneno no canto, mas o goleiro do ${this.oppClub.name} voou de luva trocada!`;
          logType = 'danger';
          visualType = 'gk_save';
          if (window.audioEngine) {
            setTimeout(() => window.audioEngine.playSave(), 80);
            setTimeout(() => window.audioEngine.playGasp(), 250);
          }
        }
        this.playerMatchStats.rating += 0.2;
      } else {
        if (Math.random() < 0.5) {
          narrative = `❌ [${this.minute}'] Chute travado e bloqueado na hora exata pelo carrinho do zagueiro adversário!`;
          visualType = 'shot_blocked';
        } else {
          narrative = `❌ [${this.minute}'] Pressionado, você bateu mascado e a bola saiu muito longe pela linha de fundo.`;
          visualType = 'shot_wide';
        }
        logType = 'danger';
        this.playerMatchStats.rating = Math.max(4.0, this.playerMatchStats.rating - 0.2);
        if (window.audioEngine) {
          setTimeout(() => window.audioEngine.playBoo(), 200);
        }
      }

    } else if (action.startsWith('pass') || action.startsWith('cross') || action.startsWith('quick_flick')) {
      if (window.audioEngine) window.audioEngine.playPass();

      if (isPerfect || isSuccess) {
        this.playerMatchStats.passesCompleted += 1;
        if (Math.random() < 0.75) {
          this.addGoal(true);
          this.playerMatchStats.assists += 1;
          this.playerMatchStats.rating += 1.1;
          logType = 'assist';
          visualType = 'goal_net';
          narrative = `🎯 [${this.minute}'] ASSISTÊNCIA DE GÊNIO! Você enxergou a infiltração milimétrica e deixou seu companheiro sozinho para estufar o gol!`;
          if (window.audioEngine) {
            setTimeout(() => window.audioEngine.playNet(), 150);
            setTimeout(() => window.audioEngine.playCheer(), 250);
          }
        } else {
          this.playerMatchStats.rating += 0.4;
          visualType = 'ball_post';
          narrative = `✨ [${this.minute}'] Passe açucarado! Seu companheiro dominou livre dentro da área, mas finalizou na trave!`;
          if (window.audioEngine) {
            setTimeout(() => window.audioEngine.playPostHit(), 100);
            setTimeout(() => window.audioEngine.playGasp(), 300);
          }
        }
      } else {
        this.playerMatchStats.passesFailed += 1;
        visualType = 'interception';
        const passFails = [
          `O passe saiu com força excessiva e correu direto pela linha de fundo.`,
          `O volante adversário fez a leitura antecipada e interceptou o passe no meio.`,
          `Seu companheiro não entendeu a movimentação e a bola sobrou limpa para o rival.`
        ];
        narrative = `⚠️ [${this.minute}'] ${passFails[Math.floor(Math.random() * passFails.length)]}`;
        logType = 'danger';
        this.playerMatchStats.rating = Math.max(4.0, this.playerMatchStats.rating - 0.2);
      }

    } else if (action.startsWith('dribble') || action.startsWith('solo') || action.startsWith('round_gk') || action.startsWith('spin')) {
      if (isPerfect || isSuccess) {
        this.playerMatchStats.dribblesSuccess += 1;
        this.playerMatchStats.rating += 0.7;
        visualType = 'dribble_success';

        if (Math.random() < 0.4) {
          this.playerMatchStats.foulsSuffered += 1;
          visualType = 'foul_card';
          narrative = `⭐ [${this.minute}'] DRIBLE DESCONCERTANTE E PÊNALTI! Você deu uma caneta humilhante e o zagueiro foi obrigado a derrubar na área!`;
          logType = 'goal';
          if (window.audioEngine) {
            window.audioEngine.playWhistle('foul');
            setTimeout(() => window.audioEngine.playCheer(), 300);
          }
          setTimeout(() => {
            this.addGoal(true);
            this.playerMatchStats.goals += 1;
          }, 500);
        } else {
          narrative = `⚡ [${this.minute}'] Finta espetacular! Você entortou o marcador com uma finta de corpo e limpou a jogada.`;
          logType = 'normal';
          if (window.audioEngine) window.audioEngine.playCheer();
        }
      } else {
        this.playerMatchStats.dribblesFailed += 1;
        this.playerMatchStats.rating = Math.max(4.0, this.playerMatchStats.rating - 0.3);
        visualType = 'tackle_success';
        narrative = `⛔ [${this.minute}'] Você tentou o drible, mas foi desarmado pelo desarme pontual do lateral adversário.`;
        logType = 'danger';
        if (window.audioEngine) window.audioEngine.playTackle();
      }

    } else if (action.startsWith('tackle') || action.startsWith('marking') || action.startsWith('header') || action.startsWith('shield')) {
      if (window.audioEngine) window.audioEngine.playTackle();

      if (isPerfect || isSuccess) {
        this.playerMatchStats.tackles += 1;
        this.playerMatchStats.rating += 0.8;
        visualType = 'tackle_success';
        narrative = `🛡️ [${this.minute}'] MONSTRO NA DEFESA! Desarme cirúrgico na bola sem dar chances ao atacante rival!`;
        logType = 'normal';
        if (window.audioEngine) window.audioEngine.playCheer();
      } else {
        if (choice.actionType === 'foul_tactical' || Math.random() < 0.5) {
          this.playerMatchStats.foulsCommitted += 1;
          this.playerMatchStats.yellowCard = true;
          this.playerMatchStats.rating -= 0.3;
          visualType = 'foul_card';
          narrative = `🟨 [${this.minute}'] Falta dura e calculada. Você parou o contra-ataque perigoso e recebeu cartão amarelo do árbitro.`;
          logType = 'danger';
          if (window.audioEngine) window.audioEngine.playWhistle('foul');
        } else {
          this.addGoal(false);
          this.playerMatchStats.rating = Math.max(4.0, this.playerMatchStats.rating - 0.5);
          visualType = 'goal_net';
          narrative = `💔 [${this.minute}'] O atacante adversário antecipou o bote, passou na velocidade e marcou o gol para o ${this.oppClub.name}!`;
          logType = 'opp_goal';
          if (window.audioEngine) {
            window.audioEngine.playNet();
            setTimeout(() => window.audioEngine.playBoo(), 200);
          }
        }
      }

    } else if (action.startsWith('gk')) {
      if (isPerfect || isSuccess) {
        this.playerMatchStats.saves += 1;
        this.playerMatchStats.rating += 1.1;
        visualType = 'gk_save';
        narrative = `🧤 [${this.minute}'] DEFESA DO SÉCULO! Você agigantou-se no 1 contra 1 e espalmou o chute à queima-roupa com as pontas dos dedos!`;
        logType = 'normal';
        if (window.audioEngine) {
          window.audioEngine.playSave();
          setTimeout(() => window.audioEngine.playCheer(), 200);
        }
      } else {
        this.addGoal(false);
        this.playerMatchStats.rating = Math.max(4.0, this.playerMatchStats.rating - 0.4);
        visualType = 'goal_net';
        narrative = `⚽ [${this.minute}'] O atacante teve frieza e tocou no canto sem chances de intervenção.`;
        logType = 'opp_goal';
        if (window.audioEngine) {
          window.audioEngine.playNet();
          setTimeout(() => window.audioEngine.playBoo(), 200);
        }
      }
    }

    this.lastOutcome = {
      minute: this.minute,
      narrative,
      logType,
      visualType,
      isSuccess,
      isPerfect
    };

    this.eventsLog.unshift({
      minute: this.minute,
      type: logType,
      text: narrative,
      isUser: true
    });
  }

  addGoal(isUserTeam) {
    if (this.isHome) {
      if (isUserTeam) this.homeScore += 1;
      else this.awayScore += 1;
    } else {
      if (isUserTeam) this.awayScore += 1;
      else this.homeScore += 1;
    }
  }

  // Avaliação do Treinador em Tempo Real a cada 10 minutos
  evaluateCoachCheck(minute) {
    if (this.career.type !== 'player' || this.playerMatchStats.isSubstituted) return;

    const stats = this.playerMatchStats;
    const coach = this.coach;

    // Cálculo das contribuições positivas vs erros
    const positiveScore = (stats.goals * 3.5) + (stats.assists * 2.8) + (stats.passesCompleted * 0.25) +
                          (stats.dribblesSuccess * 0.6) + (stats.tackles * 0.9) + (stats.saves * 1.2);
    const negativeScore = (stats.passesFailed * 0.6) + (stats.dribblesFailed * 0.8) + (stats.foulsCommitted * 0.6) +
                          (stats.yellowCard ? 2.5 : 0);

    const netContribution = positiveScore - negativeScore;
    const ratingGap = 6.0 - stats.rating; // Se nota < 6.0, gera pressão

    // Ajuste pela personalidade do técnico
    // strictness alta = mais sensível a erros; patience alta = tolera início ruim
    let calculatedRisk = 0;
    if (ratingGap > 0) {
      calculatedRisk += ratingGap * (coach.strictness * 0.4);
    }
    if (netContribution < 0) {
      calculatedRisk += Math.abs(netContribution) * 4;
    }

    // Se o jogador estiver cansado (fadiga > 75)
    if (this.career.player.fatigue > 75) {
      calculatedRisk += (this.career.player.fatigue - 75) * 1.2;
    }

    // Desconto de paciência do técnico nos primeiros 35 minutos
    if (minute <= 35) {
      calculatedRisk = calculatedRisk * (1 - (coach.patience / 100));
    }

    // Se o time estiver perdendo e o atleta estiver mal, urgência sobe
    const isLosing = this.isHome ? this.homeScore < this.awayScore : this.awayScore < this.homeScore;
    if (isLosing && ratingGap > 0.3) {
      calculatedRisk += 15;
    }

    // Se o jogador marcou gol ou deu assistência, o risco é zerado
    if (stats.goals > 0 || stats.assists > 0 || stats.rating >= 7.0) {
      calculatedRisk = Math.max(0, calculatedRisk - 40);
    }

    this.coachEvaluation.subRisk = Math.max(0, Math.min(100, Math.round(calculatedRisk)));
    this.coachEvaluation.trust = Math.max(10, Math.min(100, Math.round(100 - (this.coachEvaluation.subRisk * 0.8))));
    this.coachEvaluation.lastCheckMinute = minute;

    // Atualizar feedback textual da comissão técnica
    if (this.coachEvaluation.subRisk >= 75) {
      this.coachEvaluation.feedback = 'Treinador inquieto no banco. Risco iminente de substituição!';
    } else if (this.coachEvaluation.subRisk >= 40) {
      this.coachEvaluation.feedback = 'Treinador cobrando maior intensidade e acerto nos passes.';
    } else if (stats.rating >= 7.5) {
      this.coachEvaluation.feedback = 'Treinador aplaudindo sua movimentação e entrega tática!';
    } else {
      this.coachEvaluation.feedback = 'Cumprindo o papel tático determinado no vestiário.';
    }

    // Executar substituição se risco atingir o limite e estiver no momento de trocas do técnico
    if (this.coachEvaluation.subRisk >= 85 && minute >= (coach.subTiming - 10)) {
      this.playerMatchStats.isSubstituted = true;
      this.eventsLog.unshift({
        minute: minute,
        type: 'sub',
        text: `🔁 [${minute}'] SUBSTITUIÇÃO: O treinador ${coach.name} decide te tirar de campo devido à queda de rendimento. Você vai para o banco de reservas.`,
        isUser: true
      });
      this.coachEvaluation.feedback = 'Substituído pela comissão técnica para tentar mudar o ritmo do jogo.';
      if (window.audioEngine) window.audioEngine.playWhistle('foul');
    }
  }

  // Simulação com cálculo de força REALISTA (clubes 5 estrelas são muito favoritos sobre clubes de 2 estrelas)
  tickSimulation(minutesStep = 5) {
    if (this.isFinished || this.isPausedForDecision) return;

    this.minute += minutesStep;
    if (this.career.type === 'player') {
      this.playerMatchStats.minutes = this.minute;
    }

    // Avaliação do Treinador a cada 10 minutos (10', 20', 30', 40', 50', 60', 70', 80')
    if (this.minute % 10 === 0 && this.minute < 90) {
      this.evaluateCoachCheck(this.minute);
    }

    const userClubOvr = this.userClub.ovr;
    const oppOvr = this.oppClub.ovr;
    
    // Diferença de força equilibrada e justa (evita bots perfeitos e punição injusta)
    const ovrDiff = userClubOvr - oppOvr;
    const userGoalProb = Math.max(7, Math.min(28, 14 + ovrDiff * 0.6));
    const oppGoalProb = Math.max(3, Math.min(18, 9 - ovrDiff * 0.5));

    // Pausas interativas para tomada de decisão (no 1º tempo e no 2º tempo)
    if (this.career.type === 'player' && !this.playerMatchStats.isSubstituted && !this.playerMatchStats.isInjuredInMatch) {
      if ((this.minute === 25 || this.minute === 65) && Math.random() < 0.9) {
        this.isPausedForDecision = true;
        this.currentDecision = this.generateDecisionPoint(this.minute);
        if (window.audioEngine) window.audioEngine.playWhistle('short');
        return;
      }
    }

    const roll = Math.random() * 100;
    if (roll < userGoalProb) {
      this.addGoal(true);
      this.eventsLog.unshift({
        minute: this.minute,
        type: 'goal',
        text: `⚽ [${this.minute}'] GOL DO ${this.userClub.name.toUpperCase()}! Jogada envolvente pela ponta termina com a bola na rede!`,
        isUser: false
      });
      if (window.audioEngine) {
        window.audioEngine.playNet();
        setTimeout(() => window.audioEngine.playCheer(), 200);
      }
      if (this.career.type === 'player') this.playerMatchStats.rating += 0.2;
    } else if (roll < (userGoalProb + oppGoalProb)) {
      this.addGoal(false);
      this.eventsLog.unshift({
        minute: this.minute,
        type: 'opp_goal',
        text: `⚽ [${this.minute}'] Gol do ${this.oppClub.name}. Finalização no canto sem chances de defesa.`,
        isUser: false
      });
      if (window.audioEngine) {
        window.audioEngine.playNet();
        setTimeout(() => window.audioEngine.playBoo(), 200);
      }
      if (this.career.type === 'player') this.playerMatchStats.rating = Math.max(4.5, this.playerMatchStats.rating - 0.1);
    } else if (roll < (userGoalProb + oppGoalProb + 8)) {
      this.eventsLog.unshift({
        minute: this.minute,
        type: 'foul',
        text: `🟨 [${this.minute}'] Disputa acirrada de bola no meio-campo com falta marcada pelo árbitro.`,
        isUser: false
      });
      if (window.audioEngine) window.audioEngine.playWhistle('foul');
    }

    if (this.minute >= 90) {
      this.finishMatch();
    }
  }

  finishMatch() {
    this.minute = 90;
    this.isFinished = true;
    this.fixture.played = true;
    this.fixture.homeScore = this.homeScore;
    this.fixture.awayScore = this.awayScore;

    if (window.audioEngine) {
      window.audioEngine.playWhistle('fulltime');
      window.audioEngine.stopStadiumAmbience();
    }

    const userClubWon = this.isHome ? this.homeScore > this.awayScore : this.awayScore > this.homeScore;
    const isDraw = this.homeScore === this.awayScore;
    const resultType = userClubWon ? 'win' : isDraw ? 'draw' : 'loss';

    const userTableEntry = this.career.leagueTable.find(t => t.clubId === this.userClub.id);
    const oppTableEntry = this.career.leagueTable.find(t => t.clubId === this.oppClub.id);

    const userGoals = this.isHome ? this.homeScore : this.awayScore;
    const oppGoals = this.isHome ? this.awayScore : this.homeScore;

    if (userTableEntry) {
      userTableEntry.played += 1;
      userTableEntry.goalsFor += userGoals;
      userTableEntry.goalsAgainst += oppGoals;
      userTableEntry.goalDifference = userTableEntry.goalsFor - userTableEntry.goalsAgainst;

      if (userClubWon) {
        userTableEntry.won += 1;
        userTableEntry.points += 3;
      } else if (isDraw) {
        userTableEntry.drawn += 1;
        userTableEntry.points += 1;
      } else {
        userTableEntry.lost += 1;
      }
    }

    if (oppTableEntry) {
      oppTableEntry.played += 1;
      oppTableEntry.goalsFor += oppGoals;
      oppTableEntry.goalsAgainst += userGoals;
      oppTableEntry.goalDifference = oppTableEntry.goalsFor - oppTableEntry.goalsAgainst;
      if (!userClubWon && !isDraw) {
        oppTableEntry.won += 1;
        oppTableEntry.points += 3;
      } else if (isDraw) {
        oppTableEntry.drawn += 1;
        oppTableEntry.points += 1;
      } else {
        oppTableEntry.lost += 1;
      }
    }

    if (this.career.type === 'player') {
      const p = this.career.player;
      p.currentSeasonStats.matches += 1;
      p.currentSeasonStats.goals += this.playerMatchStats.goals;
      p.currentSeasonStats.assists += this.playerMatchStats.assists;
      p.currentSeasonStats.minutesPlayed += this.playerMatchStats.minutes;
      
      const finalRating = Math.round(Math.min(10.0, Math.max(4.0, this.playerMatchStats.rating)) * 10) / 10;
      this.playerMatchStats.rating = finalRating;
      p.currentSeasonStats.ratingSum += finalRating;
      p.form = finalRating;

      p.careerStats.matches += 1;
      p.careerStats.goals += this.playerMatchStats.goals;
      p.careerStats.assists += this.playerMatchStats.assists;

      p.fatigue = Math.min(100, p.fatigue + Math.round(15 * this.matchContext.fatigueRate));
      p.fitness = Math.max(20, p.fitness - 20);

      // =======================================================================
      // SISTEMA DE RECOMPENSA DE MOEDAS POR PERFORMANCE
      // =======================================================================
      let coinsEarned = 100;
      const breakdown = [
        { label: 'Participação na partida', amount: 100 }
      ];

      if (userClubWon) {
        coinsEarned += 150;
        breakdown.push({ label: 'Vitória da equipe', amount: 150 });
      } else if (isDraw) {
        coinsEarned += 60;
        breakdown.push({ label: 'Empate conquistado', amount: 60 });
      }

      if (this.playerMatchStats.goals > 0) {
        const gAmount = this.playerMatchStats.goals * 80;
        coinsEarned += gAmount;
        breakdown.push({ label: `Gols marcados (${this.playerMatchStats.goals}x)`, amount: gAmount });
      }

      if (this.playerMatchStats.assists > 0) {
        const aAmount = this.playerMatchStats.assists * 50;
        coinsEarned += aAmount;
        breakdown.push({ label: `Assistências (${this.playerMatchStats.assists}x)`, amount: aAmount });
      }

      const isCleanSheet = (p.position === 'Goleiro' || p.position === 'Zagueiro' || p.position.includes('Lateral') || p.position === 'Volante') && oppGoals === 0;
      if (isCleanSheet) {
        coinsEarned += 100;
        breakdown.push({ label: 'Clean Sheet (Sem sofrer gols)', amount: 100 });
      }

      if (finalRating >= 9.0) {
        coinsEarned += 200;
        breakdown.push({ label: 'Atuação Espetacular (Nota ≥ 9.0)', amount: 200 });
      } else if (finalRating >= 8.0) {
        coinsEarned += 120;
        breakdown.push({ label: 'Grande Desempenho (Nota ≥ 8.0)', amount: 120 });
      } else if (finalRating >= 7.0) {
        coinsEarned += 50;
        breakdown.push({ label: 'Boa Atuação (Nota ≥ 7.0)', amount: 50 });
      }

      p.coins = (p.coins || 0) + coinsEarned;
      this.matchRewards = {
        totalCoins: coinsEarned,
        breakdown: breakdown
      };

      this.career.unlockAchievement('first_match');
      if (this.playerMatchStats.goals >= 1) this.career.unlockAchievement('first_goal');
      if (this.playerMatchStats.goals >= 3) this.career.unlockAchievement('hat_trick');
      if (this.playerMatchStats.assists >= 1) this.career.unlockAchievement('first_assist');
      if (p.careerStats.matches >= 150) this.career.unlockAchievement('club_legend');

      // Gerar evento contextual imediato de pós-jogo (Cobiça, críticas, elogios)
      if (typeof EVENTS_DATA !== 'undefined') {
        this.postMatchEvent = EVENTS_DATA.getPostMatchEvent(this.career, this.playerMatchStats, resultType);
      }
    } else {
      const m = this.career.manager;
      m.currentSeasonStats.matches += 1;
      m.careerStats.matches += 1;
      if (userClubWon) {
        m.currentSeasonStats.wins += 1;
        m.currentSeasonStats.points += 3;
        m.careerStats.wins += 1;
      } else if (isDraw) {
        m.currentSeasonStats.draws += 1;
        m.currentSeasonStats.points += 1;
        m.careerStats.draws += 1;
      } else {
        m.currentSeasonStats.losses += 1;
        m.careerStats.losses += 1;
      }
      m.updateConfidence(resultType);
    }

    SeasonEngine.simulateOtherMatches(this.career);
    NewsEngine.generateMatchNews(this.career, this);
  }
}
