import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Search, PiggyBank } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { agruparPorPrioridade, resumoEconomia, ativos } from '../lib/calculos'
import { formatarReais } from '../lib/datas'
import { normalizar } from '../data/categorias'
import ItemAlimento from '../components/ItemAlimento'
import Cabecalho from '../components/Cabecalho'

export default function Inicio() {
  const { nome, alimentos, carregando, erro } = useApp()
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  const grupos = useMemo(() => agruparPorPrioridade(alimentos), [alimentos])
  const economia = useMemo(() => resumoEconomia(alimentos), [alimentos])
  const primeiro = [...grupos.vencido, ...grupos.agora, ...grupos.breve]

  const resultados = busca
    ? ativos(alimentos).filter((a) => normalizar(a.nome).includes(normalizar(busca)))
    : null

  return (
    <>
      <Cabecalho />
      <h1 className="saudacao">Olá, {primeiroNome(nome)}!</h1>
      <p className="suave">Aqui está o que você precisa hoje.</p>

      <label className="busca">
        <Search size={18} />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar alimento…" aria-label="Buscar alimento" />
      </label>

      {erro && <p className="msg erro">{erro}</p>}

      {resultados ? (
        <section className="cartao lista">
          {resultados.length ? resultados.map((a) => <ItemAlimento key={a.id} alimento={a} mostrarLocal />)
            : <p className="vazio">Nenhum alimento com esse nome.</p>}
        </section>
      ) : (
        <>
          <section className="cartao lista">
            <Link to="/alimentos" className="destaque-alerta">
              <span className="sino"><Bell size={20} /></span>
              <span>
                <strong>O que consumir primeiro?</strong>
                <small>{primeiro.length ? `${primeiro.length} ${primeiro.length === 1 ? 'alimento próximo' : 'alimentos próximos'} do vencimento` : 'Nada vencendo nos próximos dias 🎉'}</small>
              </span>
              <ChevronRight size={20} />
            </Link>
            {carregando && !alimentos.length && <p className="vazio">Carregando…</p>}
            {primeiro.slice(0, 5).map((a) => <ItemAlimento key={a.id} alimento={a} />)}
            {!carregando && !ativos(alimentos).length && (
              <div className="vazio">
                <p>Sua geladeira ainda está vazia por aqui.</p>
                <button className="botao pequeno" onClick={() => navigate('/alimentos/novo')}>Cadastrar primeiro alimento</button>
              </div>
            )}
          </section>

          <Link to="/economia" className="cartao economia-resumo">
            <span className="circulo"><PiggyBank size={26} /></span>
            <span>
              <small>Economia do mês</small>
              <strong>{formatarReais(economia.economizado)}</strong>
              <small>economizados</small>
            </span>
            <ChevronRight size={20} />
          </Link>
        </>
      )}
    </>
  )
}

function primeiroNome(nome) {
  const n = (nome || '').split(' ')[0]
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : 'tudo bem'
}
