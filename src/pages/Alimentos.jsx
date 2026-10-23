import { useMemo, useState } from 'react'
import { useApp } from '../lib/AppContext'
import { agruparPorPrioridade } from '../lib/calculos'
import { LOCAIS } from '../data/categorias'
import ItemAlimento from '../components/ItemAlimento'

const SECOES = [
  ['vencido', 'Vencidos', 'Confira se ainda dá para usar ou registre o descarte.'],
  ['agora', 'Consumir agora', 'Vencem em até 2 dias.'],
  ['breve', 'Em breve', 'Vencem nesta semana.'],
  ['depois', 'Depois', 'Ainda têm bastante tempo.'],
]

export default function Alimentos() {
  const { alimentos } = useApp()
  const [local, setLocal] = useState('Todos')

  const filtrados = useMemo(
    () => (local === 'Todos' ? alimentos : alimentos.filter((a) => a.local === local)),
    [alimentos, local],
  )
  const grupos = agruparPorPrioridade(filtrados)
  const total = Object.values(grupos).reduce((s, g) => s + g.length, 0)

  return (
    <>
      <h1 className="titulo-tela">Alimentos</h1>
      <p className="suave">{total} {total === 1 ? 'item' : 'itens'} em casa, do que vence primeiro ao que vence depois.</p>

      <div className="chips" role="tablist" aria-label="Filtrar por local">
        {['Todos', ...LOCAIS].map((l) => (
          <button key={l} role="tab" aria-selected={local === l} className={`chip ${local === l ? 'ativo' : ''}`} onClick={() => setLocal(l)}>{l}</button>
        ))}
      </div>

      {total === 0 && <div className="cartao vazio"><p>Nenhum alimento aqui. Toque no + para cadastrar.</p></div>}

      {SECOES.map(([chave, titulo, dica]) => grupos[chave].length > 0 && (
        <section key={chave} className="secao">
          <h2 className={`secao-titulo ${chave}`}>{titulo} <span className="contador">{grupos[chave].length}</span></h2>
          <p className="suave pequeno">{dica}</p>
          <div className="cartao lista">
            {grupos[chave].map((a) => <ItemAlimento key={a.id} alimento={a} mostrarLocal={local === 'Todos'} />)}
          </div>
        </section>
      ))}
    </>
  )
}
