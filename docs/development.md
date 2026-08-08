# Desenvolvimento

## Preparação

Copie o repositório e execute `make setup`. O comando cria `.env` a partir de `.env.example`, constrói a imagem PHP, instala dependências pelos lockfiles, gera a chave, inicia a infraestrutura, executa migrations pendentes e cria o link de storage.

O setup nunca executa `migrate:fresh`, `db:wipe` ou outra migration destrutiva.

## Serviços

- `nginx`: HTTP em `localhost:8080`.
- `app`: PHP-FPM 8.4, Composer e `phpredis`.
- `node`: Node 24, PHP CLI para a geração Wayfinder do starter e Vite em `localhost:5173`.
- `mysql`: MySQL 8.4, acessível apenas na rede Compose.
- `redis`: Redis 8.2, acessível apenas na rede Compose.
- `queue`: `php artisan queue:work`.
- `scheduler`: `php artisan schedule:work`.
- `mailpit`: SMTP interno em 1025 e UI em `localhost:8025`.

`app`, `queue` e `scheduler` usam a imagem `orcaflow-php:dev` e executam como o UID/GID configurado. Ajuste `APP_UID` e `APP_GID` em `.env` se o utilizador do host não for 1000.

## Fluxo diário

Use `make up` e `make down`; `make logs` acompanha logs e `make shell` abre uma shell PHP. Execute `make migrate` apenas para migrations pendentes. Variáveis locais pertencem a `.env`, que nunca é versionado.

Emails de desenvolvimento são enviados por SMTP para o Mailpit. Nenhum email sai para destinatários reais.
