import { useState } from 'react'
import * as db from '../lib/db'
import logo from '../logo.png'

export default function Login() {
  const [modo, setModo] = useState('entrar') // 'entrar' ou 'criar'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [info, setInfo] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault() // impede o navegador de recarregar a página
    setErro(''); setInfo(''); setEnviando(true)
    try {
      if (modo === 'entrar') {
        await db.entrar(email.trim(), senha)
      } else {
        if (!nome.trim()) throw new Error('Conte como podemos te chamar.')
        const { precisaConfirmar } = await db.criarConta(nome.trim(), email.trim(), senha)
        if (precisaConfirmar) setInfo('Conta criada! Abra o e-mail que enviamos para confirmar e depois entre.')
      }
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <div className="login-marca">
        <img src={logo} alt="" />
        <h1>Freshly</h1>
        <p>Mais organização. Menos desperdício.</p>
      </div>

      <form className="cartao login-form" onSubmit={enviar}>
        <div className="segmentado" role="tablist">
          <button type="button" role="tab" aria-selected={modo === 'entrar'} className={modo === 'entrar' ? 'ativo' : ''} onClick={() => setModo('entrar')}>Entrar</button>
          <button type="button" role="tab" aria-selected={modo === 'criar'} className={modo === 'criar' ? 'ativo' : ''} onClick={() => setModo('criar')}>Criar conta</button>
        </div>

        {modo === 'criar' && (
          <label className="campo">
            <span>Seu nome</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" placeholder="Ex.: Mariana" />
          </label>
        )}
        <label className="campo">
          <span>E-mail</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="voce@email.com" />
        </label>
        <label className="campo">
          <span>Senha</span>
          <input type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)}
            autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} placeholder="Mínimo 6 caracteres" />
        </label>

        {erro && <p className="msg erro">{erro}</p>}
        {info && <p className="msg info">{info}</p>}

        <button className="botao" disabled={enviando}>
          {enviando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar minha conta'}
        </button>
        {db.MODO_DEMO && <p className="suave centro pequeno">Modo demonstração: qualquer e-mail e senha funcionam.</p>}
      </form>
    </div>
  )
}
