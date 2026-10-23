// Moldura das telas principais: conteúdo + barra de abas embaixo + botão "+"
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, Package, ChefHat, PiggyBank, Menu, Plus } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { MODO_DEMO } from '../lib/db'

const ABAS = [
  { para: '/', rotulo: 'Início', Icone: Home },
  { para: '/alimentos', rotulo: 'Alimentos', Icone: Package },
  { para: '/receitas', rotulo: 'Receitas', Icone: ChefHat },
  { para: '/economia', rotulo: 'Economia', Icone: PiggyBank },
  { para: '/mais', rotulo: 'Mais', Icone: Menu },
]

export default function Layout() {
  const navigate = useNavigate()
  const { aviso } = useApp()
  return (
    <div className="app">
      {MODO_DEMO && <div className="faixa-demo">Modo demonstração: os dados ficam só neste aparelho</div>}
      <main className="conteudo">
        <Outlet />
      </main>

      <button className="fab" aria-label="Adicionar alimento" onClick={() => navigate('/alimentos/novo')}>
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <nav className="abas" aria-label="Navegação principal">
        {ABAS.map(({ para, rotulo, Icone }) => (
          <NavLink key={para} to={para} end={para === '/'} className="aba">
            <Icone size={22} />
            <span>{rotulo}</span>
          </NavLink>
        ))}
      </nav>

      {aviso && <div className="toast" role="status">{aviso}</div>}
    </div>
  )
}
