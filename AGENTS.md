# OrçaFlow — regras do projeto

## Idioma

- Escrever instruções e documentação interna em português.
- Usar português de Portugal nos textos apresentados ao utilizador, salvo requisito contrário.
- Manter em inglês os nomes técnicos no código, incluindo classes, métodos, propriedades, variáveis, tabelas, colunas, enums e rotas técnicas quando apropriado.
- Não traduzir nomes técnicos apenas para cumprir a regra de idioma.

## Arquitetura e stack

- Manter um monólito Laravel 13 e PHP 8.4, com React 19, TypeScript, Inertia 3 e Tailwind CSS 4 no frontend.
- Cada empresa possui uma instalação e infraestrutura Docker independentes. A aplicação é single-tenant por instalação; não implementar multi-tenancy.
- MySQL 8.4 é a fonte de verdade. Redis, através de `phpredis`, suporta cache, sessões e filas, mas não é fonte de verdade.
- Manter a estrutura convencional do Laravel. Não criar microserviços, API REST separada sem necessidade concreta nem arquitetura artificial de Domains/Modules.
- Evitar abstrações prematuras e implementar apenas o âmbito da Issue atual.
- Usar Laravel Storage para ficheiros. A lógica da aplicação não deve depender de caminhos locais; o disco inicial é local e deve poder mudar futuramente para storage S3-compatible.

## Workflow

1. Ler integralmente a Issue e este `AGENTS.md`.
2. Inspecionar o código existente e apresentar um plano curto antes de alterar ficheiros.
3. Implementar apenas o âmbito pedido, sem antecipar Issues futuras.
4. Adicionar ou atualizar testes proporcionais ao risco e ao comportamento alterado.
5. Executar os quality checks relevantes e informar os resultados reais.

- Não inventar regras de negócio ausentes. Perante uma decisão funcional relevante não especificada, parar e pedir esclarecimento.
- Não fazer commit ou push, salvo pedido explícito.

## PHP e desenho da aplicação

- Seguir PSR-12. Laravel Pint é a source of truth para formatação PHP e o `pint.json` é configuração obrigatória.
- As regras adicionais de alinhamento de `=` e `=>` pertencem ao `pint.json`; não fazer alinhamentos manuais que entrem em conflito com o formatter.
- Executar Pint depois de alterações PHP e antes de concluir cada tarefa.
- Validar input HTTP com Form Requests e autorizar operações com Policies.
- Manter controllers pequenos.
- Criar Actions quando existir um caso de uso de negócio relevante.
- Criar Services apenas quando existir comportamento genuinamente reutilizável.
- Não criar repositories genéricos nem abstrações preventivas sem necessidade concreta.
- Nunca usar `float` para valores monetários do domínio. Armazená-los como inteiros/BIGINT em unidades monetárias mínimas; por exemplo, `1234.56 EUR` corresponde a `123456` cêntimos.
- Tratar percentagens, incluindo taxas de IVA, como conceitos separados de valores monetários.

## Testes e qualidade

- Usar Pest para testes backend, Vitest e React Testing Library para lógica e componentes frontend, e Playwright para fluxos E2E importantes.
- Usar Larastan nível 7 para análise estática PHP. Não criar baselines nem ignorar erros para os esconder num projeto novo.
- Testes backend usam MySQL real; SQLite não substitui MySQL.
- Bases destrutíveis de teste terminam obrigatoriamente em `_test` e usam ambiente `testing` ou `e2e`. Redis de testes usa bases lógicas isoladas.
- Testes devem ser proporcionais ao risco e às alterações. Não exigir Playwright para mudanças que não afetem interface ou fluxos web.
- Executar `make quality` antes de concluir qualquer tarefa. Alterações a fluxos web críticos também exigem `make test-e2e`.

## UI/UX

- Criar layouts clean, modernos e profissionais, com boa hierarquia visual, espaçamento consistente e baixa densidade visual.
- Usar uma base visual neutra e reservar cores vivas sobretudo para ações principais, estados, alertas, feedback e métricas importantes.
- Manter contraste e acessibilidade; nunca transmitir significado apenas através da cor, combinando-a com texto, ícone ou badge.
- Usar shadcn/ui como base quando existir um componente adequado. Não duplicar componentes visuais e manter consistência entre formulários, botões, tabelas, cards, dialogs, drawers, badges e restantes elementos.
- Evitar gradientes, sombras excessivas e efeitos meramente decorativos.

### Responsividade obrigatória

- Todos os ecrãs devem ser responsivos. Uma funcionalidade frontend não está concluída se funcionar apenas em desktop.
- Considerar e validar desktop, tablet, mobile e os principais breakpoints antes de concluir uma tarefa frontend.
- Evitar larguras fixas que provoquem overflow. Formulários devem adaptar o número de colunas e grids devem reorganizar-se conforme o viewport.
- Definir uma estratégia responsiva para tabelas, como scroll horizontal controlado, apresentação alternativa ou ocultação apenas de informação secundária.
- Não esconder conteúdo importante apenas para fazer o layout caber.
- Garantir que dialogs e drawers não ultrapassam o viewport e que a navegação permanece utilizável em mobile.
- Não fazer ações essenciais dependerem exclusivamente de hover e dimensionar áreas interativas para utilização touch.

## Regras conhecidas para desenvolvimento futuro

Estas regras são apenas documentação e não devem ser implementadas sem uma Issue própria:

- Materiais e mão de obra são apresentados separadamente.
- Custos e margens são internos e nunca apresentados ao cliente.
- Diferentes itens do orçamento podem ter taxas de IVA diferentes.
- Preços, custos, descrições, taxas e outros dados relevantes dos orçamentos são snapshots.
- Um orçamento enviado não pode ser alterado silenciosamente; alterações relevantes exigem nova versão.
- O cliente poderá fazer aprovação parcial.
- O sinal é calculado sobre o valor efetivamente aprovado.
- Ajudantes podem ser pagos por hora, dia ou valor fixo.
- A aceitação do orçamento será feita através de link seguro.
- Nesta fase, a aplicação não é software de faturação.
