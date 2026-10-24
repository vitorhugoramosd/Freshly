import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import * as db from '../lib/db'
import logo from '../logo.png'

export default function Login() {
  const [modo, setModo] = useState('entrar') // 'entrar' ou 'criar'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [info, setInfo] = useState('')
  const [enviando, setEnviando] = useState(false)

  function trocarModo(novo) {
    setModo(novo)
    setErro('')
    setInfo('')
  }

  async function enviar(e) {
    e.preventDefault() // impede o navegador de recarregar a página
    setErro(''); setInfo('')

    // Confere os campos antes de chamar o servidor
    if (modo === 'criar' && !nome.trim()) return setErro('Conte como podemos te chamar.')
    if (!email.includes('@')) return setErro('Digite um e-mail válido.')
    if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.')

    setEnviando(true)
    try {
      if (modo === 'entrar') {
        await db.entrar(email, senha)
      } else {
        const { precisaConfirmar } = await db.criarConta(nome.trim(), email, senha)
        if (precisaConfirmar) {
          setModo('entrar')
          setInfo('Conta criada! Abra o link que enviamos para o seu e-mail (veja também o spam) e depois toque em Entrar.')
        }
      }
      // Se deu certo, o app troca sozinho para a tela inicial
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

      <form className="cartao login-form" onSubmit={enviar} noValidate>
        <div className="segmentado" role="tablist">
          <button type="button" role="tab" aria-selected={modo === 'entrar'} className={modo === 'entrar' ? 'ativo' : ''} onClick={() => trocarModo('entrar')}>Entrar</button>
          <button type="button" role="tab" aria-selected={modo === 'criar'} className={modo === 'criar' ? 'ativo' : ''} onClick={() => trocarModo('criar')}>Criar conta</button>
        </div>

        {modo === 'criar' && (
          <label className="campo">
            <span>Seu nome</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" placeholder="Ex.: Mariana" />
          </label>
        )}
        <label className="campo">
          <span>E-mail</span>
          {/* autoCapitalize/autoCorrect desligados: o celular não muda o e-mail sozinho */}
          <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="voce@email.com" />
        </label>
        <label className="campo">
          <span>Senha</span>
          <div className="senha">
            <input type={verSenha ? 'text' : 'password'} value={senha} onChange={(e) => setSenha(e.target.value)}
              autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
              autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="Mínimo 6 caracteres" />
            <button type="button" className="icone-btn" onClick={() => setVerSenha((v) => !v)} aria-label={verSenha ? 'Esconder senha' : 'Mostrar senha'}>
              {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </label>

        {erro && <p className="msg erro" role="alert">{erro}</p>}
        {info && <p className="msg info" role="status">{info}</p>}

        <button className="botao" disabled={enviando}>
          {enviando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar minha conta'}
        </button>
        {db.MODO_DEMO && <p className="suave centro pequeno">Modo demonstração: qualquer e-mail e senha funcionam.</p>}
      </form>
    </div>
  )
}
