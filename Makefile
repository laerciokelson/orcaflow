SHELL := /bin/bash

.DEFAULT_GOAL := help

.PHONY: help setup up down restart shell migrate test test-backend test-frontend test-e2e lint analyse quality logs

help:
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "%-18s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Prepara um clone novo e inicia o ambiente
	@test -f .env || cp .env.example .env
	docker compose build app node
	docker compose run --rm --no-deps app composer install --no-interaction --prefer-dist
	docker compose run --rm --no-deps node npm ci
	docker compose run --rm --no-deps app php artisan key:generate --force
	docker compose up -d mysql redis mailpit app
	docker compose exec app php artisan migrate --force
	docker compose exec app php artisan storage:link
	docker compose up -d

up: ## Inicia todos os serviços de desenvolvimento
	docker compose up -d

down: ## Para e remove os contentores, preservando volumes
	docker compose down

restart: ## Reinicia os serviços
	docker compose restart

shell: ## Abre uma shell no contentor PHP
	docker compose exec app bash

migrate: ## Executa apenas migrations pendentes
	docker compose exec app php artisan migrate

test: test-backend test-frontend ## Executa testes backend e frontend

test-backend: ## Executa Pest contra MySQL e Redis isolados
	docker compose up -d mysql redis
	docker compose exec \
		-e APP_ENV=testing \
		-e DB_DATABASE=orcaflow_test \
		-e REDIS_DB=10 \
		-e REDIS_CACHE_DB=11 \
		app php artisan test

test-frontend: ## Executa Vitest
	docker compose run --rm --no-deps node npm test

test-e2e: ## Recria apenas a base E2E e executa o smoke test Chromium
	docker compose run --rm --no-deps node npm run build
	@rm -f public/hot
	docker compose --profile e2e up -d mysql redis app-e2e nginx-e2e
	docker compose exec app-e2e php artisan migrate:fresh --force --seed --seeder=Database\\Seeders\\E2eSeeder
	docker compose --profile e2e run --rm playwright

lint: ## Verifica formatação PHP, ESLint e Prettier
	docker compose exec app ./vendor/bin/pint --test --parallel
	docker compose run --rm --no-deps node npm run lint:check
	docker compose run --rm --no-deps node npm run format:check

analyse: ## Executa Larastan nível 7 e TypeScript strict
	docker compose exec app ./vendor/bin/phpstan analyse --memory-limit=1G
	docker compose run --rm --no-deps node npm run typecheck

quality: lint analyse test ## Executa todos os checks exceto E2E
	docker compose run --rm --no-deps node npm run build

logs: ## Segue os logs dos serviços
	docker compose logs -f --tail=200
