export const CATEGORIAS = [
  'Frutas',
  'Legumes e verduras',
  'Laticínios',
  'Carnes',
  'Grãos e massas',
  'Bebidas',
  'Congelados',
  'Sobras',
  'Outros',
]

export const LOCAIS = ['Geladeira', 'Freezer', 'Despensa']

export const UNIDADES = ['un', 'kg', 'g', 'L', 'ml', 'pacote']

// Remove acentos e deixa minúsculo, para comparar "Feijão" com "feijao"
export function normalizar(texto) {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

// Emoji por palavra do nome (mais específico) e, se não achar, pela categoria
const POR_NOME = [
  ['tomate', '🍅'], ['alface', '🥬'], ['couve', '🥬'], ['rucula', '🥬'], ['espinafre', '🥬'],
  ['brocolis', '🥦'], ['cenoura', '🥕'], ['batata', '🥔'], ['cebola', '🧅'], ['alho', '🧄'],
  ['pimentao', '🫑'], ['pepino', '🥒'], ['abobrinha', '🥒'], ['milho', '🌽'], ['cogumelo', '🍄'],
  ['banana', '🍌'], ['maca', '🍎'], ['laranja', '🍊'], ['limao', '🍋'], ['uva', '🍇'],
  ['morango', '🍓'], ['abacaxi', '🍍'], ['manga', '🥭'], ['melancia', '🍉'], ['abacate', '🥑'], ['pera', '🍐'],
  ['leite', '🥛'], ['queijo', '🧀'], ['manteiga', '🧈'], ['iogurte', '🥣'], ['ovo', '🥚'],
  ['frango', '🍗'], ['carne', '🥩'], ['bife', '🥩'], ['peixe', '🐟'], ['camarao', '🍤'], ['presunto', '🥓'], ['bacon', '🥓'], ['linguica', '🌭'],
  ['pao', '🍞'], ['arroz', '🍚'], ['macarrao', '🍝'], ['massa', '🍝'], ['feijao', '🫘'], ['aveia', '🥣'],
  ['suco', '🧃'], ['refrigerante', '🥤'], ['cerveja', '🍺'], ['vinho', '🍷'], ['cafe', '☕'],
  ['sorvete', '🍨'], ['bolo', '🍰'], ['chocolate', '🍫'], ['pizza', '🍕'],
]
const POR_CATEGORIA = {
  'Frutas': '🍎', 'Legumes e verduras': '🥬', 'Laticínios': '🥛', 'Carnes': '🥩',
  'Grãos e massas': '🌾', 'Bebidas': '🧃', 'Congelados': '🧊', 'Sobras': '🍲', 'Outros': '📦',
}

export function emojiDo(alimento) {
  const nome = normalizar(alimento.nome)
  for (const [palavra, emoji] of POR_NOME) {
    if (nome.split(/\s+/).some((p) => p.startsWith(palavra))) return emoji
  }
  return POR_CATEGORIA[alimento.categoria] || '📦'
}
