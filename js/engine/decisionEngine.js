// Motor de Inteligência Contextual de Decisões em Campo
// Gera situações dinâmicas, opções com status 🟢 Boa / 🟡 Arriscada / 🔴 Muito Arriscada / 🔒 Bloqueada com justificativas
// e metadados de ilustração para o VisualEngine.

class DecisionEngine {
  static generateContextualScenario(player, match, minute) {
    const pos = player.position;
    const oppClub = match.oppClub;
    const isFatigued = player.fatigue > 70;
    const oppStronger = oppClub.ovr > player.ovr + 5;

    // Catálogo rico e dinâmico de situações contextuais
    const situations = [];

    if (pos === 'Goleiro') {
      situations.push(
        {
          id: 'gk_1v1_corner',
          visualType: '1v1_duel',
          visualOptions: { side: 'center' },
          title: 'MOMENTO DECISIVO: 1 CONTRA 1 NO CANTO DA ÁREA',
          description: `O atacante do ${oppClub.name} escapa em diagonal e prepara o chute com pouco ângulo!`,
          zone: 'Pequena Área',
          options: [
            {
              title: 'Fechar o ângulo na trave e espalmar firme',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'gk_angle',
              primaryAttr: 'gkPositioning',
              secondaryAttr: 'gkReflexes',
              difficulty: 36,
              reason: 'Seu posicionamento está perfeito para cortar o chute no primeiro poste.'
            },
            {
              title: 'Sair de carrinho nos pés do atacante',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'gk_slide',
              primaryAttr: 'gkOneOnOne',
              secondaryAttr: 'decisions',
              difficulty: 48,
              reason: 'Risco de cometer pênalti caso o atacante dê um toque sutil para o lado.'
            },
            {
              title: 'Ficar congelado no centro da meta esperando cabeceio',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'O adversário está com a bola nos pés, não há cruzamento no alto.'
            }
          ]
        },
        {
          id: 'gk_aerial_cross',
          visualType: 'aerial_duel',
          visualOptions: {},
          title: 'CRUZAMENTO FECHADO NA PEQUENA ÁREA',
          description: `A bola viaja alta na área e o centroavante adversário sobe no segundo pau!`,
          zone: 'Área do Goleiro',
          options: [
            {
              title: 'Sair socando a bola para longe',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'gk_punch',
              primaryAttr: 'gkHandling',
              secondaryAttr: 'strength',
              difficulty: 38,
              reason: 'Você tem a vantagem do alcance dos braços contra o zagueiro.'
            },
            {
              title: 'Tentar segurar a bola no ar no meio do tumulto',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'gk_catch',
              primaryAttr: 'gkHandling',
              secondaryAttr: 'composure',
              difficulty: 50,
              reason: 'Risco de soltar a bola no pé do atacante se houver trombada.'
            },
            {
              title: 'Pedir impedimento parado',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'O lateral dava condições legais aos atacantes.'
            }
          ]
        }
      );
    } else if (pos === 'Zagueiro' || pos.includes('Lateral') || pos === 'Volante') {
      situations.push(
        {
          id: 'def_2v1_counter',
          visualType: 'defense_clearance',
          visualOptions: {},
          title: 'LANCE CRUCIAL: 2 CONTRA 1 NO CONTRA-ATAQUE',
          description: `Dois atletas do ${oppClub.name} avançam tabelando. Um ponta tenta ultrapassar em velocidade.`,
          zone: 'Entrada da Grande Área',
          options: [
            {
              title: 'Cercar a linha de passe e induzir o chute sem ângulo',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'marking_contain',
              primaryAttr: 'marking',
              secondaryAttr: 'tacticalAwareness',
              difficulty: 38,
              reason: 'Você tem apoio do lateral que vem na cobertura pelo centro.'
            },
            {
              title: 'Dar o bote agressivo no chão (Carrinho)',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'tackle_slide',
              primaryAttr: 'tackling',
              secondaryAttr: 'agility',
              difficulty: 48,
              reason: 'Se errar o tempo da bola, o rival sai cara a cara com o goleiro.'
            },
            {
              title: 'Puxar a camisa e cometer Falta Tática intencional',
              type: 'high_risk',
              riskLevel: 'red',
              riskLabel: '🔴 Muito arriscada',
              actionType: 'foul_tactical',
              primaryAttr: 'decisions',
              secondaryAttr: 'aggression',
              difficulty: 35,
              reason: 'Evita o gol iminente, mas resultará em cartão amarelo e falta perigosa.'
            },
            {
              title: 'Finalizar de primeira no gol adversário',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'Você está no seu próprio campo defensivo sem a posse da bola.'
            }
          ]
        },
        {
          id: 'def_aerial_clearance',
          visualType: 'aerial_duel',
          visualOptions: {},
          title: 'BOLA ALÇADA NA ÁREA: DISPUTA DE CABEÇA',
          description: `Escanteio venenoso cobrado pelo ${oppClub.name} no primeiro pau!`,
          zone: 'Grande Área Defensiva',
          options: [
            {
              title: 'Subir com força para cabecear para escanteio/lateral',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'header_clear',
              primaryAttr: 'heading',
              secondaryAttr: 'jumping',
              difficulty: 39,
              reason: 'Sua impulsão e envergadura dão vantagem sobre o atacante.'
            },
            {
              title: 'Amortecer no peito para sair jogando com elegância',
              type: 'high_risk',
              riskLevel: 'red',
              riskLabel: '🔴 Muito arriscada',
              actionType: 'chest_control',
              primaryAttr: 'ballControl',
              secondaryAttr: 'composure',
              difficulty: 56,
              reason: 'Pressão alta na pequena área; qualquer erro é gol adversário.'
            },
            {
              title: 'Deixar passar para o goleiro',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'O atacante adversário estava posicionado logo atrás de você.'
            }
          ]
        }
      );
    } else {
      // Meias, Pontas e Atacantes
      situations.push(
        {
          id: 'att_blocked_shot_opp',
          visualType: 'blocked_shot',
          visualOptions: {},
          title: 'FINALIZAÇÃO BLOQUEADA NA MEIA-LUA',
          description: `Você tem a bola dominada na meia-lua, mas o zagueiro fecha sua linha de finalização diretamente para o gol!`,
          zone: 'Entrada da Grande Área',
          options: [
            {
              title: 'Rolar curto para o companheiro livre na ponta',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'pass_open',
              primaryAttr: 'shortPassing',
              secondaryAttr: 'vision',
              difficulty: 36,
              reason: 'Linha de passe totalmente limpa para o companheiro desmarcado.'
            },
            {
              title: 'Calar o marcador com drible de corpo e cortar',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'dribble_cut',
              primaryAttr: 'dribbling',
              secondaryAttr: 'agility',
              difficulty: 49,
              reason: 'O zagueiro está bem plantado com o corpo na sua frente.'
            },
            {
              title: 'Chute de bico de primeira no meio do zagueiro',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'Zagueiro está colado na sua frente bloqueando a linha de chute.'
            }
          ]
        },
        {
          id: 'att_blocked_pass_scenario',
          visualType: 'blocked_pass',
          visualOptions: {},
          title: 'LINHA DE PASSE COBERTA PELO VOLANTE',
          description: `Você tenta acionar o centroavante, mas o volante do ${oppClub.name} intercepta o corredor central!`,
          zone: 'Intermediária Central',
          options: [
            {
              title: 'Conduzir a bola para a lateral abrindo o jogo',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'dribble_wide',
              primaryAttr: 'dribbling',
              secondaryAttr: 'pace',
              difficulty: 37,
              reason: 'O corredor esquerdo está totalmente desguarnecido.'
            },
            {
              title: 'Cavar passe por elevação (Cavadinha por cima)',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'pass_lob',
              primaryAttr: 'vision',
              secondaryAttr: 'shortPassing',
              difficulty: 50,
              reason: 'Exige calibragem perfeita para não dar tempo de cobertura ao zagueiro.'
            },
            {
              title: 'Passe rasteiro em profundidade no meio das pernas',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'O volante adversário está posicionado exatamente na trajetória da bola.'
            }
          ]
        },
        {
          id: 'att_free_teammate_right',
          visualType: 'free_teammate_right',
          visualOptions: { side: 'right' },
          title: 'COMPANHEIRO LIVRE NA PONTA DIREITA',
          description: `A defesa do ${oppClub.name} afunilou no meio, deixando seu ponta livre e em velocidade na direita!`,
          zone: 'Intermediária Direita',
          options: [
            {
              title: 'Inversão precisa de jogo para o ponta disparar',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'pass_switch',
              primaryAttr: 'longPassing',
              secondaryAttr: 'vision',
              difficulty: 36,
              reason: 'O ponta tem 20 metros de campo livre para invadir a área.'
            },
            {
              title: 'Ignorar o companheiro e arriscar drible individual',
              type: 'high_risk',
              riskLevel: 'red',
              riskLabel: '🔴 Fome de bola / Risco',
              actionType: 'solo_run',
              primaryAttr: 'dribbling',
              secondaryAttr: 'composure',
              difficulty: 54,
              reason: 'A defesa está compactada e você corre sério risco de perder a posse.'
            },
            {
              title: 'Cabecear para o gol',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'A bola está dominada nos seus pés no gramado.'
            }
          ]
        },
        {
          id: 'att_surrounded_crowd',
          visualType: 'surrounded_3',
          visualOptions: {},
          title: 'PRESSÃO SUFOCANTE: CERCADO POR 3 MARCADORES',
          description: `Você recebe de costas para o gol e três adversários fecham a blitz imediatamente!`,
          zone: 'Círculo Central / Entrada da Área',
          options: [
            {
              title: 'Passe rápido de primeira de calcanhar / devolução',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'quick_flick',
              primaryAttr: 'ballControl',
              secondaryAttr: 'decisions',
              difficulty: 40,
              reason: 'Tirar a bola da zona de pressão antes do contato físico.'
            },
            {
              title: 'Proteger com o corpo e cavar a falta',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'shield_foul',
              primaryAttr: 'strength',
              secondaryAttr: 'composure',
              difficulty: 46,
              reason: 'O árbitro pode mandar o lance seguir se o contato for leve.'
            },
            {
              title: 'Girar em velocidade contra os três defensores',
              type: 'high_risk',
              riskLevel: 'red',
              riskLabel: '🔴 Muito arriscada',
              actionType: 'spin_dribble',
              primaryAttr: 'agility',
              secondaryAttr: 'dribbling',
              difficulty: 58,
              reason: 'Probabilidade altíssima de desarme e contra-ataque adversário.'
            },
            {
              title: 'Chute colocado na gaveta',
              type: 'blocked',
              riskLevel: 'blocked',
              riskLabel: '🔒 Bloqueada',
              isBlocked: true,
              reason: 'Você está de costas para a meta sem linha de visão do gol.'
            }
          ]
        },
        {
          id: 'att_gk_out_box',
          visualType: 'gk_advanced',
          visualOptions: {},
          title: 'GOLEIRO ADIANTADO FORA DA ÁREA!',
          description: `O goleiro do ${oppClub.name} saiu para cortar e ficou perdido a 15 metros do gol desprotegido!`,
          zone: 'Intermediária Ofensiva',
          options: [
            {
              title: 'Chute por cobertura (Cavadinha de primeira no gol vazio)',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Pintura / Oportunidade rara',
              actionType: 'chip_empty_net',
              primaryAttr: 'longShots',
              secondaryAttr: 'composure',
              difficulty: 40,
              reason: 'A meta está totalmente desguarnecida, basta acertar o alvo.'
            },
            {
              title: 'Acelerar com a bola dominada e tentar driblar o goleiro',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'round_gk',
              primaryAttr: 'pace',
              secondaryAttr: 'dribbling',
              difficulty: 48,
              reason: 'Dá tempo do zagueiro retornar na cobertura sobre a linha do gol.'
            },
            {
              title: 'Passe recuado para os zagueiros',
              type: 'high_risk',
              riskLevel: 'red',
              riskLabel: '🔴 Desperdício colossal',
              actionType: 'waste_pass',
              primaryAttr: 'decisions',
              secondaryAttr: 'tacticalAwareness',
              difficulty: 30,
              reason: 'Perde o momento de ouro de finalizar no gol sem goleiro.'
            }
          ]
        },
        {
          id: 'att_wing_crossing',
          visualType: 'crossing_wing',
          visualOptions: {},
          title: 'BOLA NA LINHA DE FUNDO: CRUZAMENTO NA ÁREA',
          description: `Você atinge a linha de fundo em velocidade com o centroavante pedindo no meio dos zagueiros!`,
          zone: 'Linha de Fundo / Lateral',
          options: [
            {
              title: 'Cruzamento à meia-altura no primeiro pau',
              type: 'favorable',
              riskLevel: 'green',
              riskLabel: '🟢 Boa oportunidade',
              actionType: 'cross_low',
              primaryAttr: 'crossing',
              secondaryAttr: 'shortPassing',
              difficulty: 38,
              reason: 'O companheiro ataca a bola em velocidade na frente do zagueiro.'
            },
            {
              title: 'Cruzamento alto no segundo poste',
              type: 'risky',
              riskLevel: 'yellow',
              riskLabel: '🟡 Arriscada',
              actionType: 'cross_high',
              primaryAttr: 'crossing',
              secondaryAttr: 'vision',
              difficulty: 48,
              reason: 'O goleiro tem tempo de sair do chão para tentar socar a bola.'
            },
            {
              title: 'Finalizar direto para o gol com ângulo zero',
              type: 'high_risk',
              riskLevel: 'red',
              riskLabel: '🔴 Muito arriscada',
              actionType: 'zero_angle_shot',
              primaryAttr: 'finishing',
              secondaryAttr: 'composure',
              difficulty: 62,
              reason: 'Ângulo praticamente nulo na linha lateral da grande área.'
            }
          ]
        }
      );
    }

    const selected = situations[Math.floor(Math.random() * situations.length)];
    selected.minute = minute;
    return selected;
  }
}
