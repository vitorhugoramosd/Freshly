// "Contexto" do React: um lugar central onde ficam a sessão (quem está
// logado) e a lista de alimentos. Qualquer tela pode ler esses dados
// com o hook useApp(), sem precisar passar de componente em componente.
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as db from './db'
import { verificarAlertas } from './alertas'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [sessao, setSessao] = useState(undefined) // undefined = ainda carregando
  const [alimentos, setAlimentos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  // Descobre se já tem alguém logado e passa a ouvir entradas e saídas
  useEffect(() => {
    db.pegarSessao().then(setSessao)
    return db.aoMudarLogin(setSessao)
  }, [])

  const recarregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const lista = await db.listarAlimentos()
      setAlimentos(lista)
      return lista
    } catch (e) {
      setErro('Não foi possível carregar seus alimentos. Confira sua internet.')
      console.error(e)
      return []
    } finally {
      setCarregando(false)
    }
  }, [])

  const userId = sessao?.user?.id
  useEffect(() => {
    if (!userId) { setAlimentos([]); return }
    recarregar().then((lista) => verificarAlertas(lista))
  }, [userId, recarregar])

  // Mostra uma mensagem rápida no rodapé ("Alimento salvo!")
  const notificar = useCallback((texto) => {
    setAviso(texto)
    setTimeout(() => setAviso(''), 2600)
  }, [])

  // Funções que alteram e já atualizam a lista na tela
  const acoes = {
    adicionar: async (dados) => {
      const novo = await db.adicionarAlimento(dados)
      setAlimentos((l) => [...l, novo].sort((a, b) => a.validade.localeCompare(b.validade)))
      return novo
    },
    atualizar: async (id, dados) => {
      const salvo = await db.atualizarAlimento(id, dados)
      setAlimentos((l) => l.map((a) => (a.id === id ? salvo : a)).sort((a, b) => a.validade.localeCompare(b.validade)))
      return salvo
    },
    marcar: async (id, status) => {
      const salvo = await db.marcarComo(id, status)
      setAlimentos((l) => l.map((a) => (a.id === id ? salvo : a)))
      return salvo
    },
    excluir: async (id) => {
      await db.excluirAlimento(id)
      setAlimentos((l) => l.filter((a) => a.id !== id))
    },
  }

  const nome = sessao?.user?.user_metadata?.nome || sessao?.user?.email?.split('@')[0] || ''

  return (
    <AppContext.Provider value={{ sessao, nome, alimentos, carregando, erro, recarregar, aviso, notificar, ...acoes }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
