// Funções de data. Trabalhamos com texto no formato "AAAA-MM-DD"
// (o mesmo que o campo <input type="date"> e o banco usam).

function paraData(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d) // meia-noite no fuso do celular
}
function paraISO(data) {
  const a = data.getFullYear()
  const m = String(data.getMonth() + 1).padStart(2, '0')
  const d = String(data.getDate()).padStart(2, '0')
  return `${a}-${m}-${d}`
}

export function hojeISO() {
  return paraISO(new Date())
}

export function somarDias(iso, dias) {
  const d = paraData(iso)
  d.setDate(d.getDate() + dias)
  return paraISO(d)
}

// Quantos dias faltam até a validade (negativo = já venceu)
export function diasAte(iso) {
  const ms = paraData(iso) - paraData(hojeISO())
  return Math.round(ms / 86400000)
}

export function formatarData(iso) {
  return paraData(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Texto curto do vencimento, igual ao mockup ("Vence amanhã")
export function textoVencimento(iso) {
  const d = diasAte(iso)
  if (d < -1) return `Venceu há ${-d} dias`
  if (d === -1) return 'Venceu ontem'
  if (d === 0) return 'Vence hoje'
  if (d === 1) return 'Vence amanhã'
  if (d <= 30) return `Vence em ${d} dias`
  return `Vence em ${formatarData(iso)}`
}

// Faixa de prioridade: "agora" (até 2 dias), "breve" (até 7), "depois", ou "vencido"
export function prioridade(iso) {
  const d = diasAte(iso)
  if (d < 0) return 'vencido'
  if (d <= 2) return 'agora'
  if (d <= 7) return 'breve'
  return 'depois'
}

export function mesmoMes(isoDataHora, referencia = new Date()) {
  const d = new Date(isoDataHora)
  return d.getMonth() === referencia.getMonth() && d.getFullYear() === referencia.getFullYear()
}

export function formatarReais(valor) {
  const v = Math.round((valor || 0) * 100) / 100
  const casas = Number.isInteger(v) ? 0 : 2 // "R$ 87" ou "R$ 32,50"
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: casas, maximumFractionDigits: casas })
}
