// Uma linha da lista de alimentos (emoji, nome, vencimento) com o menu de ações
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check, Trash2, Pencil, X } from 'lucide-react'
import { emojiDo } from '../data/categorias'
import { diasAte, textoVencimento } from '../lib/datas'
import { useApp } from '../lib/AppContext'

export function corVencimento(validade) {
  const d = diasAte(validade)
  if (d < 0) return 'vencido'
  if (d <= 7) return 'alerta'
  return 'ok'
}

export default function ItemAlimento({ alimento, mostrarLocal = false }) {
  const [aberto, setAberto] = useState(false)
  return (
    <>
      <button className="item" onClick={() => setAberto(true)}>
        <span className="item-emoji" aria-hidden>{emojiDo(alimento)}</span>
        <span className="item-texto">
          <span className="item-nome">{alimento.nome}</span>
          <span className={`item-vence ${corVencimento(alimento.validade)}`}>
            {textoVencimento(alimento.validade)}
            {mostrarLocal && <span className="item-local"> · {alimento.local}</span>}
          </span>
        </span>
        <ChevronRight size={20} className="item-seta" />
      </button>
      {aberto && <MenuAcoes alimento={alimento} fechar={() => setAberto(false)} />}
    </>
  )
}

// "Bottom sheet": painel que sobe de baixo com as ações do alimento
function MenuAcoes({ alimento, fechar }) {
  const { marcar, notificar } = useApp()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  async function finalizar(status) {
    setSalvando(true)
    try {
      await marcar(alimento.id, status)
      notificar(status === 'consumido' ? 'Boa! Menos um desperdício 🌱' : 'Registrado como descartado')
      fechar()
    } catch {
      notificar('Não deu para salvar. Tente de novo.')
      setSalvando(false)
    }
  }

  return (
    <div className="sheet-fundo" onClick={fechar}>
      <div className="sheet" role="dialog" aria-label={alimento.nome} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-topo">
          <span className="item-emoji grande" aria-hidden>{emojiDo(alimento)}</span>
          <div>
            <h3>{alimento.nome}</h3>
            <p className="suave">
              {Number(alimento.quantidade).toLocaleString('pt-BR')} {alimento.unidade} · {alimento.local} · {textoVencimento(alimento.validade)}
            </p>
          </div>
          <button className="icone-btn" aria-label="Fechar" onClick={fechar}><X size={20} /></button>
        </div>
        <button className="botao" disabled={salvando} onClick={() => finalizar('consumido')}>
          <Check size={20} /> Consumi
        </button>
        <button className="botao secundario" disabled={salvando} onClick={() => finalizar('descartado')}>
          <Trash2 size={20} /> Joguei fora
        </button>
        <button className="botao fantasma" onClick={() => navigate(`/alimentos/${alimento.id}`)}>
          <Pencil size={18} /> Editar
        </button>
      </div>
    </div>
  )
}
