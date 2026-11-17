# 9. Equipe

> Preencher os nomes dos integrantes do grupo nos campos marcados com `‹nome›`.

## 9.1 Papéis principais

| Papel | Integrante | Responsabilidades |
|---|---|---|
| **Product Owner (PO)** | ‹nome› | Dono do produto. Fala pelo cliente (a persona), decide o que entra em cada versão, prioriza o backlog de requisitos e aceita ou não cada entrega. |
| **Tech Leader** | ‹nome› | Responsável técnico. Escolhe a arquitetura e as tecnologias, revisa o código, define os padrões e destrava problemas técnicos do time. |

## 9.2 Funções no time

| Função | Integrante | O que faz no Freshly |
|---|---|---|
| **Front End** | ‹nome› | Telas em React (`src/pages`, `src/components`), visual (`estilos.css`) e PWA (instalação e service worker). |
| **Back End** | ‹nome› | Camada de dados (`src/lib/db.js`), autenticação com o Supabase, regras de negócio (`src/lib/calculos.js`) e alertas. |
| **DBA** | ‹nome› | Modelo do banco (MER, tabelas e dicionário), script `supabase/schema.sql`, regras de segurança (RLS) e o projeto no Supabase. |
| **QA (Qualidade e Testes)** | ‹nome› | Casos de teste, testes automáticos (`npm test`) e execução do roteiro manual antes de cada entrega. |
| **UX/UI (Design)** | ‹nome› | Pesquisa com usuários, persona, mapa de empatia e protótipo das telas. |
| **DevOps / Implantação** | ‹nome› | Publicação na Vercel, variáveis de ambiente, domínio e monitoramento do Supabase. |

Em times pequenos, uma pessoa pode acumular mais de uma função. O importante é cada função ter um responsável.

## 9.3 Como o time trabalha

* **Código:** no GitHub ([vitorhugoramosd/Freshly](https://github.com/vitorhugoramosd/Freshly)), na branch `main`. Cada mudança vira um commit com mensagem clara.
* **Publicação:** automática pela Vercel a cada push na `main` ([08-implantacao.md](08-implantacao.md)).
* **Qualidade:** nenhuma entrega sem `npm test` passando e o roteiro manual executado pelo QA ([07-testes.md](07-testes.md)).
* **Decisões de produto:** o PO prioriza; o Tech Leader avalia o esforço técnico.
