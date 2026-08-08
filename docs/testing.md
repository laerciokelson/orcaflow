# Testes e qualidade

## Backend

`make test-backend` substitui explicitamente o ambiente do processo e executa Pest contra `orcaflow_test` em MySQL real e Redis nas bases lógicas 10/11. O `TestCase` recusa iniciar se o ambiente não for `testing` ou se a base não terminar em `_test`.

## Frontend

`make test-frontend` executa Vitest com jsdom e React Testing Library. `make analyse` combina Larastan nível 7, sem baseline, com TypeScript strict. `make lint` verifica Pint, ESLint e Prettier.

## E2E

`make test-e2e`:

1. gera o build frontend;
2. inicia `app-e2e` e `nginx-e2e` na porta 8081;
3. recria apenas `orcaflow_test`;
4. cria automaticamente `e2e@orcaflow.test`;
5. executa em Chromium o fluxo aplicação → login → área autenticada → logout.

O seeder E2E também valida ambiente e sufixo da base. Nunca aponta para a base de desenvolvimento.

## Verificação completa

`make quality` executa formatação, lint, análises, Pest, Vitest e build. Execute adicionalmente `make test-e2e` para alterações de autenticação, navegação ou infraestrutura web.
