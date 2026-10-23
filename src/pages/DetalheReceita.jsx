import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Gauge } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { RECEITAS } from '../data/receitas'
import { sugerirReceitas } from '../lib/calculos'
import { textoVencimento } from '../lib/datas'
import { corVencimento } from '../components/ItemAlimento'

export default function DetalheReceita() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { alimentos } = useApp()
  const receita = useMemo(
    () => sugerirReceitas(alimentos).find((r) => r.id === id) || { ...RECEITAS.find((r) => r.id === id), usados: [] },
    [alimentos, id],
  )

  if (!receita?.nome) return null

  return (
    <div className="app tela-cheia">
      <header className="barra-voltar">
        <button className="icone-btn" onClick={() => navigate(-1)} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <h1>Receita</h1>
        <span />
      </header>
      <div className="conteudo">
        <div className="receita-capa" aria-hidden>{receita.emoji}</div>
        <h2 className="titulo-tela">{receita.nome}</h2>
        <p className="receita-meta grande"><Clock size={16} /> {receita.minutos} min <Gauge size={16} /> {receita.dificuldade}</p>

        {receita.usados.length > 0 && (
          <section className="cartao bloco">
            <h3>Você já tem em casa</h3>
            <ul className="lista-simples">
              {receita.usados.map((a) => (
                <li key={a.id}>{a.nome} <span className={`item-vence ${corVencimento(a.validade)}`}>{textoVencimento(a.validade)}</span></li>
              ))}
            </ul>
          </section>
        )}

        <section className="cartao bloco">
          <h3>Você também vai precisar de</h3>
          <p className="suave">{receita.extras.join(', ')}</p>
        </section>

        <section className="cartao bloco">
          <h3>Modo de preparo</h3>
          <ol className="passos">{receita.passos.map((p, i) => <li key={i}>{p}</li>)}</ol>
        </section>

        <p className="suave pequeno centro">Depois de cozinhar, marque os ingredientes como "Consumi" na lista de alimentos.</p>
      </div>
    </div>
  )
}
