// Competições nacionais, continentais e internacionais
const COMPETITIONS_DATA = {
  'Brasileirão Série A': {
    name: 'Brasileirão Série A',
    type: 'league',
    rounds: 38,
    country: 'Brasil',
    prestige: 82,
    clubs: ['fla', 'pal', 'cam', 'bot', 'sao', 'cor', 'flu', 'gre', 'int', 'cru', 'bah', 'vas', 'for', 'cap', 'rbb', 'vit', 'cui', 'cri', 'acg', 'juv']
  },
  'Brasileirão Série B': {
    name: 'Brasileirão Série B',
    type: 'league',
    rounds: 38,
    country: 'Brasil',
    prestige: 68,
    clubs: ['san', 'spo', 'cea', 'cor_pr', 'goi', 'ame_mg', 'ava', 'nov', 'vil', 'mir', 'pon', 'gua', 'ope', 'pay', 'crb', 'itu', 'cha', 'ama', 'bru', 'bot_sp']
  },
  'Premier League': {
    name: 'Premier League',
    type: 'league',
    rounds: 38,
    country: 'Inglaterra',
    prestige: 95,
    clubs: ['mci', 'ars', 'liv', 'che', 'mun', 'tot', 'new', 'avl', 'bha', 'whu']
  },
  'EFL Championship': {
    name: 'EFL Championship',
    type: 'league',
    rounds: 38,
    country: 'Inglaterra',
    prestige: 74,
    clubs: ['lee', 'bur', 'shu', 'nor', 'wba', 'sun']
  },
  'La Liga': {
    name: 'La Liga',
    type: 'league',
    rounds: 38,
    country: 'Espanha',
    prestige: 92,
    clubs: ['rma', 'bar', 'atm', 'rso', 'ath', 'vil_es', 'bet', 'sev', 'gir']
  },
  'Serie A Italiana': {
    name: 'Serie A Italiana',
    type: 'league',
    rounds: 38,
    country: 'Itália',
    prestige: 89,
    clubs: ['int_it', 'juv_it', 'mil', 'nap', 'ata', 'rom', 'laz']
  },
  'Bundesliga': {
    name: 'Bundesliga',
    type: 'league',
    rounds: 34,
    country: 'Alemanha',
    prestige: 90,
    clubs: ['bay', 'lev', 'dor', 'rbl', 'stu']
  },
  'Copa Libertadores': {
    name: 'Copa Libertadores da América',
    type: 'continental_cup',
    rounds: 13,
    country: 'América do Sul',
    prestige: 88
  },
  'UEFA Champions League': {
    name: 'UEFA Champions League',
    type: 'continental_cup',
    rounds: 13,
    country: 'Europa',
    prestige: 98
  },
  'Copa do Brasil': {
    name: 'Copa do Brasil',
    type: 'national_cup',
    rounds: 8,
    country: 'Brasil',
    prestige: 79
  },
  'Copa do Mundo FIFA': {
    name: 'Copa do Mundo FIFA',
    type: 'world_cup',
    rounds: 7,
    country: 'Mundo',
    prestige: 100
  }
};
