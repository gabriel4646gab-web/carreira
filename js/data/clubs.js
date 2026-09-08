// Banco de dados autêntico de clubes de futebol com NOMES PARODIADOS, FORÇA REALISTA E ESTRELAS
// Nenhum nome de clube real é exibido diretamente na interface.

const CLUBS_DATA = [
  // ==========================================
  // ★★★★★ / ★★★★½ GIGANTES MUNDIAIS & GRANDES EUROPEUS
  // ==========================================
  { 
    id: 'rma', 
    realRef: 'Real Madrid',
    name: 'Real Madruga CF', 
    shortName: 'MAD',
    country: 'Espanha', 
    league: 'La Loucura (Espanha)', 
    stars: 5.0, 
    ovr: 88, atk: 90, mid: 89, def: 87, rep: 96, 
    budget: 220000000, 
    colors: ['#ffffff', '#f59e0b'], 
    logoText: 'RMD' 
  },
  { 
    id: 'mci', 
    realRef: 'Manchester City',
    name: 'Manchester Silly', 
    shortName: 'MSI',
    country: 'Inglaterra', 
    league: 'Inglaterra Super League', 
    stars: 5.0, 
    ovr: 88, atk: 89, mid: 90, def: 87, rep: 95, 
    budget: 210000000, 
    colors: ['#6ba4df', '#102244'], 
    logoText: 'MSI' 
  },
  { 
    id: 'bay', 
    realRef: 'Bayern Munich',
    name: 'Baviera Munique', 
    shortName: 'BAV',
    country: 'Alemanha', 
    league: 'Alemanha Bundesliga', 
    stars: 5.0, 
    ovr: 87, atk: 89, mid: 86, def: 86, rep: 94, 
    budget: 170000000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'BAV' 
  },
  { 
    id: 'bar', 
    realRef: 'Barcelona',
    name: 'Barcelouca FC', 
    shortName: 'BLC',
    country: 'Espanha', 
    league: 'La Loucura (Espanha)', 
    stars: 4.5, 
    ovr: 85, atk: 87, mid: 86, def: 84, rep: 93, 
    budget: 115000000, 
    colors: ['#991b1b', '#1e40af'], 
    logoText: 'BLC' 
  },
  { 
    id: 'liv', 
    realRef: 'Liverpool',
    name: 'Liverpato FC', 
    shortName: 'LVP',
    country: 'Inglaterra', 
    league: 'Inglaterra Super League', 
    stars: 4.5, 
    ovr: 85, atk: 88, mid: 84, def: 85, rep: 91, 
    budget: 130000000, 
    colors: ['#b91c1c', '#059669'], 
    logoText: 'LVP' 
  },
  { 
    id: 'ars', 
    realRef: 'Arsenal',
    name: 'Arsenaldo FC', 
    shortName: 'ARS',
    country: 'Inglaterra', 
    league: 'Inglaterra Super League', 
    stars: 4.5, 
    ovr: 85, atk: 86, mid: 85, def: 85, rep: 89, 
    budget: 125000000, 
    colors: ['#ef4444', '#ffffff'], 
    logoText: 'ARS' 
  },
  { 
    id: 'psg', 
    realRef: 'Paris Saint-Germain',
    name: 'Pangaré Saint-Germain', 
    shortName: 'PSG',
    country: 'França', 
    league: 'Liga Francesa 1', 
    stars: 4.5, 
    ovr: 85, atk: 87, mid: 84, def: 84, rep: 92, 
    budget: 180000000, 
    colors: ['#1e3a8a', '#dc2626'], 
    logoText: 'PSG' 
  },
  { 
    id: 'int_it', 
    realRef: 'Inter Milan',
    name: 'Milão Azul & Preto', 
    shortName: 'MAP',
    country: 'Itália', 
    league: 'Cálcio Italiano A', 
    stars: 4.5, 
    ovr: 85, atk: 86, mid: 85, def: 85, rep: 89, 
    budget: 85000000, 
    colors: ['#1d4ed8', '#0f172a'], 
    logoText: 'MAP' 
  },
  { 
    id: 'lev', 
    realRef: 'Bayer Leverkusen',
    name: 'Bayer Sem-Perder', 
    shortName: 'BSP',
    country: 'Alemanha', 
    league: 'Alemanha Bundesliga', 
    stars: 4.5, 
    ovr: 84, atk: 85, mid: 84, def: 83, rep: 86, 
    budget: 75000000, 
    colors: ['#dc2626', '#111827'], 
    logoText: 'BSP' 
  },

  // ==========================================
  // ★★★★ GRANDES CLUBES EUROPEUS & MUNDIAIS
  // ==========================================
  { 
    id: 'atm', 
    realRef: 'Atlético de Madrid',
    name: 'Atlético dos Colchões', 
    shortName: 'COL',
    country: 'Espanha', 
    league: 'La Loucura (Espanha)', 
    stars: 4.0, 
    ovr: 83, atk: 84, mid: 83, def: 84, rep: 88, 
    budget: 90000000, 
    colors: ['#dc2626', '#1e3a8a'], 
    logoText: 'COL' 
  },
  { 
    id: 'juv_it', 
    realRef: 'Juventus',
    name: 'Juventudo de Turim', 
    shortName: 'JUV',
    country: 'Itália', 
    league: 'Cálcio Italiano A', 
    stars: 4.0, 
    ovr: 83, atk: 82, mid: 83, def: 84, rep: 89, 
    budget: 75000000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'JUV' 
  },
  { 
    id: 'mil', 
    realRef: 'AC Milan',
    name: 'Rossonero de Milão', 
    shortName: 'RSM',
    country: 'Itália', 
    league: 'Cálcio Italiano A', 
    stars: 4.0, 
    ovr: 82, atk: 83, mid: 82, def: 82, rep: 88, 
    budget: 70000000, 
    colors: ['#b91c1c', '#0f172a'], 
    logoText: 'RSM' 
  },
  { 
    id: 'mun', 
    realRef: 'Manchester United',
    name: 'Manchester Unhited', 
    shortName: 'MUN',
    country: 'Inglaterra', 
    league: 'Inglaterra Super League', 
    stars: 4.0, 
    ovr: 82, atk: 83, mid: 82, def: 81, rep: 89, 
    budget: 135000000, 
    colors: ['#dc2626', '#f59e0b'], 
    logoText: 'MUN' 
  },
  { 
    id: 'che', 
    realRef: 'Chelsea',
    name: 'Chelseadão Azul', 
    shortName: 'CHE',
    country: 'Inglaterra', 
    league: 'Inglaterra Super League', 
    stars: 4.0, 
    ovr: 82, atk: 82, mid: 83, def: 81, rep: 87, 
    budget: 140000000, 
    colors: ['#2563eb', '#ffffff'], 
    logoText: 'CHE' 
  },
  { 
    id: 'dor', 
    realRef: 'Borussia Dortmund',
    name: 'Borussia Dorminhoco', 
    shortName: 'BDO',
    country: 'Alemanha', 
    league: 'Alemanha Bundesliga', 
    stars: 4.0, 
    ovr: 82, atk: 83, mid: 82, def: 81, rep: 87, 
    budget: 80000000, 
    colors: ['#fbbf24', '#0f172a'], 
    logoText: 'BDO' 
  },
  { 
    id: 'tot', 
    realRef: 'Tottenham',
    name: 'Tottenpato Esporas', 
    shortName: 'TOT',
    country: 'Inglaterra', 
    league: 'Inglaterra Super League', 
    stars: 4.0, 
    ovr: 82, atk: 83, mid: 82, def: 81, rep: 85, 
    budget: 95000000, 
    colors: ['#1e3a8a', '#ffffff'], 
    logoText: 'TOT' 
  },
  { 
    id: 'ben', 
    realRef: 'Benfica',
    name: 'Benficão da Águia', 
    shortName: 'BEN',
    country: 'Portugal', 
    league: 'Liga Portuguesa Prime', 
    stars: 4.0, 
    ovr: 81, atk: 82, mid: 81, def: 80, rep: 83, 
    budget: 45000000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'BEN' 
  },
  { 
    id: 'spo_pt', 
    realRef: 'Sporting CP',
    name: 'Sportingão dos Leões', 
    shortName: 'SCP',
    country: 'Portugal', 
    league: 'Liga Portuguesa Prime', 
    stars: 4.0, 
    ovr: 81, atk: 83, mid: 81, def: 80, rep: 82, 
    budget: 42000000, 
    colors: ['#059669', '#ffffff'], 
    logoText: 'SCP' 
  },
  { 
    id: 'hil', 
    realRef: 'Al-Hilal',
    name: 'Al-Bilal dos Milhões', 
    shortName: 'HIL',
    country: 'Arábia Saudita', 
    league: 'Liga Saudita Ouro', 
    stars: 4.0, 
    ovr: 81, atk: 84, mid: 81, def: 79, rep: 82, 
    budget: 130000000, 
    colors: ['#2563eb', '#ffffff'], 
    logoText: 'HIL' 
  },
  { 
    id: 'nas', 
    realRef: 'Al-Nassr',
    name: 'Al-Nassro dos Cavaleiros', 
    shortName: 'NAS',
    country: 'Arábia Saudita', 
    league: 'Liga Saudita Ouro', 
    stars: 3.5, 
    ovr: 80, atk: 84, mid: 79, def: 77, rep: 82, 
    budget: 110000000, 
    colors: ['#facc15', '#1d4ed8'], 
    logoText: 'NAS' 
  },

  // ==========================================
  // ★★★★ / ★★★½ BRASIL SÉRIE A (ELITE NACIONAL)
  // ==========================================
  { 
    id: 'fla', 
    realRef: 'Flamengo',
    name: 'Flamingo da Gávea', 
    shortName: 'FLA',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 4.0, 
    ovr: 80, atk: 82, mid: 81, def: 79, rep: 83, 
    budget: 38000000, 
    colors: ['#dc2626', '#0f172a'], 
    logoText: 'FLA' 
  },
  { 
    id: 'pal', 
    realRef: 'Palmeiras',
    name: 'Palmeirense Alviverde', 
    shortName: 'PAL',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 4.0, 
    ovr: 80, atk: 81, mid: 81, def: 80, rep: 82, 
    budget: 35000000, 
    colors: ['#047857', '#ffffff'], 
    logoText: 'PAL' 
  },
  { 
    id: 'bot', 
    realRef: 'Botafogo',
    name: 'Bota-Fogo da Estrela', 
    shortName: 'BOT',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 78, atk: 80, mid: 78, def: 77, rep: 78, 
    budget: 28000000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'BOT' 
  },
  { 
    id: 'cam', 
    realRef: 'Atlético Mineiro',
    name: 'Galo Mineirinho', 
    shortName: 'CAM',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 78, atk: 80, mid: 78, def: 77, rep: 78, 
    budget: 24000000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'CAM' 
  },
  { 
    id: 'sao', 
    realRef: 'São Paulo',
    name: 'San Pablito FC', 
    shortName: 'SAO',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 77, atk: 78, mid: 77, def: 77, rep: 78, 
    budget: 20000000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'SAO' 
  },
  { 
    id: 'cor', 
    realRef: 'Corinthians',
    name: 'Coringão do Povo', 
    shortName: 'COR',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 76, atk: 78, mid: 76, def: 75, rep: 78, 
    budget: 18000000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'COR' 
  },
  { 
    id: 'flu', 
    realRef: 'Fluminense',
    name: 'Fluminoso Tricolor', 
    shortName: 'FLU',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 76, atk: 77, mid: 77, def: 75, rep: 77, 
    budget: 16000000, 
    colors: ['#831843', '#047857'], 
    logoText: 'FLU' 
  },
  { 
    id: 'gre', 
    realRef: 'Grêmio',
    name: 'Grêmio Imortal Tricolor', 
    shortName: 'GRE',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 76, atk: 77, mid: 76, def: 75, rep: 77, 
    budget: 15000000, 
    colors: ['#0284c7', '#0f172a'], 
    logoText: 'GRE' 
  },
  { 
    id: 'int', 
    realRef: 'Internacional',
    name: 'Colorado do Sul', 
    shortName: 'INT',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 76, atk: 77, mid: 76, def: 75, rep: 77, 
    budget: 16000000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'INT' 
  },
  { 
    id: 'cru', 
    realRef: 'Cruzeiro',
    name: 'Cruzeiro Celeste', 
    shortName: 'CRU',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 76, atk: 77, mid: 76, def: 75, rep: 76, 
    budget: 18000000, 
    colors: ['#1d4ed8', '#ffffff'], 
    logoText: 'CRU' 
  },
  { 
    id: 'bah', 
    realRef: 'Bahia',
    name: 'Baêa Tricolor de Aço', 
    shortName: 'BAH',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.5, 
    ovr: 75, atk: 76, mid: 75, def: 74, rep: 74, 
    budget: 22000000, 
    colors: ['#2563eb', '#dc2626'], 
    logoText: 'BAH' 
  },
  { 
    id: 'vas', 
    realRef: 'Vasco da Gama',
    name: 'Vascão da Colina', 
    shortName: 'VAS',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.0, 
    ovr: 74, atk: 76, mid: 74, def: 73, rep: 75, 
    budget: 15000000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'VAS' 
  },
  { 
    id: 'for', 
    realRef: 'Fortaleza',
    name: 'Fortal do Pici', 
    shortName: 'FOR',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.0, 
    ovr: 74, atk: 75, mid: 74, def: 74, rep: 73, 
    budget: 13000000, 
    colors: ['#1d4ed8', '#dc2626'], 
    logoText: 'FOR' 
  },
  { 
    id: 'cap', 
    realRef: 'Athletico Paranaense',
    name: 'Furacão Rubro-Negro', 
    shortName: 'CAP',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.0, 
    ovr: 74, atk: 75, mid: 74, def: 74, rep: 74, 
    budget: 16000000, 
    colors: ['#dc2626', '#0f172a'], 
    logoText: 'CAP' 
  },
  { 
    id: 'rbb', 
    realRef: 'Red Bull Bragantino',
    name: 'Touro Louco Bragança', 
    shortName: 'TLB',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 3.0, 
    ovr: 74, atk: 75, mid: 74, def: 73, rep: 72, 
    budget: 20000000, 
    colors: ['#ffffff', '#dc2626'], 
    logoText: 'TLB' 
  },
  { 
    id: 'vit', 
    realRef: 'Vitória',
    name: 'Leão da Barra Vitória', 
    shortName: 'VIT',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 2.5, 
    ovr: 71, atk: 72, mid: 71, def: 70, rep: 68, 
    budget: 8000000, 
    colors: ['#dc2626', '#0f172a'], 
    logoText: 'VIT' 
  },
  { 
    id: 'cui', 
    realRef: 'Cuiabá',
    name: 'Dourado Pantaneiro', 
    shortName: 'CUI',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 2.5, 
    ovr: 70, atk: 70, mid: 70, def: 71, rep: 67, 
    budget: 7000000, 
    colors: ['#047857', '#eab308'], 
    logoText: 'CUI' 
  },
  { 
    id: 'cri', 
    realRef: 'Criciúma',
    name: 'Tigre Carvoeiro', 
    shortName: 'CRI',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 2.5, 
    ovr: 70, atk: 70, mid: 70, def: 70, rep: 66, 
    budget: 6000000, 
    colors: ['#eab308', '#0f172a'], 
    logoText: 'CRI' 
  },
  { 
    id: 'acg', 
    realRef: 'Atlético Goianiense',
    name: 'Dragão Goiano', 
    shortName: 'ACG',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 2.5, 
    ovr: 70, atk: 70, mid: 70, def: 70, rep: 65, 
    budget: 5500000, 
    colors: ['#dc2626', '#0f172a'], 
    logoText: 'ACG' 
  },
  { 
    id: 'juv', 
    realRef: 'Juventude',
    name: 'Papo da Serra', 
    shortName: 'JUV',
    country: 'Brasil', 
    league: 'Brasileirinho Série A', 
    stars: 2.5, 
    ovr: 69, atk: 69, mid: 69, def: 70, rep: 64, 
    budget: 5000000, 
    colors: ['#047857', '#ffffff'], 
    logoText: 'JUV' 
  },

  // ==========================================
  // ★★★ / ★★½ BRASIL SÉRIE B (DIVISÃO DE ACESSO)
  // ==========================================
  { 
    id: 'san', 
    realRef: 'Santos',
    name: 'Santista Praiano', 
    shortName: 'SAN',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 3.0, 
    ovr: 74, atk: 75, mid: 74, def: 73, rep: 76, 
    budget: 14000000, 
    colors: ['#ffffff', '#0f172a'], 
    logoText: 'SAN' 
  },
  { 
    id: 'spo', 
    realRef: 'Sport Recife',
    name: 'Leão da Ilha Sport', 
    shortName: 'SPO',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.5, 
    ovr: 71, atk: 72, mid: 71, def: 70, rep: 70, 
    budget: 7000000, 
    colors: ['#dc2626', '#0f172a'], 
    logoText: 'SPO' 
  },
  { 
    id: 'cea', 
    realRef: 'Ceará',
    name: 'Vozão Alvinegro', 
    shortName: 'CEA',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.5, 
    ovr: 70, atk: 71, mid: 70, def: 70, rep: 69, 
    budget: 6500000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'CEA' 
  },
  { 
    id: 'cor_pr', 
    realRef: 'Coritiba',
    name: 'Coxa Branca FC', 
    shortName: 'CFC',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.5, 
    ovr: 70, atk: 70, mid: 70, def: 70, rep: 69, 
    budget: 6500000, 
    colors: ['#047857', '#ffffff'], 
    logoText: 'CFC' 
  },
  { 
    id: 'goi', 
    realRef: 'Goiás',
    name: 'Esmeraldino Goiano', 
    shortName: 'GOI',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.5, 
    ovr: 70, atk: 70, mid: 70, def: 70, rep: 68, 
    budget: 6000000, 
    colors: ['#047857', '#ffffff'], 
    logoText: 'GOI' 
  },
  { 
    id: 'ame_mg', 
    realRef: 'América Mineiro',
    name: 'Coelhão das Alterosas', 
    shortName: 'AME',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.5, 
    ovr: 69, atk: 69, mid: 69, def: 69, rep: 67, 
    budget: 5000000, 
    colors: ['#047857', '#0f172a'], 
    logoText: 'AME' 
  },
  { 
    id: 'ava', 
    realRef: 'Avaí',
    name: 'Leão da Ilha Avaí', 
    shortName: 'AVA',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 68, atk: 68, mid: 68, def: 68, rep: 65, 
    budget: 4000000, 
    colors: ['#0284c7', '#ffffff'], 
    logoText: 'AVA' 
  },
  { 
    id: 'nov', 
    realRef: 'Novorizontino',
    name: 'Tigre do Vale Novo', 
    shortName: 'NOV',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 68, atk: 68, mid: 68, def: 68, rep: 63, 
    budget: 3500000, 
    colors: ['#eab308', '#0f172a'], 
    logoText: 'NOV' 
  },
  { 
    id: 'vil', 
    realRef: 'Vila Nova',
    name: 'Tigrão Vermelho Vila', 
    shortName: 'VIL',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 67, atk: 67, mid: 67, def: 67, rep: 63, 
    budget: 3000000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'VIL' 
  },
  { 
    id: 'mir', 
    realRef: 'Mirassol',
    name: 'Leão do Interior Mira', 
    shortName: 'MIR',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 67, atk: 67, mid: 67, def: 67, rep: 62, 
    budget: 3000000, 
    colors: ['#eab308', '#047857'], 
    logoText: 'MIR' 
  },
  { 
    id: 'pon', 
    realRef: 'Ponte Preta',
    name: 'Macaca Alvinegra', 
    shortName: 'PON',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 66, atk: 66, mid: 66, def: 66, rep: 64, 
    budget: 2500000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'PON' 
  },
  { 
    id: 'gua', 
    realRef: 'Guarani',
    name: 'Bugre Campineiro', 
    shortName: 'GUA',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 66, atk: 66, mid: 66, def: 66, rep: 64, 
    budget: 2500000, 
    colors: ['#047857', '#ffffff'], 
    logoText: 'GUA' 
  },
  { 
    id: 'ope', 
    realRef: 'Operário-PR',
    name: 'Fantasma de Ponta Grossa', 
    shortName: 'OPE',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 65, atk: 65, mid: 65, def: 65, rep: 61, 
    budget: 2000000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'OPE' 
  },
  { 
    id: 'pay', 
    realRef: 'Paysandu',
    name: 'Papão da Curuzu', 
    shortName: 'PAY',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 65, atk: 65, mid: 65, def: 65, rep: 63, 
    budget: 2200000, 
    colors: ['#0284c7', '#ffffff'], 
    logoText: 'PAY' 
  },
  { 
    id: 'crb', 
    realRef: 'CRB',
    name: 'Galo Alagoano CRB', 
    shortName: 'CRB',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 65, atk: 65, mid: 65, def: 65, rep: 62, 
    budget: 2100000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'CRB' 
  },
  { 
    id: 'cha', 
    realRef: 'Chapecoense',
    name: 'Chapecoense do Oeste', 
    shortName: 'CHA',
    country: 'Brasil', 
    league: 'Brasileirinho Série B', 
    stars: 2.0, 
    ovr: 65, atk: 65, mid: 65, def: 65, rep: 65, 
    budget: 2300000, 
    colors: ['#047857', '#ffffff'], 
    logoText: 'CHA' 
  },

  // ==========================================
  // ★½ / ★ CLUBES DE TERCEIRA DIVISÃO (BASE / ACESSO HUMILDE)
  // ==========================================
  { 
    id: 'vol', 
    realRef: 'Volta Redonda',
    name: 'Voltaço do Aço', 
    shortName: 'VOL',
    country: 'Brasil', 
    league: 'Brasileirinho Série C', 
    stars: 1.5, 
    ovr: 61, atk: 61, mid: 61, def: 61, rep: 53, 
    budget: 900000, 
    colors: ['#eab308', '#0f172a'], 
    logoText: 'VOL' 
  },
  { 
    id: 'rem', 
    realRef: 'Remo',
    name: 'Leão Azul de Belém', 
    shortName: 'REM',
    country: 'Brasil', 
    league: 'Brasileirinho Série C', 
    stars: 1.5, 
    ovr: 62, atk: 62, mid: 62, def: 62, rep: 57, 
    budget: 1200000, 
    colors: ['#1e3a8a', '#ffffff'], 
    logoText: 'REM' 
  },
  { 
    id: 'fig', 
    realRef: 'Figueirense',
    name: 'Furacão do Estreito', 
    shortName: 'FIG',
    country: 'Brasil', 
    league: 'Brasileirinho Série C', 
    stars: 1.5, 
    ovr: 62, atk: 62, mid: 62, def: 62, rep: 58, 
    budget: 1100000, 
    colors: ['#0f172a', '#ffffff'], 
    logoText: 'FIG' 
  },
  { 
    id: 'sau', 
    realRef: 'São Bernardo',
    name: 'Tigre do ABC', 
    shortName: 'SBO',
    country: 'Brasil', 
    league: 'Brasileirinho Série C', 
    stars: 1.5, 
    ovr: 60, atk: 60, mid: 60, def: 60, rep: 51, 
    budget: 800000, 
    colors: ['#eab308', '#0f172a'], 
    logoText: 'SBO' 
  },
  { 
    id: 'nau', 
    realRef: 'Náutico',
    name: 'Timbu dos Aflitos', 
    shortName: 'NAU',
    country: 'Brasil', 
    league: 'Brasileirinho Série C', 
    stars: 1.5, 
    ovr: 62, atk: 62, mid: 62, def: 62, rep: 58, 
    budget: 1000000, 
    colors: ['#dc2626', '#ffffff'], 
    logoText: 'NAU' 
  },

  // ==========================================
  // CLUBES DAS AMÉRICAS (PARODIADOS)
  // ==========================================
  { 
    id: 'riv', 
    realRef: 'River Plate',
    name: 'Rio da Prata Monumental', 
    shortName: 'RIV',
    country: 'Argentina', 
    league: 'Superliga Portenha', 
    stars: 3.5, 
    ovr: 77, atk: 78, mid: 77, def: 76, rep: 79, 
    budget: 20000000, 
    colors: ['#ffffff', '#dc2626'], 
    logoText: 'RIV' 
  },
  { 
    id: 'boc', 
    realRef: 'Boca Juniors',
    name: 'Bocado Juniors da Bombonera', 
    shortName: 'BOC',
    country: 'Argentina', 
    league: 'Superliga Portenha', 
    stars: 3.5, 
    ovr: 76, atk: 77, mid: 76, def: 75, rep: 80, 
    budget: 18000000, 
    colors: ['#1d4ed8', '#facc15'], 
    logoText: 'BOC' 
  },
  { 
    id: 'mia', 
    realRef: 'Inter Miami',
    name: 'Inter Rosa de Miami', 
    shortName: 'MIA',
    country: 'EUA', 
    league: 'Liga das Estrelas EUA', 
    stars: 3.0, 
    ovr: 76, atk: 81, mid: 76, def: 71, rep: 80, 
    budget: 45000000, 
    colors: ['#f472b6', '#0f172a'], 
    logoText: 'MIA' 
  }
];

// Utilitários de busca de clubes
function getClubById(id) {
  return CLUBS_DATA.find(c => c.id === id) || CLUBS_DATA[0];
}

function getClubsForStartingCareer(playerOvr, playerAge, country = 'Brasil') {
  // Inicialmente, o jogador só pode assinar com clubes de 1 a 2.5 estrelas (OVR 58 a 72)
  let maxClubOvr = playerOvr + 5;
  let minClubOvr = Math.max(58, playerOvr - 6);

  let eligible = CLUBS_DATA.filter(c => c.ovr >= minClubOvr && c.ovr <= maxClubOvr);
  let sameCountry = eligible.filter(c => c.country.toLowerCase() === country.toLowerCase());
  
  if (sameCountry.length >= 3) {
    return sameCountry;
  }
  return eligible.length >= 3 ? eligible : CLUBS_DATA.filter(c => c.stars <= 2.5);
}
