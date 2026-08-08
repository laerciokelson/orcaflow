# OrçaFlow — regras do projeto

## Arquitetura e stack

- Monólito Laravel 13, PHP 8.4, React 19, TypeScript, Inertia 3 e Tailwind CSS 4.
- MySQL 8.4 é a fonte de verdade. Redis, através de `phpredis`, suporta cache, sessões e filas.
- A aplicação é single-tenant por instalação: cada empresa tem infraestrutura e instalação independentes.
- Manter a estrutura convencional do Laravel. Não criar microserviços, API REST separada, multi-tenancy ou arquitetura artificial de Domains/Modules.
- Usar Laravel Storage para ficheiros. A lógica da aplicação não deve depender de caminhos locais; o disco inicial é local e deve poder mudar futuramente para storage S3-compatible.

## Regras de desenvolvimento

- Validar input com Form Requests e autorizar operações com Policies.
- Manter controllers pequenos.
- Criar Actions quando existir um caso de uso de negócio relevante.
- Criar Services apenas quando existir comportamento genuinamente reutilizável.
- Não criar repositories genéricos nem abstrações preventivas.
- Não implementar fora do âmbito do issue.
- Nunca usar `float` para dinheiro.
- Armazenar futuros valores monetários em unidades monetárias mínimas usando inteiros/BIGINT. Exemplo: `1234.56 EUR` torna-se `123456` cêntimos.
- Percentagens, incluindo taxas de IVA, são conceitos separados e não são valores monetários.

## Regras de testes e qualidade

- Regras relevantes exigem testes.
- Testes backend usam MySQL real; SQLite não substitui MySQL.
- Bases destrutíveis de teste terminam obrigatoriamente em `_test` e usam ambiente `testing` ou `e2e`.
- Redis de testes usa bases lógicas isoladas.
- Executar os quality checks relevantes antes de concluir uma tarefa. A verificação completa é `make quality`; alterações a fluxos web críticos também exigem `make test-e2e`.
- Não criar baselines ou ignorar erros apenas para fazer Larastan passar.

## Regras conhecidas para desenvolvimento futuro

Estas regras são documentação; não devem ser implementadas sem um issue próprio:

- Materiais e mão de obra são apresentados separadamente.
- Custos e margens são internos e nunca apresentados ao cliente.
- Cada item do orçamento pode ter uma taxa de IVA diferente.
- Preços, custos, descrições e taxas dos orçamentos são snapshots.
- Orçamentos enviados não podem ser alterados silenciosamente; alterações exigem nova versão.
- O cliente poderá fazer aprovação parcial.
- O sinal é calculado sobre o valor efetivamente aprovado.
- Ajudantes podem ser pagos por hora, dia ou valor fixo.
- A aceitação será feita através de link seguro.
