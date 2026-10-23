# Freshly

Mais organização. Menos desperdício.

App (PWA) para cadastrar alimentos, ver o que consumir primeiro, receber alertas de validade, ganhar sugestões de receitas e acompanhar quanto dinheiro foi economizado.

## Como o projeto está organizado

| Pasta / arquivo | O que tem |
|---|---|
| `src/pages/` | Uma tela por arquivo: Login, Início, Alimentos, Adicionar/Editar, Receitas, Economia, Mais |
| `src/components/` | Pedaços reaproveitados: barra de abas, linha de alimento, cabeçalho |
| `src/lib/db.js` | Único arquivo que conversa com o banco (Supabase ou modo demonstração) |
| `src/lib/calculos.js` | Regras de negócio: prioridade, receitas sugeridas, economia do mês |
| `src/lib/alertas.js` | Notificações de validade |
| `src/data/` | Categorias, emojis e a lista de receitas |
| `supabase/schema.sql` | Script que cria a tabela e as regras de segurança no banco |
| `.env` | URL e chave pública do Supabase (não suba para o GitHub) |

**Stack:** React + Vite (front end), Supabase (banco Postgres, login e regras de acesso, que fazem o papel do back end), vite-plugin-pwa (instalação e funcionamento offline).

## 1. Preparar o banco (uma vez só)

1. No Supabase, abra **SQL Editor → New query**.
2. Cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Authentication → Sign In / Providers → Email**, desligue **Confirm email** (facilita a demonstração).

## 2. Publicar na internet (grátis)

### Opção A: Netlify Drop (a mais fácil, sem GitHub)

1. Descompacte o arquivo `freshly-site.zip` (é a pasta `dist` já pronta, com as chaves do Supabase dentro).
2. Entre em **app.netlify.com/drop** e crie uma conta grátis.
3. Arraste a **pasta descompactada** para a página. Em segundos sai um link tipo `https://nome-aleatorio.netlify.app`.
4. Em **Site configuration → Change site name**, troque para algo como `freshly-univille`.

Para atualizar depois: rode `npm run build` e arraste a nova pasta `dist` em **Deploys**.

### Opção B: Vercel com GitHub (atualiza sozinho a cada commit)

1. Suba este projeto para um repositório no GitHub (o `.gitignore` já impede o `.env` de subir).
2. Em **vercel.com**, entre com o GitHub, clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY` com os valores do `.env`.
4. Clique em **Deploy**.

## 3. Instalar no celular

* **Android (Chrome):** abra o link e toque em **Instalar app** (ou menu ⋮ → Adicionar à tela inicial).
* **iPhone (Safari):** abra o link, toque em **Compartilhar** → **Adicionar à Tela de Início**.

Dica para a apresentação: gere um QR code do link (qualquer site gerador de QR code) e coloque no último slide.

## Rodar no computador

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Sem o arquivo `.env`, o app roda em **modo demonstração** (dados só no navegador, qualquer e-mail e senha entram).

## Para a demonstração

Em **Mais → Adicionar alimentos de exemplo**, o app cadastra uma lista pronta (alimentos vencendo, consumidos e descartados), para as telas de Receitas e Economia aparecerem cheias.

## Limites conhecidos e próximos passos

* **Alertas:** hoje a notificação aparece quando o app é aberto (uma vez por dia). Para avisar com o app fechado, o próximo passo é Web Push com uma Edge Function do Supabase agendada.
* **Geladeira compartilhada:** cada conta vê só os próprios alimentos. Dividir a lista com a família/república seria uma tabela de "casas" com membros.
* **Lojas:** para ir à Play Store, o mesmo app pode ser empacotado com Capacitor ou TWA (Trusted Web Activity).
