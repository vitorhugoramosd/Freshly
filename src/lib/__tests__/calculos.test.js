// Testes das regras de negócio (prioridade, receitas e economia).
// A data "de hoje" é fixada em 10/11/2026.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { agruparPorPrioridade, resumoEconomia, sugerirReceitas, urgentes } from '../calculos'
import { emojiDo, normalizar } from '../../data/categorias'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 10, 12, 0))
})
afterEach(() => vi.useRealTimers())

// Cria um alimento de teste com valores padrão
let seq = 0
const alimento = (campos) => ({
  id: `a${++seq}`, nome: 'Item', categoria: 'Outros', local: 'Geladeira',
  quantidade: 1, unidade: 'un', preco: null, status: 'ativo', finalizado_em: null, ...campos,
})

describe('RN08 e RN09: o que consumir primeiro', () => {
  const lista = [
    alimento({ nome: 'Iogurte', validade: '2026-11-09' }), // vencido
    alimento({ nome: 'Alface', validade: '2026-11-11' }), // agora
    alimento({ nome: 'Leite', validade: '2026-11-14' }), // breve
    alimento({ nome: 'Arroz', validade: '2027-03-01' }), // depois
    alimento({ nome: 'Pão', validade: '2026-11-10', status: 'consumido' }), // já saiu da lista
  ]

  it('CT-06: separa os alimentos ativos nas quatro faixas', () => {
    const g = agruparPorPrioridade(lista)
    expect(g.vencido.map((a) => a.nome)).toEqual(['Iogurte'])
    expect(g.agora.map((a) => a.nome)).toEqual(['Alface'])
    expect(g.breve.map((a) => a.nome)).toEqual(['Leite'])
    expect(g.depois.map((a) => a.nome)).toEqual(['Arroz'])
  })

  it('CT-09: alerta só para vencidos ou que vencem em até 2 dias (RN10)', () => {
    expect(urgentes(lista).map((a) => a.nome)).toEqual(['Iogurte', 'Alface'])
  })

  it('CT-07: consumidos e descartados não aparecem nas faixas (RN08)', () => {
    const g = agruparPorPrioridade(lista)
    const todos = [...g.vencido, ...g.agora, ...g.breve, ...g.depois]
    expect(todos.find((a) => a.nome === 'Pão')).toBeUndefined()
  })
})

describe('RN11 e RN12: sugestão de receitas', () => {
  it('CT-11: coloca primeiro a receita que usa o que vence antes', () => {
    const lista = [
      alimento({ nome: 'Tomate', validade: '2026-11-11' }), // agora (peso 3)
      alimento({ nome: 'Banana', validade: '2026-11-25' }), // depois (peso 1)
    ]
    const receitas = sugerirReceitas(lista)
    expect(receitas[0].usados.map((a) => a.nome)).toContain('Tomate')
    const vitamina = receitas.find((r) => r.id === 'vitamina')
    expect(vitamina.usados.map((a) => a.nome)).toEqual(['Banana'])
  })

  it('CT-11: ignora acentos e não usa alimento vencido', () => {
    const lista = [
      alimento({ nome: 'Feijão preto', validade: '2026-11-20' }),
      alimento({ nome: 'Ovos', validade: '2026-11-05' }), // vencido: fica de fora
    ]
    const usados = sugerirReceitas(lista).flatMap((r) => r.usados.map((a) => a.nome))
    expect(usados).toContain('Feijão preto')
    expect(usados).not.toContain('Ovos')
  })

  it('CT-12: sem alimentos cadastrados, não sugere receita', () => {
    expect(sugerirReceitas([])).toEqual([])
  })
})

describe('RN13, RN14 e RN15: economia do mês', () => {
  const lista = [
    // consumido em 08/11, 2 dias antes de vencer: conta como "salvo"
    alimento({ nome: 'Leite', preco: 5.9, validade: '2026-11-10', status: 'consumido', finalizado_em: '2026-11-08T15:00:00' }),
    // consumido longe do vencimento: economiza, mas não é "salvo"
    alimento({ nome: 'Arroz', preco: 25, validade: '2027-01-01', status: 'consumido', finalizado_em: '2026-11-03T15:00:00' }),
    // descartado neste mês
    alimento({ nome: 'Pão', preco: 9, validade: '2026-11-01', status: 'descartado', finalizado_em: '2026-11-02T10:00:00' }),
    // descartado no mês passado
    alimento({ nome: 'Morango', preco: 12, validade: '2026-10-10', status: 'descartado', finalizado_em: '2026-10-12T10:00:00' }),
    alimento({ nome: 'Couve', preco: 4, validade: '2026-10-10', status: 'descartado', finalizado_em: '2026-10-15T10:00:00' }),
  ]

  it('CT-10: soma o preço do que foi consumido no mês', () => {
    const r = resumoEconomia(lista)
    expect(r.economizado).toBeCloseTo(30.9)
    expect(r.consumidosNoPrazo).toBe(2)
  })

  it('CT-10: conta como "salvo" quem foi consumido a 3 dias ou menos do vencimento', () => {
    expect(resumoEconomia(lista).salvos).toBe(1)
  })

  it('CT-10: compara o desperdício com o mês anterior', () => {
    const r = resumoEconomia(lista)
    expect(r.desperdicados).toBe(1)
    expect(r.perdido).toBe(9)
    expect(r.desperdicadosMesAnterior).toBe(2)
    expect(r.percentualNoPrazo).toBe(67) // 2 consumidos de 3 finalizados
  })

  it('CT-10: alimento sem preço não quebra a conta', () => {
    const r = resumoEconomia([alimento({ preco: null, validade: '2026-11-10', status: 'consumido', finalizado_em: '2026-11-09T10:00:00' })])
    expect(r.economizado).toBe(0)
  })
})

describe('Busca e ícones', () => {
  it('CT-16: a busca ignora acentos e maiúsculas', () => {
    expect(normalizar('  Feijão Preto ')).toBe('feijao preto')
  })
  it('CT-17: escolhe o ícone pelo nome e, se não achar, pela categoria (RF19)', () => {
    expect(emojiDo({ nome: 'Tomate cereja', categoria: 'Outros' })).toBe('🍅')
    expect(emojiDo({ nome: 'Coisa estranha', categoria: 'Laticínios' })).toBe('🥛')
  })
})
