# Documentação do Freshly

*Mais organização. Menos desperdício.*

Entregas da disciplina **Tópicos Avançados em Negócios Digitais**, seguindo as etapas do ciclo de desenvolvimento: requisitos → projeto → implementação → teste → implantação.

| # | Entrega | Conteúdo |
|---|---|---|
| 1 | [Definição do Problema](01-definicao-do-problema.md) | Problema, evidências das entrevistas, persona, solução e escopo |
| 2 | [Levantamento de Requisitos](02-levantamento-de-requisitos.md) | Requisitos funcionais (RF), não funcionais (RNF) e regras de negócio (RN) |
| 3 | [Atores e Casos de Uso](03-atores-e-casos-de-uso.md) | Atores, diagrama e descrição dos 13 casos de uso |
| 4 | [Protótipo de Telas](04-prototipo-de-telas.md) | As 10 telas do app e a identidade visual |
| 5 | [Projeto: Banco de Dados](05-banco-de-dados.md) | MER, diagrama de tabelas (PK e FK), dicionário de dados e implementação no SGBD |
| 6 | [Implementação](06-implementacao.md) | Linguagem, frameworks, arquitetura e integração com o banco |
| 7 | [Testes](07-testes.md) | Casos de teste e testes automáticos |
| 8 | [Implantação](08-implantacao.md) | Publicação, infraestrutura, instalação e rollback |
| 9 | [Equipe](09-equipe.md) | Product Owner, Tech Leader e funções do time |

## Resumo rápido

* **App publicado:** https://freshly-blond.vercel.app
* **Tipo:** PWA (instala pelo navegador, sem loja)
* **Linguagem:** JavaScript (React) · **Banco:** PostgreSQL no Supabase · **Hospedagem:** Vercel
* **Testes:** `npm test` (17 testes automáticos)

## Diagramas

Os diagramas ficam em [`img/`](img), em PNG (para slides) e SVG (para zoom sem perder qualidade). Os scripts que geram cada um estão em [`diagramas/`](diagramas):

```bash
cd docs/diagramas
python3 casos_de_uso.py ../img/casos-de-uso.svg
python3 banco.py ../img            # mer.svg e diagrama-tabelas.svg
```
