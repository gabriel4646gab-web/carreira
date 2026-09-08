// ============================================================================
// BANCO DE DADOS DE EVENTOS NARRATIVOS, DILEMAS E CONSEQUÊNCIAS REAIS
// Inclui eventos positivos, negativos e neutros de vida, torcida, vestiário,
// imprensa e desfechos pós-partida com suporte ao VisualEngine.
// ============================================================================

const EVENTS_DATA = {
  // ==========================================================================
  // EVENTOS DIÁRIOS ENTRE JOGOS (CALENDÁRIO)
  // ==========================================================================
  dailyEvents: [
    // 1. PROVOCAÇÃO DE TORCEDOR (NEGATIVO / DILEMA)
    {
      id: 'fan_heckle_street',
      visualType: 'fans_autograph',
      title: '🚨 PROVOCAÇÃO DE TORCEDOR NA SAÍDA DO CT',
      description: 'Ao parar no semáforo após o treinamento, um torcedor rival começa a filmar com o celular, xingar seu desempenho e fazer gestos provocativos na sua janela.',
      options: [
        {
          text: 'Ignorar completamente, subir o vidro e acelerar com postura profissional',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.professionalism = Math.min(99, (p.professionalism || 70) + 2);
              p.reputation = Math.min(99, (p.reputation || 60) + 1);
            }
            return { success: true, msg: 'Atitude madura e exemplar. A imprensa elogiou seu sangue frio (+2 Profissionalismo).' };
          }
        },
        {
          text: 'Responder verbalmente e rebater as críticas da janela',
          action: (career) => {
            const p = career.player;
            const rnd = Math.random();
            if (p) {
              p.morale = Math.max(10, (p.morale || 70) - 3);
              if (rnd < 0.5) {
                p.reputation = Math.max(10, (p.reputation || 60) - 2);
              }
            }
            return { success: true, msg: 'O vídeo circulou nas redes sociais. Alguns torcedores acharam desnecessário o bate-boca (-3 Moral).' };
          }
        },
        {
          text: 'Sair do carro e tirar satisfação cara a cara na calçada',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.professionalism = Math.max(10, (p.professionalism || 70) - 6);
              p.reputation = Math.max(10, (p.reputation || 60) - 5);
              p.morale = Math.max(10, (p.morale || 70) - 8);
            }
            if (career.coach) career.coach.trust = Math.max(10, career.coach.trust - 10);
            return { success: false, msg: 'CONFUSÃO GENERALIZADA! O vídeo viralizou, a diretoria aplicou uma multa disciplinar e o treinador deu uma dura no vestiário (-10 Confiança do Técnico, -5 Reputação).' };
          }
        }
      ]
    },

    // 2. ACLAMAÇÃO E MÚSICA DA TORCIDA (POSITIVO)
    {
      id: 'fans_chant_song',
      visualType: 'fans_autograph',
      title: '🎶 A TORCIDA CRIOU UMA MÚSICA PARA VOCÊ!',
      description: 'A torcida organizada do clube compôs um cântico em sua homenagem destacando sua garra e categoria. O vídeo da arquibancada cantando bateu 2 milhões de visualizações!',
      options: [
        {
          text: 'Publicar um vídeo de agradecimento e autografar camisas para a torcida',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.morale = Math.min(100, (p.morale || 70) + 8);
              p.confidence = Math.min(100, (p.confidence || 70) + 6);
              p.reputation = Math.min(99, (p.reputation || 60) + 4);
              p.marketValue = Math.round((p.marketValue || 1000000) * 1.05);
            }
            return { success: true, msg: 'Conexão mágica com a torcida! Sua popularidade explodiu e seu valor de mercado valorizou 5% (+8 Moral, +6 Confiança)!' };
          }
        },
        {
          text: 'Agradecer com humildade e pedir foco total na próxima partida',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.professionalism = Math.min(99, (p.professionalism || 70) + 3);
              p.confidence = Math.min(100, (p.confidence || 70) + 5);
            }
            if (career.coach) career.coach.trust = Math.min(100, career.coach.trust + 4);
            return { success: true, msg: 'O treinador adorou a postura humilde e focada (+4 Confiança do Técnico).' };
          }
        }
      ]
    },

    // 3. REUNIÃO E COBRANÇA INDIVIDUAL DO TREINADOR (NEUTRO / DILEMA)
    {
      id: 'coach_private_talk',
      visualType: 'coach_talk',
      title: '👔 CONVERSA PARTICULAR COM O TREINADOR NO CT',
      description: `O treinador ${career => career.coach ? career.coach.name : 'do time'} chamou você na sala da comissão técnica para uma conversa olho no olho sobre seu momento na equipe.`,
      options: [
        {
          text: 'Ouvir atentamente com respeito, absorver as orientações táticas e prometer evolução',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.tacticalAwareness = Math.min(99, (p.tacticalAwareness || 60) + 1);
              p.professionalism = Math.min(99, (p.professionalism || 70) + 2);
            }
            if (career.coach) career.coach.trust = Math.min(100, career.coach.trust + 6);
            return { success: true, msg: 'O treinador ficou satisfeito com sua maturidade e postura profissional (+6 Confiança do Técnico).' };
          }
        },
        {
          text: 'Pedir mais liberdade para criar jogadas e atuar em sua posição favorita',
          action: (career) => {
            const p = career.player;
            const rnd = Math.random();
            if (rnd < 0.6) {
              if (career.coach) career.coach.trust = Math.min(100, career.coach.trust + 2);
              if (p) p.confidence = Math.min(100, (p.confidence || 70) + 4);
              return { success: true, msg: 'O treinador aceitou conceder mais liberdade no esquema tático (+4 Confiança).' };
            } else {
              if (career.coach) career.coach.trust = Math.max(10, career.coach.trust - 4);
              return { success: false, msg: 'O treinador achou você teimoso e exigiu disciplina rigorosa no esquema do time.' };
            }
          }
        }
      ]
    },

    // 4. DISCUSSÃO ACALORADA NO VESTIÁRIO (NEGATIVO / DILEMA)
    {
      id: 'locker_room_tension',
      visualType: 'locker_dispute',
      title: '⚡ CLIMA TENSO NO RACHA DO VESTIÁRIO',
      description: 'Durante o coletivo, um companheiro titular experiente deu uma entrada dura e reclamou aos gritos que você segurou demais a bola.',
      options: [
        {
          text: 'Manter a calma, pedir a bola de novo e responder com bom futebol no gramado',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.composure = Math.min(99, (p.composure || 60) + 1);
              p.professionalism = Math.min(99, (p.professionalism || 70) + 2);
            }
            return { success: true, msg: 'Personalidade forte! O elenco respeitou sua compostura sob pressão (+1 Frieza).' };
          }
        },
        {
          text: 'Bater boca e empurrar o veterano na frente de todo o elenco',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.morale = Math.max(10, (p.morale || 70) - 6);
            }
            if (career.coach) career.coach.trust = Math.max(10, career.coach.trust - 8);
            return { success: false, msg: 'A comissão técnica precisou intervir para separar a briga. O clima no vestiário pesou (-8 Confiança do Técnico).' };
          }
        }
      ]
    },

    // 5. PROPOSTA DE PATROCÍNIO E CHUTEIRAS (POSITIVO)
    {
      id: 'sponsor_deal_boot',
      visualType: 'contract_signing',
      title: '👟 PROPOSTA DE PATROCÍNIO DE MARCA ESPORTIVA',
      description: 'Uma gigante multinacional de materiais esportivos quer assinar um contrato exclusivo para fornecer chuteiras personalizadas e bônus por gols!',
      options: [
        {
          text: 'Assinar o contrato de patrocínio e gravar comercial oficial',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.reputation = Math.min(99, (p.reputation || 60) + 3);
              p.marketValue = Math.round((p.marketValue || 1000000) * 1.08);
              p.morale = Math.min(100, (p.morale || 70) + 5);
            }
            return { success: true, msg: 'Contrato assinado! Sua imagem ganhou projeção internacional (+3 Reputação, +8% Valor de Mercado)!' };
          }
        }
      ]
    },

    // 6. JANTAR DE CONFRATERNIZAÇÃO DO ELENCO (POSITIVO)
    {
      id: 'team_dinner_barbecue',
      visualType: 'party_nightclub',
      title: '🥩 CHURRASCO DE CONFRATERNIZAÇÃO DO ELENCO',
      description: 'O capitão da equipe organizou um churrasco na sua casa para unir o grupo e descontrair a mente na reta final da temporada.',
      options: [
        {
          text: 'Comparecer, resenhar com os companheiros e fortalecer a união do grupo',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.morale = Math.min(100, (p.morale || 70) + 6);
              p.energy = Math.min(100, (p.energy || 80) + 10);
            }
            return { success: true, msg: 'Excelente integração! O ambiente no vestiário está mais leve e unido do que nunca (+6 Moral, +10% Energia).' };
          }
        },
        {
          text: 'Ficar em casa descansando e cuidando da alimentação regrada',
          action: (career) => {
            const p = career.player;
            if (p) {
              p.energy = 100;
              p.fatigue = 0;
            }
            return { success: true, msg: 'Descanso impecável para a parte física.' };
          }
        }
      ]
    }
  ],

  /**
   * Retorna um evento contextual aleatório para o dia de calendário.
   */
  getRandomContextualEvent(career) {
    const list = this.dailyEvents;
    const ev = list[Math.floor(Math.random() * list.length)];
    return {
      type: 'life_event',
      visualType: ev.visualType,
      title: ev.title,
      description: ev.description,
      options: ev.options
    };
  },

  /**
   * Gera um evento de reação imediata pós-jogo baseado no desempenho do atleta.
   */
  getPostMatchEvent(career, stats, result) {
    const isPlayer = career.type === 'player';
    if (!isPlayer || !stats) return null;

    const rating = stats.rating || 6.0;
    const goals = stats.goals || 0;
    const assists = stats.assists || 0;
    const yellowCard = stats.yellowCard || false;

    // 1. ATUAÇÃO DE GALA (Nota >= 8.5 ou 2+ gols/assists)
    if (rating >= 8.5 || (goals + assists) >= 2) {
      return {
        type: 'post_match_glory',
        visualType: 'trophy_award',
        title: '🌟 CRAQUE DO JOGO & DESTAQUE DA RODADA!',
        description: `Com uma nota estratosférica de ${rating.toFixed(1)}, você foi eleito o melhor jogador em campo pela imprensa e reverenciado pela torcida!`,
        options: [
          {
            text: 'Conceder entrevista à beira do campo dedicando a vitória à equipe',
            action: () => {
              career.player.morale = Math.min(100, (career.player.morale || 70) + 8);
              career.player.confidence = Math.min(100, (career.player.confidence || 70) + 8);
              career.player.reputation = Math.min(99, (career.player.reputation || 60) + 3);
              if (career.coach) career.coach.trust = Math.min(100, career.coach.trust + 10);
              return { success: true, msg: 'Repercussão fantástica! O treinador confirmou sua vaga absoluta no time titular (+10 Confiança do Técnico, +8 Moral)!' };
            }
          }
        ]
      };
    }

    // 2. ATUAÇÃO PÉSSIMA / DESASTROSA (Nota <= 5.2)
    if (rating <= 5.2) {
      return {
        type: 'post_match_criticism',
        visualType: 'coach_talk',
        title: '⚠️ ATUAÇÃO MUITO ABAIXO DO ESPERADO',
        description: `Sua atuação foi muito apagada (Nota ${rating.toFixed(1)}). A imprensa esportiva criticou seus erros e o treinador demonstrou insatisfação no vestiário.`,
        options: [
          {
            text: 'Reconhecer os erros, prometer trabalho duro e pedir mais foco nos treinos',
            action: () => {
              career.player.confidence = Math.max(20, (career.player.confidence || 70) - 5);
              if (career.coach) career.coach.trust = Math.max(10, career.coach.trust - 5);
              return { success: true, msg: 'O treinador apreciou a postura de assumir a responsabilidade, mas alertou que exigirá mais na próxima partida.' };
            }
          },
          {
            text: 'Reclamar do esquema tático e culpar a falta de passes dos companheiros',
            action: () => {
              career.player.morale = Math.max(10, (career.player.morale || 70) - 8);
              if (career.coach) career.coach.trust = Math.max(10, career.coach.trust - 12);
              return { success: false, msg: 'O treinador ficou furioso com a desculpa e cogita deixá-lo no banco no próximo confronto (-12 Confiança do Técnico).' };
            }
          }
        ]
      };
    }

    // 3. CARTÃO AMARELO / FALTA DURA
    if (yellowCard) {
      return {
        type: 'post_match_discipline',
        visualType: 'foul_card',
        title: '🟨 ADVERTÊNCIA DISCIPLINAR DO TREINADOR',
        description: 'O treinador chamou sua atenção no vestiário pelo cartão amarelo desnecessário recebido durante o confronto.',
        options: [
          {
            text: 'Prometer maior controle emocional nas disputas de bola',
            action: () => {
              career.player.professionalism = Math.min(99, (career.player.professionalism || 70) + 1);
              return { success: true, msg: 'Compromisso firmado com a comissão técnica.' };
            }
          }
        ]
      };
    }

    return null;
  }
};
