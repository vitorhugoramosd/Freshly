import { useEffect, useState } from 'react'
import { Bell, LogOut, Smartphone, RotateCcw, Share } from 'lucide-react'
import { useApp } from '../lib/AppContext'
import * as db from '../lib/db'
import { pedirPermissao, permissaoAtual, verificarAlertas } from '../lib/alertas'

export default function Mais() {
  const { sessao, nome, alimentos, notificar, recarregar } = useApp()
  const [permissao, setPermissao] = useState(permissaoAtual())
  const [instalar, setInstalar] = useState(null)

  // No Android/Chrome o navegador avisa que o app pode ser instalado
  useEffect(() => {
    const guardar = (e) => { e.preventDefault(); setInstalar(e) }
    window.addEventListener('beforeinstallprompt', guardar)
    return () => window.removeEventListener('beforeinstallprompt', guardar)
  }, [])

  const instalado = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone
  const ehIphone = /iphone|ipad|ipod/i.test(navigator.userAgent)

  async function carregarExemplos() {
    if (!db.MODO_DEMO && !window.confirm('Adicionar 14 alimentos de exemplo à sua conta? Bom para demonstrar o app.')) return
    try {
      await db.carregarExemplos()
      await recarregar()
      notificar('Alimentos de exemplo adicionados')
    } catch {
      notificar('Não foi possível adicionar os exemplos.')
    }
  }

  async function ativarAlertas() {
    const p = await pedirPermissao()
    setPermissao(p)
    if (p === 'granted') {
      const mostrou = await verificarAlertas(alimentos, true)
      notificar(mostrou ? 'Alertas ativados!' : 'Alertas ativados. Nada vencendo agora 🎉')
    } else if (p === 'denied') {
      notificar('As notificações foram bloqueadas no navegador.')
    }
  }

  return (
    <>
      <h1 className="titulo-tela">Mais</h1>

      <section className="cartao bloco perfil">
        <span className="avatar grande">{(nome || '?').charAt(0).toUpperCase()}</span>
        <div>
          <strong>{nome}</strong>
          <p className="suave">{sessao?.user?.email}</p>
        </div>
      </section>

      <section className="cartao bloco">
        <h3><Bell size={18} /> Alertas de validade</h3>
        <p className="suave">Avisamos quando um alimento vence em até 2 dias, uma vez por dia, ao abrir o app.</p>
        {permissao === 'granted' && <p className="msg info">Alertas ativados neste aparelho.</p>}
        {permissao === 'denied' && <p className="msg erro">Bloqueados. Libere as notificações nas configurações do navegador.</p>}
        {permissao === 'unsupported' && <p className="msg erro">{ehIphone && !instalado ? 'No iPhone, instale o app na tela inicial primeiro para ativar os alertas.' : 'Este navegador não suporta notificações.'}</p>}
        {permissao === 'default' && <button className="botao" onClick={ativarAlertas}>Ativar alertas</button>}
        {permissao === 'granted' && <button className="botao secundario" onClick={() => verificarAlertas(alimentos, true).then((ok) => !ok && notificar('Nada vencendo agora 🎉'))}>Testar alerta agora</button>}
      </section>

      {!instalado && (
        <section className="cartao bloco">
          <h3><Smartphone size={18} /> Instalar o app</h3>
          {instalar ? (
            <button className="botao" onClick={async () => { instalar.prompt(); await instalar.userChoice; setInstalar(null) }}>Instalar Freshly</button>
          ) : ehIphone ? (
            <p className="suave">No Safari, toque em <Share size={14} /> <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.</p>
          ) : (
            <p className="suave">No menu do navegador (⋮), toque em <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</p>
          )}
        </section>
      )}

      <button className="botao secundario" onClick={carregarExemplos}>
        <RotateCcw size={18} /> {db.MODO_DEMO ? 'Restaurar dados de exemplo' : 'Adicionar alimentos de exemplo'}
      </button>

      <button className="botao fantasma perigo" onClick={db.sair}><LogOut size={18} /> Sair da conta</button>
      <p className="suave pequeno centro">Freshly · Mais organização. Menos desperdício.</p>
    </>
  )
}
