# 7. Testes

## 7.1 Estratégia

| Tipo | O que cobre | Como roda |
|---|---|---|
| **Automático (unitário)** | Regras de negócio: faixas de prioridade, alertas, receitas, economia, datas, busca e ícones. | `npm test` (Vitest) |
| **Manual (funcional)** | Telas e fluxos com o banco real: cadastro, login, CRUD de alimentos, segurança, instalação. | Roteiro abaixo, no celular |

Os testes automáticos fixam a data de "hoje" em **10/11/2026**, para o resultado não depender do dia em que rodam. Para conferir que eles realmente pegam erro, mudamos de propósito o limite da faixa "consumir agora" de 2 para 3 dias: o CT-06 falhou, e depois a regra foi restaurada.

```bash
npm test
```

Resultado atual: **17 testes, 17 passando**.

## 7.2 Casos de Teste

Legenda do tipo: **A** = automático, **M** = manual.

| ID | Caso de uso / Regra | Cenário | Passos e dados | Resultado esperado | Tipo |
|---|---|---|---|---|:---:|
| CT-01 | UC01 | Criar conta com dados válidos | Criar conta com nome "Camila", e-mail novo e senha "123456" | Entra direto e mostra "Olá, Camila!" na tela Início | M |
| CT-02 | UC01 / RN01 | E-mail já cadastrado | Criar conta com um e-mail que já existe | Mensagem "Este e-mail já tem conta. Toque em Entrar e use sua senha." | M |
| CT-03 | UC01 / RN02 | Senha curta | Criar conta com senha "12345" | Mensagem "A senha precisa ter pelo menos 6 caracteres." e nada é enviado | M |
| CT-04 | UC02 | Senha errada | Entrar com e-mail certo e senha errada | Mensagem "E-mail ou senha incorretos..." e continua na tela de login | M |
| CT-05 | UC04 / RF05 | Cadastrar alimento válido | Nome "Brócolis", quantidade 1, Geladeira, atalho "3 dias", preço "7,50" | "Alimento salvo!" e o item aparece em "Em breve" | M |
| CT-06 | UC07 / RN09 | Faixas de prioridade | Validades a -2, 0, 2, 3, 7 e 8 dias | vencido, agora, agora, breve, breve, depois | A |
| CT-07 | UC09 / RN08 | Consumido sai da lista | Marcar um alimento como "Consumi" | Some das faixas e passa a contar na economia | A + M |
| CT-08 | UC04 / RN04 | Cadastro sem validade | Preencher só o nome e tocar em "Salvar" | Mensagem "Informe a data de validade." e nada é salvo | M |
| CT-09 | UC10 / RN10 | Quem entra no alerta | Itens vencido, a 1 dia, a 4 dias e a mais de 100 dias | Só o vencido e o de 1 dia entram no alerta | A |
| CT-10 | UC12 / RN13–RN15 | Economia do mês | Leite (R$ 5,90) consumido 2 dias antes de vencer, Arroz (R$ 25) consumido, Pão descartado; 2 descartes no mês anterior | Economizado R$ 30,90; 1 salvo; 1 descartado (R$ 9); mês anterior 2; 67% no prazo | A |
| CT-11 | UC11 / RN11–RN12 | Ordem das receitas | Tomate vence amanhã, Banana em 15 dias | Primeira receita usa o Tomate; vencido não entra | A |
| CT-12 | UC11 | Sem alimentos | Lista vazia | Nenhuma receita sugerida | A |
| CT-13 | UC06 | Excluir pede confirmação | Editar um alimento e tocar na lixeira | Pergunta antes; ao cancelar, nada é apagado | M |
| CT-14 | RNF04 (RLS) | Um usuário não vê o do outro | Entrar com a conta A, cadastrar um item; sair e entrar com a conta B | A conta B não vê o item da conta A | M |
| CT-15 | RN09 | Contas de datas | Somar 5 dias a 28/11; dias até 13/11 | 03/12; 3 dias | A |
| CT-16 | UC08 | Busca sem acento | Buscar "feijao" com "Feijão" cadastrado | Encontra o Feijão | A |
| CT-17 | RF19 | Ícone automático | Nome "Tomate cereja"; nome desconhecido em Laticínios | 🍅; 🥛 | A |
| CT-18 | UC13 | Instalar no celular | Abrir o link no Chrome (Android) e no Safari (iPhone) e instalar | Ícone na tela inicial; abre em tela cheia | M |
| CT-19 | UC03 | Sair da conta | Aba Mais → "Sair da conta" | Volta para a tela de login | M |
| CT-20 | UC10 | Alerta no celular | Ativar alertas com um item vencendo amanhã e tocar em "Testar alerta agora" | Notificação "Um alimento vence logo" | M |

## 7.3 Rastreabilidade dos testes automáticos

Os nomes dos testes no código começam pelo ID do caso de teste, para achar fácil:

| Arquivo | Casos |
|---|---|
| `src/lib/__tests__/datas.test.js` | CT-06, CT-10, CT-15 |
| `src/lib/__tests__/calculos.test.js` | CT-06, CT-07, CT-09, CT-10, CT-11, CT-12, CT-16, CT-17 |

## 7.4 Teste do software (homologação)

Antes de cada apresentação ou entrega:

1. Rodar `npm test` e `npm run lint` sem erros.
2. Abrir o link publicado no celular e executar os casos manuais (CT-01 a CT-05, CT-07, CT-08, CT-13, CT-14, CT-18 a CT-20).
3. Registrar o resultado (passou / falhou, data e quem testou) na tabela abaixo.

| Execução | Data | Responsável (QA) | Resultado |
|---|---|---|---|
| 1 | | Julia Lopes | |
| 2 | | Julia Lopes | |
