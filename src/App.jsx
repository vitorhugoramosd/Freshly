// Define qual tela aparece em cada endereço (rota) do app.
import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './lib/AppContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Alimentos from './pages/Alimentos'
import FormAlimento from './pages/FormAlimento'
import Receitas from './pages/Receitas'
import DetalheReceita from './pages/DetalheReceita'
import Economia from './pages/Economia'
import Mais from './pages/Mais'

export default function App() {
  const { sessao } = useApp()

  // Ainda descobrindo se há alguém logado: mostra só a logo
  if (sessao === undefined) return <div className="abertura"><img src="/pwa-192.png" alt="Freshly" /></div>

  if (!sessao) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="alimentos" element={<Alimentos />} />
        <Route path="receitas" element={<Receitas />} />
        <Route path="economia" element={<Economia />} />
        <Route path="mais" element={<Mais />} />
      </Route>
      <Route path="alimentos/novo" element={<FormAlimento />} />
      <Route path="alimentos/:id" element={<FormAlimento />} />
      <Route path="receitas/:id" element={<DetalheReceita />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
