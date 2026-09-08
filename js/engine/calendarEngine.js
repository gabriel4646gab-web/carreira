// ============================================================================
// MOTOR DE CALENDÁRIO E DIAS DA CARREIRA (CALENDAR ENGINE)
// Gerencia a passagem real dos dias, datas, treinos contextuais e eventos diários.
// ============================================================================

class CalendarEngine {
  constructor() {
    this.daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    this.months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  }

  /**
   * Formata uma data para exibição no jogo (ex: SEXTA-FEIRA — 18/09/2026)
   */
  static formatDate(dateObj) {
    if (!dateObj) dateObj = new Date(2026, 7, 14); // 14 de Agosto de 2026
    if (typeof dateObj === 'string') dateObj = new Date(dateObj);

    const days = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
    const dStr = days[dateObj.getDay()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${dStr} — ${day}/${month}/${year}`;
  }

  /**
   * Inicializa ou garante as datas da temporada para o objeto de Carreira.
   */
  static initSeasonDates(career) {
    if (!career.currentDate) {
      career.currentDate = new Date(2026, 7, 14); // Sexta-feira, 14 de Agosto de 2026
    } else if (typeof career.currentDate === 'string') {
      career.currentDate = new Date(career.currentDate);
    }

    // Atribuir datas para todas as fixtures que ainda não possuem
    if (career.fixtures && career.fixtures.length > 0) {
      let matchDate = new Date(2026, 7, 16); // Primeiro jogo no Domingo, 16 de Agosto
      career.fixtures.forEach((f, idx) => {
        if (!f.matchDate) {
          f.matchDate = new Date(matchDate);
          // Avança 7 dias para o próximo jogo
          matchDate.setDate(matchDate.getDate() + 7);
        } else if (typeof f.matchDate === 'string') {
          f.matchDate = new Date(f.matchDate);
        }
      });
    }

    // Gerar personalidade do treinador se não existir
    if (career.type === 'player' && !career.coach) {
      career.coach = this.generateCoachProfile(career.getCurrentClub());
    }
  }

  /**
   * Gera o perfil e a personalidade do treinador atual.
   */
  static generateCoachProfile(club) {
    const coachNames = [
      'Prof. Adenor Tite', 'Jorge Jesus Fake', 'Abel Ferreira Fake', 'Dorival Jr Paródia',
      'Renato Gaúcho Fake', 'Pep Guardiola Silly', 'Carlo Ancelotti Madruga', 'Jürgen Klopp Pato'
    ];
    const name = coachNames[Math.floor(Math.random() * coachNames.length)];

    return {
      name: name,
      patience: Math.floor(Math.random() * 40) + 40,      // 40 a 80 (Paciência com erros)
      strictness: Math.floor(Math.random() * 40) + 50,    // 50 a 90 (Exigência tática)
      subTiming: Math.floor(Math.random() * 30) + 55,     // 55 a 85 min (Momento médio de substituições)
      youthBias: Math.floor(Math.random() * 50) + 30,     // 30 a 80 (Preferência por jovens vs veteranos)
      trust: 70,                                          // Confiança atual no jogador (0 a 100)
      style: ['Ofensivo Pressionante', 'Equilibrado Posicional', 'Transição Rápida', 'Defensivo e Sólido'][Math.floor(Math.random() * 4)]
    };
  }

  /**
   * Retorna os dados da próxima partida e dias restantes.
   */
  static getNextMatchInfo(career) {
    if (!career.fixtures) return null;
    const nextFixture = career.fixtures.find(f => !f.played);
    if (!nextFixture) return null;

    const cur = new Date(career.currentDate);
    const mDate = new Date(nextFixture.matchDate);
    const diffTime = mDate.getTime() - cur.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const oppClub = CLUBS_DATA.find(c => c.name === nextFixture.opponent || c.id === nextFixture.opponentId) || {
      name: nextFixture.opponent,
      shortName: 'OPP',
      stars: 3.5,
      colors: ['#ef4444', '#ffffff'],
      logoText: 'OPP'
    };

    return {
      fixture: nextFixture,
      matchDateFormatted: this.formatDate(mDate),
      daysLeft: daysLeft,
      isMatchDay: daysLeft === 0,
      oppClub: oppClub
    };
  }

  /**
   * Avança exatamente 1 dia na carreira e processa acontecimentos.
   */
  static advanceOneDay(career) {
    const cur = new Date(career.currentDate);
    cur.setDate(cur.getDate() + 1);
    career.currentDate = cur;

    const nextMatchInfo = this.getNextMatchInfo(career);

    // Recuperação natural de energia / condicionamento do jogador
    if (career.type === 'player' && career.player) {
      career.player.energy = Math.min(100, (career.player.energy || 80) + 6);
      career.player.fatigue = Math.max(0, (career.player.fatigue || 20) - 8);
    }

    // Se hoje é dia de jogo, não gera evento paralelo para focar no confronto
    if (nextMatchInfo && nextMatchInfo.isMatchDay) {
      return {
        type: 'match_day',
        title: '⚽ HOJE É DIA DE JOGO!',
        description: `Confronto decisivo contra o ${nextMatchInfo.oppClub.name}. A equipe está no vestiário pronta para entrar em campo!`,
        matchInfo: nextMatchInfo
      };
    }

    // Gerar evento do dia (Treino, Vida, Torcida, Mídia ou Descanso)
    return this.generateDailyActivity(career, nextMatchInfo);
  }

  /**
   * Gera a atividade ou evento correspondente ao dia da semana.
   */
  static generateDailyActivity(career, nextMatchInfo) {
    const d = new Date(career.currentDate);
    const dayOfWeek = d.getDay(); // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
    const daysLeft = nextMatchInfo ? nextMatchInfo.daysLeft : 3;

    // Se faltar 1 dia para o jogo (Véspera - ex: Sábado)
    if (daysLeft === 1) {
      return {
        type: 'tactical_prep',
        visualType: 'tactical_board',
        title: '📋 VÉSPERA DE JOGO — PREPARAÇÃO TÁTICA FINAL',
        description: `O treinador ${career.coach ? career.coach.name : 'da equipe'} reúne o elenco para passar as instruções e bolas paradas para o duelo contra o ${nextMatchInfo.oppClub.name}.`,
        options: [
          {
            text: 'Focar na análise de vídeos e movimentação tática',
            action: () => {
              if (career.player) {
                career.player.tacticalAwareness = Math.min(99, (career.player.tacticalAwareness || 60) + 1);
                career.player.confidence = Math.min(100, (career.player.confidence || 70) + 4);
              }
              if (career.coach) career.coach.trust = Math.min(100, career.coach.trust + 2);
              return { success: true, msg: 'Você compreendeu as fragilidades do adversário (+1 Inteligência Tática, +4 Confiança).' };
            }
          },
          {
            text: 'Descanso leve e hidratação para estar 100% fisicamente',
            action: () => {
              if (career.player) {
                career.player.energy = 100;
                career.player.fatigue = 0;
              }
              return { success: true, msg: 'Baterias recarregadas para o jogo de amanhã (Energia 100%, Fadiga 0%).' };
            }
          }
        ]
      };
    }

    // Dia de Treino Intenso (Segunda, Terça ou Quarta)
    const isTrainingDay = dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4;
    if (isTrainingDay && Math.random() < 0.7) {
      return this._generateTrainingSession(career);
    }

    // Evento Narrativo de Vida, Torcida, Vestiário ou Mídia
    return EVENTS_DATA.getRandomContextualEvent(career);
  }

  /**
   * Gera uma sessão de treinamento dinâmico com escolhas.
   */
  static _generateTrainingSession(career) {
    const p = career.player;
    const isAttacker = p && ['Centroavante', 'Ponta Direita', 'Ponta Esquerda', 'Segundo Atacante'].includes(p.position);
    const isMid = p && ['Meia Ofensivo', 'Meio-Campo', 'Volante'].includes(p.position);

    const drillChoices = [];

    if (isAttacker) {
      drillChoices.push({
        title: '🎯 Calibração de Finalizações & Chutes na Gaveta',
        attr: 'finishing',
        visualType: 'extra_training',
        desc: 'Série de 100 finalizações com bola rolando e cruzamentos na área.',
        energyCost: 8,
        gain: 1
      });
      drillChoices.push({
        title: '⚡ Treino de Aceleração & Arranque Curto',
        attr: 'acceleration',
        visualType: 'gym_fitness',
        desc: 'Tiros de 20m com colete de tração para explosão muscular.',
        energyCost: 10,
        gain: 1
      });
    } else if (isMid) {
      drillChoices.push({
        title: '📐 Treino de Passes em Profundidade & Visão',
        attr: 'shortPassing',
        visualType: 'tactical_board',
        desc: 'Exercícios de rondo e enfiadas de bola com marcação pressão.',
        energyCost: 7,
        gain: 1
      });
      drillChoices.push({
        title: '🎯 Cobranças de Faltas & Chutes de Fora da Área',
        attr: 'longShots',
        visualType: 'extra_training',
        desc: 'Treino de faltas frontais sobre a barreira de metal.',
        energyCost: 8,
        gain: 1
      });
    } else {
      drillChoices.push({
        title: '🛡️ Desarmes no Chão & Posicionamento Defensivo',
        attr: 'tackling',
        visualType: 'extra_training',
        desc: 'Botes 1x1 e simulação de contenção em contra-ataques.',
        energyCost: 8,
        gain: 1
      });
      drillChoices.push({
        title: '🦘 Impulsão & Disputas Aéreas de Cabeceio',
        attr: 'jumping',
        visualType: 'gym_fitness',
        desc: 'Treinamento de impulsão pliométrica e cabeceio para afastar.',
        energyCost: 9,
        gain: 1
      });
    }

    drillChoices.push({
      title: '🛋️ Trabalho Regenerativo & Hidroterapia (Descanso)',
      attr: 'energy',
      visualType: 'physio_recovery',
      desc: 'Piscina aquecida, massagem miofascial e banheira de gelo.',
      energyCost: -15,
      gain: 0
    });

    const selectedDrill = drillChoices[Math.floor(Math.random() * (drillChoices.length - 1))];
    const restDrill = drillChoices[drillChoices.length - 1];

    return {
      type: 'training_day',
      visualType: selectedDrill.visualType,
      title: `🏃 SESSÃO DE TREINAMENTO NO CT`,
      description: `Dia de trabalho técnico e físico no Centro de Treinamento. O preparador físico definiu a programação de hoje:`,
      options: [
        {
          text: `${selectedDrill.title} (+1 Atributo, -${selectedDrill.energyCost}% Energia)`,
          action: () => {
            if (career.player) {
              career.player[selectedDrill.attr] = Math.min(99, (career.player[selectedDrill.attr] || 60) + selectedDrill.gain);
              career.player.energy = Math.max(20, (career.player.energy || 80) - selectedDrill.energyCost);
              career.player.fatigue = Math.min(100, (career.player.fatigue || 10) + selectedDrill.energyCost);
              if (career.coach) career.coach.trust = Math.min(100, career.coach.trust + 1);
            }
            return { success: true, msg: `Treino finalizado com sucesso! Atributo aprimorado (+1).` };
          }
        },
        {
          text: `${restDrill.title} (+15% Energia)`,
          action: () => {
            if (career.player) {
              career.player.energy = Math.min(100, (career.player.energy || 80) + 15);
              career.player.fatigue = Math.max(0, (career.player.fatigue || 20) - 15);
            }
            return { success: true, msg: `Regeneração concluída! Musculatura relaxada e energia renovada.` };
          }
        }
      ]
    };
  }
}
