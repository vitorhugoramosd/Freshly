import { Link } from 'react-router-dom'
import { useApp } from '../lib/AppContext'
import logo from '../logo.png'

// Topo da tela inicial: logo à esquerda, inicial do usuário à direita
export default function Cabecalho() {
  const { nome } = useApp()
  return (
    <header className="cabecalho">
      <span className="marca"><img src={logo} alt="" /> Freshly</span>
      <Link to="/mais" className="avatar" aria-label="Minha conta">{(nome || '?').charAt(0).toUpperCase()}</Link>
    </header>
  )
}
