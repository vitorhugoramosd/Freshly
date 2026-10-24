// =====================================================================
// Camada de dados do Freshly.
//
// Todas as telas falam com o banco SÓ por este arquivo. Assim, se um
// dia trocarmos o Supabase por outra coisa, só este arquivo muda.
//
// Ele funciona de dois jeitos:
//  1. Modo Supabase: quando o .env tem VITE_SUPABASE_URL e VITE_SUPABASE_KEY.
//  2. Modo demonstração: quando não tem. Os dados ficam no localStorage
//     (uma "gavetinha" de armazenamento do próprio navegador).
// =====================================================================
import { createClient } from '@supabase/supabase-js'
import { hojeISO, somarDias } from './datas'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_KEY

export const MODO_DEMO = !URL || !KEY
const supabase = MODO_DEMO ? null : createClient(URL, KEY)

// Campos que o usuário pode preencher num alimento
const CAMPOS = ['nome', 'quantidade', 'unidade', 'categoria', 'local', 'validade', 'preco', 'status', 'finalizado_em']
function limpar(dados) {
  const out = {}
  for (const c of CAMPOS) if (dados[c] !== undefined) out[c] = dados[c]
  if (out.preco === '' ) out.preco = null
  return out
}

// ---------------------------------------------------------------------
// Modo demonstração (localStorage)
// ---------------------------------------------------------------------
const CHAVE_DADOS = 'freshly-demo-alimentos'
const CHAVE_USER = 'freshly-demo-user'
const ouvintes = new Set()

function lerDemo() {
  try {
    const salvo = localStorage.getItem(CHAVE_DADOS)
    if (salvo) return JSON.parse(salvo)
  } catch { /* navegador sem localStorage: segue com os dados de exemplo */ }
  const lista = exemplosDemo()
  gravarDemo(lista)
  return lista
}
function gravarDemo(lista) {
  try { localStorage.setItem(CHAVE_DADOS, JSON.stringify(lista)) } catch { /* ignora */ }
}
function usuarioDemo() {
  try { return JSON.parse(localStorage.getItem(CHAVE_USER) || 'null') } catch { return null }
}
function avisar(sessao) { ouvintes.forEach((f) => f(sessao)) }
function sessaoDemo(user) { return user ? { user } : null }

function exemplosDemo() {
  const h = hojeISO()
  // diasAtras = há quantos dias foi consumido/descartado (35 = mês passado, para o comparativo)
  const item = (nome, categoria, local, dias, preco, qtd = 1, unidade = 'un', status = 'ativo', diasAtras = 0) => {
    const fim = new Date()
    fim.setDate(Math.max(1, fim.getDate() - diasAtras))
    if (diasAtras >= 30) fim.setMonth(fim.getMonth() - 1, 15)
    return {
      id: crypto.randomUUID(), nome, categoria, local, quantidade: qtd, unidade, preco,
      validade: somarDias(h, dias), status,
      finalizado_em: status === 'ativo' ? null : fim.toISOString(),
      criado_em: new Date().toISOString(),
    }
  }
  return [
    item('Alface', 'Legumes e verduras', 'Geladeira', 1, 4.5),
    item('Leite', 'Laticínios', 'Geladeira', 3, 5.9, 1, 'L'),
    item('Tomate', 'Legumes e verduras', 'Geladeira', 5, 8.0, 5),
    item('Ovos', 'Outros', 'Geladeira', 12, 14.9, 12),
    item('Peito de frango', 'Carnes', 'Freezer', 40, 22.0, 1, 'kg'),
    item('Arroz', 'Grãos e massas', 'Despensa', 180, 25.0, 5, 'kg'),
    item('Iogurte natural', 'Laticínios', 'Geladeira', -1, 3.5),
    item('Banana', 'Frutas', 'Despensa', -6, 6.0, 6, 'un', 'consumido'),
    item('Queijo mussarela', 'Laticínios', 'Geladeira', -4, 18.0, 300, 'g', 'consumido'),
    item('Cenoura', 'Legumes e verduras', 'Geladeira', -8, 5.0, 4, 'un', 'consumido'),
    item('Pão de forma', 'Grãos e massas', 'Despensa', -10, 9.0, 1, 'un', 'descartado', 2),
    // Descartados no mês passado (antes de usar o Freshly)
    item('Morango', 'Frutas', 'Geladeira', -40, 12.0, 1, 'un', 'descartado', 35),
    item('Couve', 'Legumes e verduras', 'Geladeira', -40, 4.0, 1, 'un', 'descartado', 35),
    item('Sobra de feijão', 'Sobras', 'Geladeira', -40, 6.0, 1, 'un', 'descartado', 35),
  ]
}

// ---------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------
export async function pegarSessao() {
  if (MODO_DEMO) return sessaoDemo(usuarioDemo())
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Chama "callback" sempre que alguém entra ou sai. Devolve a função para parar de ouvir.
export function aoMudarLogin(callback) {
  if (MODO_DEMO) {
    ouvintes.add(callback)
    return () => ouvintes.delete(callback)
  }
  const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => callback(sessao))
  return () => data.subscription.unsubscribe()
}

export async function entrar(email, senha) {
  if (MODO_DEMO) {
    const user = { id: 'demo', email, user_metadata: { nome: usuarioDemo()?.user_metadata?.nome || email.split('@')[0] } }
    localStorage.setItem(CHAVE_USER, JSON.stringify(user))
    avisar(sessaoDemo(user))
    return
  }
  const { error } = await supabase.auth.signInWithPassword({ email: limparEmail(email), password: senha })
  if (error) throw traduzirErro(error)
}

// Tira espaços e deixa minúsculo (o celular às vezes põe a 1ª letra maiúscula)
function limparEmail(email) {
  return (email || '').trim().toLowerCase()
}

export async function criarConta(nome, email, senha) {
  if (MODO_DEMO) {
    const user = { id: 'demo', email, user_metadata: { nome } }
    localStorage.setItem(CHAVE_USER, JSON.stringify(user))
    avisar(sessaoDemo(user))
    return { precisaConfirmar: false }
  }
  email = limparEmail(email)
  const { data, error } = await supabase.auth.signUp({
    email, password: senha, options: { data: { nome } },
  })
  if (error) throw traduzirErro(error)

  // Se o e-mail já tem conta, o Supabase não dá erro: devolve um usuário
  // "vazio" (sem identities). Tratamos isso como "e-mail já cadastrado".
  if (data.user && data.user.identities?.length === 0) {
    throw new Error('Este e-mail já tem conta. Toque em "Entrar" e use sua senha.')
  }
  if (data.session) return { precisaConfirmar: false } // já entrou direto

  // Sem sessão: tenta entrar na hora. Funciona quando a confirmação de
  // e-mail está desligada; se estiver ligada, avisamos para confirmar.
  const login = await supabase.auth.signInWithPassword({ email, password: senha })
  if (!login.error) return { precisaConfirmar: false }
  if (login.error.code === 'email_not_confirmed') return { precisaConfirmar: true }
  throw traduzirErro(login.error)
}

export async function sair() {
  if (MODO_DEMO) {
    localStorage.removeItem(CHAVE_USER)
    avisar(null)
    return
  }
  await supabase.auth.signOut()
}

// Transforma o erro do Supabase numa frase clara. Usa o "code" do erro
// (um identificador fixo) e, se não tiver, procura palavras na mensagem.
function traduzirErro(error) {
  const codigo = error.code || ''
  const m = (error.message || '').toLowerCase()
  if (codigo === 'invalid_credentials' || m.includes('invalid login'))
    return new Error('E-mail ou senha incorretos. Se ainda não tem conta, toque em "Criar conta".')
  if (codigo === 'email_not_confirmed' || m.includes('email not confirmed'))
    return new Error('Falta confirmar seu e-mail: abra o link que enviamos para sua caixa de entrada (veja também o spam).')
  if (codigo === 'user_already_exists' || m.includes('already registered'))
    return new Error('Este e-mail já tem conta. Toque em "Entrar" e use sua senha.')
  if (codigo === 'over_email_send_rate_limit' || codigo === 'over_request_rate_limit' || m.includes('rate limit') || m.includes('security purposes'))
    return new Error('Muitas tentativas seguidas. Espere 1 minuto e tente de novo.')
  if (codigo === 'weak_password' || m.includes('password should'))
    return new Error('A senha precisa ter pelo menos 6 caracteres.')
  if (codigo === 'validation_failed' || m.includes('invalid format') || m.includes('email address'))
    return new Error('Esse e-mail não parece válido. Confira se digitou certo.')
  if (m.includes('failed to fetch') || m.includes('network'))
    return new Error('Sem conexão com a internet. Tente de novo.')
  return new Error('Algo deu errado: ' + (error.message || 'tente novamente.'))
}

// ---------------------------------------------------------------------
// Alimentos
// ---------------------------------------------------------------------
export async function listarAlimentos() {
  if (MODO_DEMO) return lerDemo().sort((a, b) => a.validade.localeCompare(b.validade))
  const { data, error } = await supabase.from('alimentos').select('*').order('validade', { ascending: true })
  if (error) throw error
  return data
}

export async function adicionarAlimento(dados) {
  const novo = limpar({ ...dados, status: 'ativo' })
  if (MODO_DEMO) {
    const lista = lerDemo()
    const item = { ...novo, id: crypto.randomUUID(), criado_em: new Date().toISOString(), finalizado_em: null }
    gravarDemo([...lista, item])
    return item
  }
  const { data, error } = await supabase.from('alimentos').insert(novo).select().single()
  if (error) throw error
  return data
}

export async function atualizarAlimento(id, dados) {
  const mudancas = limpar(dados)
  if (MODO_DEMO) {
    const lista = lerDemo().map((a) => (a.id === id ? { ...a, ...mudancas } : a))
    gravarDemo(lista)
    return lista.find((a) => a.id === id)
  }
  const { data, error } = await supabase.from('alimentos').update(mudancas).eq('id', id).select().single()
  if (error) throw error
  return data
}

// status: 'consumido' ou 'descartado' (ou 'ativo' para desfazer)
export function marcarComo(id, status) {
  return atualizarAlimento(id, { status, finalizado_em: status === 'ativo' ? null : new Date().toISOString() })
}

export async function excluirAlimento(id) {
  if (MODO_DEMO) {
    gravarDemo(lerDemo().filter((a) => a.id !== id))
    return
  }
  const { error } = await supabase.from('alimentos').delete().eq('id', id)
  if (error) throw error
}

// Coloca a lista de exemplo na conta (útil para a apresentação).
// No modo demonstração substitui tudo; no Supabase só acrescenta.
export async function carregarExemplos() {
  if (MODO_DEMO) {
    gravarDemo(exemplosDemo())
    return
  }
  const linhas = exemplosDemo().map(({ id: _id, criado_em: _c, ...resto }) => resto)
  const { error } = await supabase.from('alimentos').insert(linhas)
  if (error) throw error
}
