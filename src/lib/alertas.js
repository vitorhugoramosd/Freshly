// Alertas de validade usando as notificações do próprio celular.
//
// Como funciona: quando o app é aberto, ele confere se há alimentos
// vencendo e, no máximo uma vez por dia, mostra uma notificação.
// (Notificação com o app totalmente fechado exige um servidor de "push";
// fica como próximo passo, ver README.)
import { urgentes } from './calculos'
import { hojeISO } from './datas'

const CHAVE = 'freshly-ultimo-alerta'

export function notificacoesSuportadas() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function permissaoAtual() {
  return notificacoesSuportadas() ? Notification.permission : 'unsupported'
}

export async function pedirPermissao() {
  if (!notificacoesSuportadas()) return 'unsupported'
  return Notification.requestPermission()
}

async function mostrar(titulo, corpo) {
  const opcoes = { body: corpo, icon: '/pwa-192.png', badge: '/favicon.png', tag: 'freshly-validade' }
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) return reg.showNotification(titulo, opcoes)
  } catch { /* segue para o modo simples */ }
  new Notification(titulo, opcoes)
}

function montarTexto(itens) {
  const nomes = itens.slice(0, 3).map((a) => a.nome).join(', ')
  const resto = itens.length > 3 ? ` e mais ${itens.length - 3}` : ''
  return {
    titulo: itens.length === 1 ? 'Um alimento vence logo' : `${itens.length} alimentos vencem logo`,
    corpo: `${nomes}${resto}. Que tal consumir primeiro?`,
  }
}

// Chamado quando a lista carrega. "forcar" ignora o limite de 1 por dia (botão de teste).
export async function verificarAlertas(lista, forcar = false) {
  if (permissaoAtual() !== 'granted') return false
  const itens = urgentes(lista)
  if (!itens.length) return false
  try {
    if (!forcar && localStorage.getItem(CHAVE) === hojeISO()) return false
    localStorage.setItem(CHAVE, hojeISO())
  } catch { /* sem localStorage: mostra mesmo assim */ }
  const { titulo, corpo } = montarTexto(itens)
  await mostrar(titulo, corpo)
  return true
}
