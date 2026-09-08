// Banco de Dados de Jogadores e Estrelas Mundiais com NOMES PARODIADOS e Ratings Autênticos
// Nenhum jogador real aparece com nome original na interface.

const FAMOUS_PLAYERS_PARODIES = [
  // SUPERESTRELAS MUNDIAIS (90+ OVR)
  { realRef: 'Kylian Mbappé', name: 'Kilian Embapê', clubId: 'rma', pos: 'CA', ovr: 91, age: 26, star: true },
  { realRef: 'Erling Haaland', name: 'Erling Raulan', clubId: 'mci', pos: 'CA', ovr: 91, age: 25, star: true },
  { realRef: 'Vinícius Júnior', name: 'Vini Sênior', clubId: 'rma', pos: 'PE', ovr: 90, age: 25, star: true },
  { realRef: 'Jude Bellingham', name: 'Jude Beligol', clubId: 'rma', pos: 'MEI', ovr: 90, age: 22, star: true },
  { realRef: 'Kevin De Bruyne', name: 'Kevin De Brócolis', clubId: 'mci', pos: 'MC', ovr: 90, age: 34, star: true },
  { realRef: 'Rodri', name: 'Rodrigo Farol', clubId: 'mci', pos: 'VOL', ovr: 91, age: 29, star: true },
  { realRef: 'Harry Kane', name: 'Harry Caneludo', clubId: 'bay', pos: 'CA', ovr: 90, age: 32, star: true },

  // CRAQUES GLOBAIS (85 - 89 OVR)
  { realRef: 'Mohamed Salah', name: 'Mohamed Salgado', clubId: 'liv', pos: 'PD', ovr: 89, age: 33, star: true },
  { realRef: 'Robert Lewandowski', name: 'Robert Lewandoso', clubId: 'bar', pos: 'CA', ovr: 88, age: 37, star: true },
  { realRef: 'Lionel Messi', name: 'Lio Mestre', clubId: 'mia', pos: 'PD', ovr: 88, age: 38, star: true },
  { realRef: 'Bukayo Saka', name: 'Bukayo Sapeca', clubId: 'ars', pos: 'PD', ovr: 87, age: 24, star: true },
  { realRef: 'Florian Wirtz', name: 'Florian Virtuoso', clubId: 'lev', pos: 'MEI', ovr: 88, age: 22, star: true },
  { realRef: 'Phil Foden', name: 'Phil Foguete', clubId: 'mci', pos: 'MEI', ovr: 88, age: 25, star: true },
  { realRef: 'Lamine Yamal', name: 'Lamine Maravilha', clubId: 'bar', pos: 'PD', ovr: 82, age: 18, star: true },
  { realRef: 'Cristiano Ronaldo', name: 'Cris Rolando', clubId: 'nas', pos: 'CA', ovr: 86, age: 40, star: true },
  { realRef: 'Neymar Jr', name: 'Neymarcio Jr', clubId: 'hil', pos: 'MEI', ovr: 87, age: 33, star: true },
  { realRef: 'Lautaro Martínez', name: 'Lautaro Martelo', clubId: 'int_it', pos: 'CA', ovr: 89, age: 28, star: true },
  { realRef: 'Rodrygo', name: 'Rodrigo Faísca', clubId: 'rma', pos: 'PD', ovr: 86, age: 24, star: true },
  { realRef: 'Endrick', name: 'Endriko Fenômeno', clubId: 'rma', pos: 'CA', ovr: 79, age: 19, star: true },

  // CRAQUES DO FUTEBOL BRASILEIRO (PARODIADOS)
  { realRef: 'Giorgian De Arrascaeta', name: 'Arrascaneta Mágico', clubId: 'fla', pos: 'MEI', ovr: 81, age: 31, star: true },
  { realRef: 'Pedro', name: 'Pedro Queixada', clubId: 'fla', pos: 'CA', ovr: 80, age: 28, star: true },
  { realRef: 'Gabriel Barbosa', name: 'Gabi-Sem-Gol', clubId: 'fla', pos: 'CA', ovr: 78, age: 29, star: true },
  { realRef: 'Raphael Veiga', name: 'Veiga dos Canhões', clubId: 'pal', pos: 'MEI', ovr: 80, age: 30, star: true },
  { realRef: 'Estêvão', name: 'Estevãozinho Raio', clubId: 'pal', pos: 'PD', ovr: 77, age: 18, star: true },
  { realRef: 'Hulk', name: 'Hulk Esmagador', clubId: 'cam', pos: 'CA', ovr: 80, age: 39, star: true },
  { realRef: 'Paulinho', name: 'Paulinho Flecha', clubId: 'cam', pos: 'PE', ovr: 79, age: 25, star: true },
  { realRef: 'Lucas Moura', name: 'Lucas Relâmpago', clubId: 'sao', pos: 'MEI', ovr: 79, age: 33, star: true },
  { realRef: 'Calleri', name: 'Calleri Raça', clubId: 'sao', pos: 'CA', ovr: 78, age: 32, star: true },
  { realRef: 'Memphis Depay', name: 'Menphis Pandeiro', clubId: 'cor', pos: 'CA', ovr: 80, age: 31, star: true },
  { realRef: 'Rodrigo Garro', name: 'Garro Canhota', clubId: 'cor', pos: 'MEI', ovr: 78, age: 27, star: true },
  { realRef: 'Ganso', name: 'Ganso Maestro', clubId: 'flu', pos: 'MEI', ovr: 77, age: 35, star: true },
  { realRef: 'Jhon Arias', name: 'Arias Colombiano', clubId: 'flu', pos: 'PD', ovr: 79, age: 28, star: true },
  { realRef: 'Luiz Henrique', name: 'Luiz Pantera', clubId: 'bot', pos: 'PD', ovr: 80, age: 24, star: true },
  { realRef: 'Igor Jesus', name: 'Igor Salvador', clubId: 'bot', pos: 'CA', ovr: 78, age: 24, star: true },
  { realRef: 'Alan Patrick', name: 'Alan Patrício 10', clubId: 'int', pos: 'MEI', ovr: 79, age: 34, star: true },
  { realRef: 'Matheus Pereira', name: 'Matheuzinho Bala', clubId: 'cru', pos: 'MEI', ovr: 80, age: 29, star: true },
  { realRef: 'Everton Ribeiro', name: 'Everton Caneta', clubId: 'bah', pos: 'MEI', ovr: 78, age: 36, star: true },
  { realRef: 'Pablo Vegetti', name: 'Vegetti Pirata', clubId: 'vas', pos: 'CA', ovr: 77, age: 36, star: true },
  { realRef: 'Yeferson Soteldo', name: 'Soteldo Baixinho', clubId: 'gre', pos: 'PE', ovr: 77, age: 28, star: true }
];

// Gerador Procedural de Elenco com Nomes Parodiados e Níveis Coerentes
function generateSquadForClub(club) {
  const positions = ['GOL', 'ZAG', 'ZAG', 'LD', 'LE', 'VOL', 'VOL', 'MC', 'MEI', 'PD', 'PE', 'CA', 'GOL', 'ZAG', 'MC', 'CA', 'LD', 'PE'];
  
  const parodyFirstNames = [
    'Marquinhos', 'Juninho', 'Pedrinho', 'Betinho', 'Paulinho', 'Dodô', 'Netinho', 'Chiquinho',
    'Toninho', 'Biel', 'Zezinho', 'Carlinhos', 'Gilsinho', 'Lulinha', 'Djalminha', 'Fabinho',
    'Rafinha', 'Serginho', 'Bruninho', 'Ricardinho', 'Thiaguinho', 'Danilinho', 'Renatinho'
  ];

  const parodyNicknames = [
    'Paredão', 'Canela-de-Vidro', 'Furacão', 'Bala-Dormida', 'Chuteira-Rasgada', 'Caneta-Mole',
    'Dibre-Curto', 'Fominha', 'Bate-Fofo', 'Peito-de-Aço', 'Perna-Torta', 'Tesoura-Voadora',
    'Fita-Métrica', 'Gato-Mestre', 'Cabeça-de-Mola', 'Goleiro-Mão-de-Alface', 'Foguetinho'
  ];

  // Verifica se o clube possui jogadores famosos cadastrados
  const famous = FAMOUS_PLAYERS_PARODIES.filter(p => p.clubId === club.id);

  return positions.map((pos, idx) => {
    // Se tiver um famoso na posição correspondente
    const fam = famous.find(f => f.pos === pos && !famous.used);
    if (fam && idx < 11) {
      famous.used = true;
      return {
        id: `pl_${club.id}_${idx}`,
        name: fam.name,
        position: fam.pos,
        ovr: fam.ovr,
        age: fam.age,
        isStarter: true,
        isStar: true
      };
    }

    // Calcula OVR do atleta em torno da média do clube
    const ovrVariation = Math.floor(Math.random() * 7) - 3;
    const starterBonus = idx < 11 ? 1 : -2;
    const playerOvr = Math.max(50, Math.min(94, club.ovr + ovrVariation + starterBonus));

    const fName = parodyFirstNames[(idx + club.ovr) % parodyFirstNames.length];
    const nick = parodyNicknames[(idx * 3 + club.ovr) % parodyNicknames.length];

    return {
      id: `pl_${club.id}_${idx}`,
      name: `${fName} "${nick}"`,
      position: pos,
      ovr: playerOvr,
      age: 18 + (idx * 2) % 18,
      isStarter: idx < 11,
      isStar: playerOvr >= 84
    };
  });
}
