// Regras de negócio do Freshly: o que priorizar, quais receitas sugerir
// e quanto o usuário economizou. Ficam separadas das telas para ficar
// fácil de entender e de testar.
import { RECEITAS } from '../data/receitas'
import { normalizar } from '../data/categorias'
import { diasAte, prioridade, mesmoMes } from './datas'

export const ativos = (lista) => lista.filter((a) => a.status === 'ativo')

// Alimentos que pedem atenção: vencidos ou vencendo em até 2 dias
export function urgentes(lista) {
  return ativos(lista).filter((a) => diasAte(a.validade) <= 2)
}

// Agrupa os ativos nas faixas "vencido", "agora", "breve" e "depois"
export function agruparPorPrioridade(lista) {
  const grupos = { vencido: [], agora: [], breve: [], depois: [] }
  for (const a of ativos(lista)) grupos[prioridade(a.validade)].push(a)
  return grupos
}

// ---------------------------------------------------------------------
// Receitas: cruza o nome dos alimentos com as "chaves" de cada receita.
// Quanto mais perto de vencer o ingrediente, mais pontos a receita ganha.
// ---------------------------------------------------------------------
const PESO = { agora: 3, breve: 2, depois: 1 }

export function sugerirReceitas(lista) {
  const emCasa = ativos(lista).filter((a) => diasAte(a.validade) >= 0)
  return RECEITAS.map((receita) => {
    const usados = emCasa.filter((a) => {
      const palavras = normalizar(a.nome).split(/\s+/)
      return receita.chaves.some((chave) => palavras.some((p) => p.startsWith(chave)))
    })
    const pontos = usados.reduce((soma, a) => soma + PESO[prioridade(a.validade)], 0)
    const vencendo = usados.filter((a) => diasAte(a.validade) <= 7)
    return { ...receita, usados, vencendo, pontos }
  })
    .filter((r) => r.usados.length > 0)
    .sort((a, b) => b.pontos - a.pontos || b.usados.length - a.usados.length)
}

// ---------------------------------------------------------------------
// Economia do mês
// ---------------------------------------------------------------------
export function resumoEconomia(lista, referencia = new Date()) {
  const anterior = new Date(referencia.getFullYear(), referencia.getMonth() - 1, 15)
  const doMes = (status, ref) => lista.filter((a) => a.status === status && a.finalizado_em && mesmoMes(a.finalizado_em, ref))
  const somaPreco = (itens) => itens.reduce((s, a) => s + (Number(a.preco) || 0), 0)

  const consumidos = doMes('consumido', referencia)
  const descartados = doMes('descartado', referencia)
  const descartadosAntes = doMes('descartado', anterior)

  // "Salvo do desperdício" = consumido quando faltavam 3 dias ou menos para vencer
  const salvos = consumidos.filter((a) => {
    const fim = new Date(a.finalizado_em)
    const fimISO = `${fim.getFullYear()}-${String(fim.getMonth() + 1).padStart(2, '0')}-${String(fim.getDate()).padStart(2, '0')}`
    return diasEntre(fimISO, a.validade) <= 3
  })

  const total = consumidos.length + descartados.length
  return {
    economizado: somaPreco(consumidos),
    salvos: salvos.length,
    consumidosNoPrazo: consumidos.length,
    percentualNoPrazo: total ? Math.round((consumidos.length / total) * 100) : 0,
    desperdicados: descartados.length,
    perdido: somaPreco(descartados),
    desperdicadosMesAnterior: descartadosAntes.length,
    perdidoMesAnterior: somaPreco(descartadosAntes),
  }
}

function diasEntre(deISO, ateISO) {
  const [a1, m1, d1] = deISO.split('-').map(Number)
  const [a2, m2, d2] = ateISO.split('-').map(Number)
  return Math.round((new Date(a2, m2 - 1, d2) - new Date(a1, m1 - 1, d1)) / 86400000)
}
