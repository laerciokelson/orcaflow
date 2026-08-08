# OrçaFlow

OrçaFlow é uma aplicação monolítica para gestão de orçamentos e serviços técnicos. Cada empresa executa uma instalação independente; a aplicação não é multi-tenant.

## Stack

Laravel 13, PHP 8.4, React 19, TypeScript, Inertia 3, Tailwind CSS 4, MySQL 8.4 LTS, Redis, Nginx e Docker Compose. Qualidade e testes usam Pest, Pint, Larastan, Vitest, React Testing Library e Playwright.

## Início rápido

Pré-requisitos: Git, Docker e Docker Compose. PHP, Composer, Node, MySQL e Redis não são necessários no host.

```bash
git clone git@github.com:laerciokelson/orcaflow.git
cd orcaflow
make setup
```

Depois do setup:

- aplicação: <http://localhost:8080>
- Mailpit: <http://localhost:8025>
- Vite: <http://localhost:5173>
- liveness: <http://localhost:8080/up>
- readiness: <http://localhost:8080/ready>

O registo público está desativado. Utilizadores iniciais deverão ser criados por um processo administrativo futuro ou, apenas durante desenvolvimento, através de Tinker.

## Comandos

Execute `make help` para a lista completa. Os comandos principais são `make up`, `make down`, `make shell`, `make migrate`, `make test`, `make test-e2e`, `make lint`, `make analyse` e `make quality`.

Consulte [arquitetura](docs/architecture.md), [desenvolvimento](docs/development.md) e [testes](docs/testing.md).
