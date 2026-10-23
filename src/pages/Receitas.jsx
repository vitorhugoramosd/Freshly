import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Gauge } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { sugerirReceitas } from '../lib/calculos'

const FILTROS = ['Todas', 'Rápidas', 'Saudáveis', 'Fáceis']

export default function Receitas() {
  const { alimentos } = useApp()
  const [filtro, setFiltro] = useState('Todas')
  const sugestoes = useMemo(() => sugerirReceitas(alimentos), [alimentos])

  const lista = sugestoes.filter((r) => {
    if (filtro === 'Todas') return true
    if (filtro === 'Fáceis') return r.dificuldade === 'Fácil'
    return r.tags.includes(filtro)
  })

  return (
    <>
      <h1 className="titulo-tela">Receitas</h1>
      <p className="suave">Com os ingredientes que vencem em breve.</p>

      <div className="chips">
        {FILTROS.map((f) => <button key={f} className={`chip ${filtro === f ? 'ativo' : ''}`} onClick={() => setFiltro(f)}>{f}</button>)}
      </div>

      {!lista.length && (
        <div className="cartao vazio">
          <p>{sugestoes.length ? 'Nenhuma receita nesse filtro.' : 'Cadastre alguns alimentos para receber sugestões de receitas.'}</p>
        </div>
      )}

      <div className="receitas">
        {lista.map((r) => (
          <Link key={r.id} to={`/receitas/${r.id}`} className="cartao receita">
            <span className="receita-emoji" aria-hidden>{r.emoji}</span>
            <span className="receita-texto">
              <strong>{r.nome}</strong>
              <span className="receita-meta"><Clock size={14} /> {r.minutos} min <Gauge size={14} /> {r.dificuldade}</span>
              <span className="receita-usa">Usa: {r.usados.map((a) => a.nome).join(', ')}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
