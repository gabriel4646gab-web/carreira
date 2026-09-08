// Modelos de manchetes e notícias dinâmicas
const NEWS_TEMPLATES = {
  great_performance: [
    "{playerName} brilha intensamente na vitória do {clubName} e é eleito o craque da partida!",
    "Show em campo: {playerName} comanda o {clubName} em atuação de gala.",
    "Jornalistas e torcida se rendem ao momento espetacular de {playerName} no {clubName}."
  ],
  poor_performance: [
    "{playerName} tem noite apagada e sofre críticas após tropeço do {clubName}.",
    "Falta de pontaria? {playerName} passa despercebido em confronto disputado.",
    "Analistas debatem momento de instabilidade de {playerName} no {clubName}."
  ],
  hat_trick: [
    "NOITE HISTÓRICA! {playerName} anota hat-trick memorável e leva a bola do jogo para casa!",
    "Três gols de {playerName}! Torcida do {clubName} vai ao delírio no estádio.",
    "Incontrolável: {playerName} destrói defesa adversária com 3 gols magistrais."
  ],
  transfer_rumor: [
    "Mercado agitado: Olheiros europeus monitoram evolução de {playerName}.",
    "Especulação: Gigantes do futebol internacional preparam proposta por {playerName}.",
    "Diretoria do {clubName} admite sondagens mas tenta segurar {playerName} com novo contrato."
  ],
  transfer_done: [
    "OFICIAL: {playerName} é anunciado como novo reforço do {clubName}!",
    "BOMBA NO MERCADO! {playerName} assina com {clubName} em transferência milionária.",
    "Apresentado: {playerName} veste a camisa do {clubName} e promete títulos à torcida."
  ],
  injury: [
    "DEPARTAMENTO MÉDICO: {playerName} sofre lesão e desfalca o {clubName}.",
    "Preocupação: {playerName} passará por exames detalhados após sentir dores em campo.",
    "Baixa de peso: {playerName} deve ficar algumas semanas em tratamento na fisioterapia."
  ],
  title_won: [
    "É CAMPEÃO! {clubName} levanta a taça com papel decisivo de {playerName} na campanha.",
    "Festa inesquecível: {clubName} conquista o título da {competitionName}!",
    "Geração de ouro: {playerName} comemora conquista histórica junto à torcida do {clubName}."
  ],
  manager_win_streak: [
    "Trabalho impecável: {managerName} consolida série de vitórias impressionante no {clubName}.",
    "Revolução tática de {managerName} transforma o {clubName} em candidato a títulos.",
    "Diretoria do {clubName} comemora acerto ao bancar o comando de {managerName}."
  ],
  manager_under_pressure: [
    "Corda bamba? Imprensa questiona opções táticas do técnico {managerName}.",
    "Cobrança nas arquibancadas: Torcida pede explicações a {managerName} por fase ruim.",
    "Reunião de emergência: Diretoria avalia permanência de {managerName} no cargo."
  ]
};
