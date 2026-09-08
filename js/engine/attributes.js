// Fórmulas matemáticas para atributos, OVR por posição e evolução realista

// Pesos dos atributos para cada posição no cálculo do Overall (OVR)
const POSITION_WEIGHTS = {
  'Goleiro': {
    gkReflexes: 0.25,
    gkDiving: 0.20,
    gkPositioning: 0.20,
    gkOneOnOne: 0.15,
    gkHandling: 0.10,
    gkKicking: 0.10
  },
  'Zagueiro': {
    tackling: 0.20,
    marking: 0.18,
    interceptions: 0.15,
    strength: 0.15,
    heading: 0.12,
    jumping: 0.10,
    shortPassing: 0.05,
    tacticalAwareness: 0.05
  },
  'Lateral-direito': {
    pace: 0.15,
    acceleration: 0.15,
    crossing: 0.15,
    stamina: 0.15,
    tackling: 0.15,
    interceptions: 0.10,
    shortPassing: 0.10,
    dribbling: 0.05
  },
  'Lateral-esquerdo': {
    pace: 0.15,
    acceleration: 0.15,
    crossing: 0.15,
    stamina: 0.15,
    tackling: 0.15,
    interceptions: 0.10,
    shortPassing: 0.10,
    dribbling: 0.05
  },
  'Volante': {
    tackling: 0.18,
    interceptions: 0.18,
    shortPassing: 0.16,
    stamina: 0.14,
    strength: 0.12,
    vision: 0.10,
    tacticalAwareness: 0.12
  },
  'Meia': {
    shortPassing: 0.22,
    longPassing: 0.18,
    vision: 0.20,
    ballControl: 0.15,
    tacticalAwareness: 0.10,
    composure: 0.10,
    stamina: 0.05
  },
  'Meia-atacante': {
    vision: 0.20,
    shortPassing: 0.18,
    dribbling: 0.18,
    finishing: 0.15,
    longShots: 0.12,
    ballControl: 0.12,
    agility: 0.05
  },
  'Ponta-direita': {
    pace: 0.22,
    acceleration: 0.20,
    dribbling: 0.20,
    crossing: 0.14,
    finishing: 0.14,
    agility: 0.10
  },
  'Ponta-esquerda': {
    pace: 0.22,
    acceleration: 0.20,
    dribbling: 0.20,
    crossing: 0.14,
    finishing: 0.14,
    agility: 0.10
  },
  'Centroavante': {
    finishing: 0.25,
    heading: 0.15,
    strength: 0.15,
    composure: 0.15,
    positioning: 0.15,
    longShots: 0.10,
    firstTouch: 0.05
  }
};

// Calcula o OVR de um jogador baseado nos atributos e na posição
function calculateOverall(attributes, position) {
  const weights = POSITION_WEIGHTS[position] || POSITION_WEIGHTS['Centroavante'];
  let totalScore = 0;
  let totalWeight = 0;

  for (const [attr, weight] of Object.entries(weights)) {
    const val = attributes[attr] || 50;
    totalScore += val * weight;
    totalWeight += weight;
  }

  // Se o total de pesos não somar 1.0 exatamente, normaliza
  const baseOvr = totalWeight > 0 ? totalScore / totalWeight : 60;
  return Math.round(baseOvr);
}

// Gera atributos iniciais compatíveis com a idade e o estilo de jogador
function generateInitialAttributes(position, style, targetOvr = 64) {
  // Base aleatória com variação realista
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const baseVal = targetOvr - rand(2, 6);

  const attrs = {
    // Físicos
    strength: baseVal + rand(-6, 6),
    pace: baseVal + rand(-6, 8),
    acceleration: baseVal + rand(-6, 8),
    agility: baseVal + rand(-6, 6),
    balance: baseVal + rand(-6, 6),
    stamina: baseVal + rand(-4, 8),
    jumping: baseVal + rand(-6, 6),

    // Técnicos
    shortPassing: baseVal + rand(-6, 6),
    longPassing: baseVal + rand(-8, 6),
    crossing: baseVal + rand(-8, 6),
    finishing: baseVal + rand(-8, 6),
    longShots: baseVal + rand(-8, 6),
    ballControl: baseVal + rand(-6, 6),
    dribbling: baseVal + rand(-6, 8),
    firstTouch: baseVal + rand(-6, 6),
    heading: baseVal + rand(-8, 6),
    tackling: baseVal + rand(-8, 6),
    marking: baseVal + rand(-8, 6),
    interceptions: baseVal + rand(-8, 6),

    // Mentais
    vision: baseVal + rand(-6, 6),
    decisions: baseVal + rand(-6, 6),
    positioning: baseVal + rand(-6, 6),
    concentration: baseVal + rand(-6, 6),
    composure: baseVal + rand(-6, 6),
    aggression: baseVal + rand(-6, 6),
    determination: baseVal + rand(-4, 10),
    tacticalAwareness: baseVal + rand(-6, 6),

    // Goleiro
    gkReflexes: baseVal + rand(-6, 8),
    gkDiving: baseVal + rand(-6, 8),
    gkPositioning: baseVal + rand(-6, 6),
    gkHandling: baseVal + rand(-6, 6),
    gkKicking: baseVal + rand(-8, 6),
    gkOneOnOne: baseVal + rand(-6, 8)
  };

  // Ajustes de especialidade por estilo e posição
  if (position === 'Goleiro') {
    attrs.gkReflexes = Math.min(99, attrs.gkReflexes + 12);
    attrs.gkDiving = Math.min(99, attrs.gkDiving + 10);
    attrs.gkPositioning = Math.min(99, attrs.gkPositioning + 10);
    attrs.gkHandling = Math.min(99, attrs.gkHandling + 8);
    attrs.gkOneOnOne = Math.min(99, attrs.gkOneOnOne + 8);
    attrs.gkKicking = Math.min(99, attrs.gkKicking + 6);
  } else if (position === 'Zagueiro') {
    attrs.tackling += 12;
    attrs.marking += 10;
    attrs.interceptions += 10;
    attrs.strength += 8;
    attrs.heading += 8;
  } else if (position.includes('Lateral')) {
    attrs.pace += 10;
    attrs.acceleration += 10;
    attrs.stamina += 10;
    attrs.crossing += 8;
    attrs.tackling += 6;
  } else if (position === 'Volante') {
    attrs.tackling += 10;
    attrs.interceptions += 10;
    attrs.shortPassing += 8;
    attrs.stamina += 8;
    attrs.tacticalAwareness += 8;
  } else if (position === 'Meia' || position === 'Meia-atacante') {
    attrs.shortPassing += 10;
    attrs.vision += 12;
    attrs.ballControl += 10;
    attrs.dribbling += 8;
    attrs.composure += 8;
  } else if (position.includes('Ponta')) {
    attrs.pace += 12;
    attrs.acceleration += 12;
    attrs.dribbling += 12;
    attrs.agility += 8;
    attrs.crossing += 8;
  } else if (position === 'Centroavante') {
    attrs.finishing += 14;
    attrs.positioning += 10;
    attrs.heading += 8;
    attrs.composure += 8;
    attrs.strength += 6;
  }

  // Limita valores entre 35 e 99
  for (const k in attrs) {
    attrs[k] = Math.max(35, Math.min(99, attrs[k]));
  }

  return attrs;
}

// Calcula o valor de mercado realista baseado em OVR, Idade e Posição
function calculateMarketValue(ovr, age, position) {
  let baseValue = 0;
  if (ovr < 60) baseValue = 150000;
  else if (ovr < 65) baseValue = 450000;
  else if (ovr < 70) baseValue = 1200000;
  else if (ovr < 75) baseValue = 4500000;
  else if (ovr < 80) baseValue = 15000000;
  else if (ovr < 85) baseValue = 45000000;
  else if (ovr < 90) baseValue = 90000000;
  else baseValue = 140000000;

  // Ajuste de idade (jovens valorizam muito mais por potencial)
  let ageMultiplier = 1.0;
  if (age <= 21) ageMultiplier = 1.5;
  else if (age <= 24) ageMultiplier = 1.25;
  else if (age <= 28) ageMultiplier = 1.0;
  else if (age <= 31) ageMultiplier = 0.75;
  else if (age <= 34) ageMultiplier = 0.45;
  else ageMultiplier = 0.20;

  return Math.round(baseValue * ageMultiplier);
}

// Calcula salário semanal sugerido
function calculateWeeklyWage(ovr, age, clubTier) {
  let baseWage = 1000;
  if (ovr < 65) baseWage = 2500;
  else if (ovr < 70) baseWage = 8000;
  else if (ovr < 75) baseWage = 22000;
  else if (ovr < 80) baseWage = 55000;
  else if (ovr < 85) baseWage = 130000;
  else if (ovr < 90) baseWage = 250000;
  else baseWage = 400000;

  let tierBonus = clubTier === 1 ? 1.4 : clubTier === 2 ? 1.0 : 0.6;
  return Math.round(baseWage * tierBonus);
}
