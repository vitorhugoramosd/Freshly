# 2. Levantamento de Requisitos

## 2.1 Requisitos Funcionais

Descrevem **o que o sistema deve fazer**.

| ID | Requisito | Descrição | Caso de uso |
|---|---|---|---|
| RF01 | Cadastro de usuário | O sistema deve permitir que o visitante crie uma conta informando nome, e-mail e senha. | UC01 |
| RF02 | Autenticação | O sistema deve permitir que o usuário acesse o app com e-mail e senha e mantenha a sessão aberta no aparelho. | UC02 |
| RF03 | Sair da conta | O sistema deve permitir que o usuário encerre a sessão. | UC03 |
| RF04 | Cadastro de alimento | O sistema deve permitir cadastrar um alimento com nome, quantidade, unidade, categoria, local (geladeira, freezer ou despensa), data de validade e preço pago (opcional). | UC04 |
| RF05 | Atalhos de validade | No cadastro, o sistema deve oferecer atalhos para preencher a validade: amanhã, 3 dias, 1 semana e 1 mês. | UC04 |
| RF06 | Edição de alimento | O sistema deve permitir alterar todos os dados de um alimento cadastrado. | UC05 |
| RF07 | Exclusão de alimento | O sistema deve permitir excluir um alimento, pedindo confirmação antes. | UC06 |
| RF08 | Lista por prioridade | O sistema deve listar os alimentos em casa agrupados em: vencidos, consumir agora, em breve e depois. | UC07 |
| RF09 | Filtro por local | O sistema deve permitir filtrar a lista por geladeira, freezer ou despensa. | UC07 |
| RF10 | Resumo na tela inicial | A tela inicial deve mostrar os 5 alimentos que vencem primeiro e a economia do mês. | UC07, UC12 |
| RF11 | Busca de alimento | O sistema deve permitir buscar alimentos pelo nome, sem diferenciar acentos e maiúsculas. | UC08 |
| RF12 | Registro de consumo ou descarte | O sistema deve permitir marcar um alimento como "Consumi" ou "Joguei fora", tirando-o da lista. | UC09 |
| RF13 | Alertas de validade | O sistema deve pedir permissão de notificação e avisar quando houver alimentos vencidos ou vencendo em até 2 dias. | UC10 |
| RF14 | Receitas sugeridas | O sistema deve sugerir receitas que usem os ingredientes cadastrados, priorizando os que vencem primeiro, com filtros (rápidas, saudáveis, fáceis). | UC11 |
| RF15 | Detalhe da receita | O sistema deve mostrar tempo, dificuldade, ingredientes que o usuário já tem e o modo de preparo. | UC11 |
| RF16 | Economia do mês | O sistema deve mostrar o valor economizado, os alimentos salvos do desperdício, o percentual consumido no prazo e o comparativo de desperdício com o mês anterior. | UC12 |
| RF17 | Instalação no celular | O sistema deve poder ser instalado na tela inicial do Android e do iPhone, sem loja de aplicativos. | UC13 |
| RF18 | Alimentos de exemplo | O sistema deve permitir adicionar uma lista de alimentos de exemplo, para demonstração. | UC04 |
| RF19 | Identificação visual | O sistema deve exibir um ícone para cada alimento, escolhido pelo nome ou pela categoria. | UC07 |

## 2.2 Requisitos Não Funcionais

Descrevem **como o sistema deve funcionar**: qualidade, restrições técnicas e condições de operação.

| ID | Categoria | Descrição |
|---|---|---|
| RNF01 | Usabilidade | O cadastro de um alimento deve ser feito em uma única tela, com atalhos de validade, em até 1 minuto. |
| RNF02 | Usabilidade | As telas devem ser pensadas para celular (largura de 360 a 480 px), com botões grandes e navegação por abas. |
| RNF03 | Compatibilidade | O app deve funcionar nos navegadores atuais de Android (Chrome) e iPhone (Safari), e ser instalável como PWA. |
| RNF04 | Segurança | Cada usuário só pode ler e alterar os próprios alimentos. A regra fica no banco (RLS, segurança por linha), e não só na tela. |
| RNF05 | Segurança | As senhas devem ser guardadas criptografadas (hash), nunca em texto puro, e a comunicação deve usar HTTPS. |
| RNF06 | Desempenho | O app deve abrir em até 3 segundos numa conexão 4G. O pacote principal tem cerca de 152 KB compactado. |
| RNF07 | Disponibilidade | Depois de instalado, o app deve abrir mesmo sem internet (os arquivos ficam guardados pelo service worker). Os dados precisam de conexão. |
| RNF08 | Localização | Textos em português do Brasil, datas no formato dd/mm/aaaa e valores em reais (R$). |
| RNF09 | Custo | A infraestrutura deve ser gratuita: hospedagem na Vercel (plano Hobby) e banco no Supabase (plano Free). |
| RNF10 | Manutenibilidade | As regras de negócio devem ficar separadas das telas (pasta `src/lib`) e ter testes automáticos. |
| RNF11 | Privacidade (LGPD) | O sistema deve coletar só o necessário: nome, e-mail e os alimentos cadastrados. |

## 2.3 Regras de Negócio

### Conta do usuário

* **RN01:** O e-mail deve ser único no sistema. Antes de salvar, o e-mail é passado para minúsculas e os espaços são removidos.
* **RN02:** A senha deve ter pelo menos 6 caracteres.
* **RN03:** O nome é obrigatório para criar a conta.

### Alimentos

* **RN04:** São obrigatórios o nome (1 a 80 caracteres), a quantidade (maior que zero) e a data de validade.
* **RN05:** O local deve ser um destes: Geladeira, Freezer ou Despensa.
* **RN06:** O preço é opcional e, se informado, não pode ser negativo. Aceita vírgula ou ponto.
* **RN07:** Cada alimento pertence a um único usuário. Se a conta for apagada, os alimentos dela também são.
* **RN08:** Todo alimento tem um status: *ativo* (em casa), *consumido* ou *descartado*. Ao virar consumido ou descartado, guarda a data em que isso aconteceu e sai da lista, mas continua contando nas estatísticas.

### Prioridade e alertas

* **RN09:** As faixas de prioridade são calculadas pelos dias que faltam para a validade:

  | Faixa | Regra |
  |---|---|
  | Vencido | a validade já passou |
  | Consumir agora | vence hoje ou em até 2 dias |
  | Em breve | vence em 3 a 7 dias |
  | Depois | vence em mais de 7 dias |

* **RN10:** O alerta considera os alimentos ativos vencidos ou que vencem em até 2 dias, e é mostrado no máximo uma vez por dia em cada aparelho.

### Receitas

* **RN11:** Uma receita é sugerida quando algum ingrediente dela está cadastrado e ainda não venceu. Alimentos vencidos não entram na sugestão.
* **RN12:** As receitas são ordenadas por pontos. Cada ingrediente vale 3 pontos se for "consumir agora", 2 se for "em breve" e 1 se for "depois".

### Economia

* **RN13:** A economia do mês é a soma dos preços dos alimentos marcados como "Consumi" no mês atual. Alimento sem preço conta como R$ 0.
* **RN14:** Um alimento é "salvo do desperdício" quando foi consumido a 3 dias ou menos da validade.
* **RN15:** O comparativo de desperdício compara a quantidade de alimentos descartados no mês atual com a do mês anterior.

## 2.4 Requisitos futuros (próximas versões)

| ID | Descrição |
|---|---|
| RF20 | Recuperação de senha por e-mail |
| RF21 | Cadastro por leitor de código de barras |
| RF22 | Geladeira compartilhada com a família ou república (Plano Plus) |
| RF23 | Notificação mesmo com o app fechado (Web Push) |
