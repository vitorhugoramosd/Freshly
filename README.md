# Freshly

Mais organização. Menos desperdício.

App (PWA) para cadastrar alimentos, ver o que consumir primeiro, receber alertas de validade, ganhar sugestões de receitas e acompanhar quanto dinheiro foi economizado.

**App publicado:** https://freshly-blond.vercel.app

## Documentação

Toda a documentação do projeto está na pasta [`docs/`](docs/README.md):

1. [Definição do Problema](docs/01-definicao-do-problema.md)
2. [Levantamento de Requisitos](docs/02-levantamento-de-requisitos.md)
3. [Atores e Casos de Uso](docs/03-atores-e-casos-de-uso.md)
4. [Protótipo de Telas](docs/04-prototipo-de-telas.md)
5. [Projeto: Banco de Dados](docs/05-banco-de-dados.md)
6. [Implementação](docs/06-implementacao.md)
7. [Testes](docs/07-testes.md)
8. [Implantação](docs/08-implantacao.md)
9. [Equipe](docs/09-equipe.md)

## Como o projeto está organizado

| Pasta / arquivo | O que tem |
|---|---|
| `src/pages/` | Uma tela por arquivo: Login, Início, Alimentos, Adicionar/Editar, Receitas, Economia, Mais |
| `src/components/` | Pedaços reaproveitados: barra de abas, linha de alimento, cabeçalho |
| `src/lib/db.js` | Único arquivo que conversa com o banco (Supabase ou modo demonstração) |
| `src/lib/calculos.js` | Regras de negócio: prioridade, receitas sugeridas, economia do mês |
| `src/lib/alertas.js` | Notificações de validade |
| `src/lib/__tests__/` | Testes automáticos das regras de negócio |
| `src/data/` | Categorias, emojis e a lista de receitas |
| `supabase/schema.sql` | Script que cria a tabela e as regras de segurança no banco |
| `docs/` | Documentação, diagramas e protótipo de telas |
| `.env` | URL e chave pública do Supabase (não suba para o GitHub) |

**Stack:** React + Vite (front end), Supabase (banco PostgreSQL, login e regras de acesso, que fazem o papel do back end), vite-plugin-pwa (instalação e funcionamento offline) e Vitest (testes).

## Rodar no computador

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run dev     # abre em http://localhost:5173
npm test        # roda os testes automáticos
```

Sem o arquivo `.env`, o app roda em **modo demonstração** (dados só no navegador, qualquer e-mail e senha entram). Para usar o banco, copie `.env.example` para `.env` e preencha as chaves do Supabase.

## Publicar

O passo a passo completo (Supabase + Vercel) está em [docs/08-implantacao.md](docs/08-implantacao.md). Resumo: rodar `supabase/schema.sql` no SQL Editor do Supabase, importar o repositório na Vercel com as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY`, e fazer o deploy. Depois disso, cada push na `main` publica sozinho.

## Instalar no celular

* **Android (Chrome):** abra o link e toque em **Instalar app** (ou menu ⋮ → Adicionar à tela inicial).
* **iPhone (Safari):** abra o link, toque em **Compartilhar** → **Adicionar à Tela de Início**.

## Para a demonstração

Em **Mais → Adicionar alimentos de exemplo**, o app cadastra uma lista pronta (alimentos vencendo, consumidos e descartados), para as telas de Receitas e Economia aparecerem cheias.

## Próximos passos

* **Recuperação de senha** por e-mail.
* **Alertas com o app fechado:** Web Push com uma Edge Function do Supabase agendada.
* **Geladeira compartilhada:** uma tabela de "casas" com membros, para a família ou república dividir a lista.
* **Lojas:** o mesmo app pode ser empacotado para a Play Store com Capacitor ou TWA (Trusted Web Activity).
