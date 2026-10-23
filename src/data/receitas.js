// Receitas simples. "chaves" são as palavras usadas para cruzar com os
// alimentos cadastrados (sem acento, minúsculas). "extras" são coisas
// que quase toda casa tem e não contam no cruzamento.
export const RECEITAS = [
  {
    id: 'molho-tomate', nome: 'Molho de tomate caseiro', emoji: '🍅', minutos: 20, dificuldade: 'Fácil', tags: ['Saudáveis'],
    chaves: ['tomate', 'cebola', 'alho'], extras: ['azeite', 'sal', 'manjericão'],
    passos: ['Pique os tomates, a cebola e o alho.', 'Refogue a cebola e o alho no azeite até dourar.', 'Junte os tomates, tempere com sal e cozinhe em fogo baixo por 15 minutos, amassando.', 'Finalize com manjericão. Dura 5 dias na geladeira ou 3 meses no freezer.'],
  },
  {
    id: 'salada-folhas', nome: 'Salada de folhas', emoji: '🥗', minutos: 10, dificuldade: 'Fácil', tags: ['Rápidas', 'Saudáveis'],
    chaves: ['alface', 'rucula', 'tomate', 'pepino', 'cenoura'], extras: ['azeite', 'limão', 'sal'],
    passos: ['Lave e seque bem as folhas.', 'Corte os legumes que tiver em casa.', 'Tempere na hora com azeite, limão e sal.'],
  },
  {
    id: 'omelete', nome: 'Omelete de legumes', emoji: '🍳', minutos: 15, dificuldade: 'Fácil', tags: ['Rápidas'],
    chaves: ['ovo', 'tomate', 'cebola', 'queijo', 'espinafre', 'pimentao', 'presunto'], extras: ['sal', 'óleo'],
    passos: ['Bata 2 ou 3 ovos com sal.', 'Pique os legumes que estão perto de vencer e misture.', 'Despeje numa frigideira untada, tampe e cozinhe em fogo baixo até firmar.'],
  },
  {
    id: 'vitamina', nome: 'Vitamina de frutas', emoji: '🥤', minutos: 5, dificuldade: 'Fácil', tags: ['Rápidas', 'Saudáveis'],
    chaves: ['banana', 'leite', 'morango', 'maca', 'manga', 'mamao', 'iogurte', 'aveia'], extras: ['mel'],
    passos: ['Corte as frutas maduras.', 'Bata no liquidificador com leite ou iogurte.', 'Dica: banana muito madura pode ir para o freezer e virar vitamina depois.'],
  },
  {
    id: 'sopa-legumes', nome: 'Sopa de legumes', emoji: '🥣', minutos: 35, dificuldade: 'Fácil', tags: ['Saudáveis'],
    chaves: ['cenoura', 'batata', 'abobrinha', 'cebola', 'chuchu', 'mandioquinha', 'frango'], extras: ['sal', 'caldo'],
    passos: ['Pique todos os legumes em cubos.', 'Refogue a cebola, junte o resto e cubra com água.', 'Cozinhe por 25 minutos. Bata metade no liquidificador para engrossar.'],
  },
  {
    id: 'arroz-forno', nome: 'Arroz de forno com sobras', emoji: '🍚', minutos: 30, dificuldade: 'Fácil', tags: [],
    chaves: ['arroz', 'frango', 'queijo', 'presunto', 'milho', 'ervilha', 'tomate'], extras: ['creme de leite'],
    passos: ['Misture o arroz pronto com as sobras desfiadas ou picadas.', 'Coloque num refratário e cubra com queijo.', 'Leve ao forno a 200°C por 20 minutos.'],
  },
  {
    id: 'frango-legumes', nome: 'Frango salteado com legumes', emoji: '🍗', minutos: 25, dificuldade: 'Média', tags: ['Saudáveis'],
    chaves: ['frango', 'brocolis', 'cenoura', 'pimentao', 'cebola', 'abobrinha'], extras: ['shoyu', 'alho'],
    passos: ['Corte o frango em tiras e tempere.', 'Doure o frango em fogo alto e reserve.', 'Salteie os legumes na mesma panela e junte o frango no final com um pouco de shoyu.'],
  },
  {
    id: 'pao-rabanada', nome: 'Rabanada de pão amanhecido', emoji: '🍞', minutos: 15, dificuldade: 'Fácil', tags: ['Rápidas'],
    chaves: ['pao', 'leite', 'ovo'], extras: ['açúcar', 'canela'],
    passos: ['Corte o pão em fatias.', 'Passe no leite e depois no ovo batido.', 'Frite ou asse até dourar e passe no açúcar com canela.'],
  },
  {
    id: 'macarrao-alho', nome: 'Macarrão alho e óleo com legumes', emoji: '🍝', minutos: 20, dificuldade: 'Fácil', tags: ['Rápidas'],
    chaves: ['macarrao', 'alho', 'brocolis', 'tomate', 'abobrinha', 'cogumelo'], extras: ['azeite', 'sal'],
    passos: ['Cozinhe o macarrão em água com sal.', 'Doure o alho no azeite e junte os legumes picados.', 'Misture o macarrão escorrido e sirva.'],
  },
  {
    id: 'bolo-banana', nome: 'Bolo de banana madura', emoji: '🍌', minutos: 45, dificuldade: 'Média', tags: [],
    chaves: ['banana', 'ovo', 'aveia', 'leite'], extras: ['farinha', 'açúcar', 'fermento'],
    passos: ['Amasse 3 bananas bem maduras.', 'Misture com 2 ovos, 1 xícara de farinha ou aveia, meia de açúcar e 1 colher de fermento.', 'Asse a 180°C por cerca de 35 minutos.'],
  },
  {
    id: 'iogurte-frutas', nome: 'Pote de iogurte com frutas', emoji: '🍓', minutos: 5, dificuldade: 'Fácil', tags: ['Rápidas', 'Saudáveis'],
    chaves: ['iogurte', 'banana', 'morango', 'maca', 'manga', 'aveia', 'granola'], extras: ['mel'],
    passos: ['Pique as frutas.', 'Monte em camadas com iogurte e aveia.', 'Finalize com um fio de mel.'],
  },
  {
    id: 'mexido-carne', nome: 'Mexidão de sobras', emoji: '🍲', minutos: 20, dificuldade: 'Fácil', tags: ['Rápidas'],
    chaves: ['arroz', 'feijao', 'carne', 'ovo', 'linguica', 'couve', 'cebola'], extras: ['farinha de mandioca'],
    passos: ['Refogue a cebola e a carne ou linguiça picada.', 'Junte o feijão, o arroz e a couve.', 'Abra espaço, mexa um ovo na panela e finalize com farinha.'],
  },
]
