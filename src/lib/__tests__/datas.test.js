// Testes das funções de data. A data "de hoje" é fixada em 10/11/2026
// para os resultados não mudarem conforme o dia em que o teste roda.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { diasAte, formatarReais, hojeISO, prioridade, somarDias, textoVencimento } from '../datas'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 10, 12, 0)) // 10/11/2026 ao meio-dia
})
afterEach(() => vi.useRealTimers())

describe('somarDias e diasAte', () => {
  it('CT-15: soma dias atravessando o fim do mês', () => {
    expect(somarDias('2026-11-28', 5)).toBe('2026-12-03')
  })
  it('CT-15: conta quantos dias faltam para a validade', () => {
    expect(hojeISO()).toBe('2026-11-10')
    expect(diasAte('2026-11-13')).toBe(3)
    expect(diasAte('2026-11-09')).toBe(-1)
  })
})

describe('RN09: faixas de prioridade', () => {
  it('CT-06: classifica cada validade na faixa certa', () => {
    expect(prioridade('2026-11-08')).toBe('vencido') // venceu há 2 dias
    expect(prioridade('2026-11-10')).toBe('agora') // vence hoje
    expect(prioridade('2026-11-12')).toBe('agora') // 2 dias: limite de "agora"
    expect(prioridade('2026-11-13')).toBe('breve') // 3 dias
    expect(prioridade('2026-11-17')).toBe('breve') // 7 dias: limite de "breve"
    expect(prioridade('2026-11-18')).toBe('depois') // 8 dias
  })
})

describe('textoVencimento', () => {
  it('CT-06: escreve o vencimento em linguagem simples', () => {
    expect(textoVencimento('2026-11-10')).toBe('Vence hoje')
    expect(textoVencimento('2026-11-11')).toBe('Vence amanhã')
    expect(textoVencimento('2026-11-15')).toBe('Vence em 5 dias')
    expect(textoVencimento('2026-11-09')).toBe('Venceu ontem')
    expect(textoVencimento('2026-11-06')).toBe('Venceu há 4 dias')
  })
})

describe('formatarReais', () => {
  it('CT-10: mostra reais sem centavos quando o valor é inteiro', () => {
    expect(formatarReais(87).replace(/\s/g, ' ')).toBe('R$ 87')
    expect(formatarReais(32.5).replace(/\s/g, ' ')).toBe('R$ 32,50')
    expect(formatarReais(null).replace(/\s/g, ' ')).toBe('R$ 0')
  })
})
