// Tela de cadastrar (rota /alimentos/novo) e de editar (rota /alimentos/:id)
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import { CATEGORIAS, LOCAIS, UNIDADES, emojiDo } from '../data/categorias'
import { hojeISO, somarDias } from '../lib/datas'

const VAZIO = { nome: '', quantidade: 1, unidade: 'un', categoria: 'Legumes e verduras', local: 'Geladeira', validade: '', preco: '' }

// Atalhos de validade para cadastrar mais rápido
const ATALHOS = [['Amanhã', 1], ['3 dias', 3], ['1 semana', 7], ['1 mês', 30]]

export default function FormAlimento() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const { alimentos, adicionar, atualizar, excluir, notificar } = useApp()
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Ao editar, preenche o formulário com os dados do alimento
  useEffect(() => {
    if (!editando) return
    const a = alimentos.find((x) => x.id === id)
    if (a) setForm({ ...VAZIO, ...a, preco: a.preco ?? '' })
  }, [editando, id, alimentos])

  const mudar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const passo = form.unidade === 'g' || form.unidade === 'ml' ? 50 : 1
  const alterarQtd = (delta) => setForm((f) => ({ ...f, quantidade: Math.max(passo, Number(f.quantidade || 0) + delta) }))

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    if (!form.nome.trim()) return setErro('Dê um nome ao alimento.')
    if (!form.validade) return setErro('Informe a data de validade.')
    if (!(Number(form.quantidade) > 0)) return setErro('A quantidade precisa ser maior que zero.')

    const dados = {
      ...form,
      nome: form.nome.trim(),
      quantidade: Number(form.quantidade),
      preco: form.preco === '' ? null : Number(String(form.preco).replace(',', '.')),
    }
    setSalvando(true)
    try {
      if (editando) await atualizar(id, dados)
      else await adicionar(dados)
      notificar(editando ? 'Alimento atualizado' : 'Alimento salvo!')
      navigate(-1)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível salvar. Confira sua internet e tente de novo.')
      setSalvando(false)
    }
  }

  async function apagar() {
    if (!window.confirm('Excluir este alimento? Ele some também das estatísticas.')) return
    try {
      await excluir(id)
      notificar('Alimento excluído')
      navigate('/alimentos', { replace: true })
    } catch {
      setErro('Não foi possível excluir.')
    }
  }

  return (
    <div className="app tela-cheia">
      <header className="barra-voltar">
        <button className="icone-btn" onClick={() => navigate(-1)} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <h1>{editando ? 'Editar alimento' : 'Adicionar alimento'}</h1>
        {editando ? <button className="icone-btn perigo" onClick={apagar} aria-label="Excluir"><Trash2 size={20} /></button> : <span />}
      </header>

      <form className="conteudo form" onSubmit={salvar}>
        <div className="emoji-preview" aria-hidden>{emojiDo(form)}</div>

        <label className="campo">
          <span>Nome do alimento</span>
          <input value={form.nome} onChange={mudar('nome')} placeholder="Ex.: Tomate" autoFocus={!editando} maxLength={80} />
        </label>

        <div className="campo">
          <span>Quantidade</span>
          <div className="linha">
            <input type="number" inputMode="decimal" min="0" step="any" value={form.quantidade} onChange={mudar('quantidade')} aria-label="Quantidade" />
            <select value={form.unidade} onChange={mudar('unidade')} aria-label="Unidade" className="curto">
              {UNIDADES.map((u) => <option key={u}>{u}</option>)}
            </select>
            <div className="contador-btns">
              <button type="button" onClick={() => alterarQtd(-passo)} aria-label="Diminuir"><Minus size={18} /></button>
              <button type="button" onClick={() => alterarQtd(passo)} aria-label="Aumentar"><Plus size={18} /></button>
            </div>
          </div>
        </div>

        <label className="campo">
          <span>Categoria</span>
          <select value={form.categoria} onChange={mudar('categoria')}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <div className="campo">
          <span>Onde está guardado</span>
          <div className="segmentado">
            {LOCAIS.map((l) => (
              <button type="button" key={l} className={form.local === l ? 'ativo' : ''} onClick={() => setForm((f) => ({ ...f, local: l }))}>{l}</button>
            ))}
          </div>
        </div>

        <label className="campo">
          <span>Data de validade</span>
          <input type="date" value={form.validade} onChange={mudar('validade')} />
        </label>
        <div className="chips">
          {ATALHOS.map(([rotulo, dias]) => (
            <button type="button" key={rotulo} className="chip" onClick={() => setForm((f) => ({ ...f, validade: somarDias(hojeISO(), dias) }))}>{rotulo}</button>
          ))}
        </div>

        <label className="campo">
          <span>Quanto pagou? <em>(opcional, usado no cálculo da economia)</em></span>
          <input inputMode="decimal" value={form.preco} onChange={mudar('preco')} placeholder="R$ 0,00" />
        </label>

        {erro && <p className="msg erro">{erro}</p>}
        <button className="botao" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
      </form>
    </div>
  )
}
