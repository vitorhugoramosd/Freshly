import { useMemo } from 'react'
import { Trash2, Coins, Leaf } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { resumoEconomia } from '../lib/calculos'
import { formatarReais } from '../lib/datas'
import logo from '../logo.png'

export default function Economia() {
  const { alimentos } = useApp()
  const r = useMemo(() => resumoEconomia(alimentos), [alimentos])
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long' })

  // Barras do comparativo: altura proporcional ao maior valor
  const maior = Math.max(r.desperdicadosMesAnterior, r.desperdicados, 1)
  const variacao = r.desperdicadosMesAnterior
    ? Math.round(((r.desperdicados - r.desperdicadosMesAnterior) / r.desperdicadosMesAnterior) * 100)
    : null

  return (
    <>
      <h1 className="titulo-tela">Economia</h1>

      <div className="faixa-verde">
        <img src={logo} alt="" />
        <span>{r.economizado > 0 ? 'Você está fazendo seu dinheiro render mais!' : 'Marque o que você consumiu para ver sua economia aqui.'}</span>
      </div>

      <h2 className="subtitulo">Seu mês de {mes} com o Freshly</h2>
      <div className="numeros">
        <div className="cartao numero">
          <Trash2 size={22} />
          <strong>{r.salvos}</strong>
          <small>alimentos salvos do desperdício</small>
        </div>
        <div className="cartao numero">
          <Coins size={22} />
          <strong>{formatarReais(r.economizado)}</strong>
          <small>economizados</small>
        </div>
        <div className="cartao numero">
          <Leaf size={22} />
          <strong>{r.consumidosNoPrazo}</strong>
          <small>consumidos no prazo ({r.percentualNoPrazo}%)</small>
        </div>
      </div>

      <section className="cartao bloco">
        <h3>Comparativo de desperdício</h3>
        <div className="comparativo">
          <div className="barras">
            <div className="barra-col">
              <span className="barra-valor">{r.desperdicadosMesAnterior}</span>
              <div className="barra antes" style={{ height: `${(r.desperdicadosMesAnterior / maior) * 100}%` }} />
              <small>Mês passado</small>
            </div>
            <div className="barra-col">
              <span className="barra-valor">{r.desperdicados}</span>
              <div className="barra agora" style={{ height: `${(r.desperdicados / maior) * 100}%` }} />
              <small>Este mês</small>
            </div>
          </div>
          <div className="variacao">
            {variacao === null ? <><strong>—</strong><small>sem dados do mês passado</small></>
              : <><strong className={variacao <= 0 ? 'bom' : 'ruim'}>{variacao > 0 ? '+' : ''}{variacao}%</strong><small>de desperdício</small></>}
          </div>
        </div>
        <p className="suave pequeno">
          Este mês: {r.desperdicados} {r.desperdicados === 1 ? 'alimento descartado' : 'alimentos descartados'} ({formatarReais(r.perdido)} perdidos).
        </p>
      </section>

      <p className="suave pequeno centro">A economia soma o preço dos alimentos que você marcou como "Consumi" neste mês.</p>
    </>
  )
}
