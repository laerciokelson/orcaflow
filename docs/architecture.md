# Arquitetura

## Visão geral

O OrçaFlow é um monólito Laravel com frontend React entregue através de Inertia. Rotas, autenticação, autorização, validação e persistência permanecem no Laravel; não existe uma API REST separada.

Cada empresa possui uma instalação e infraestrutura independentes. Não há resolução de tenant, partilha de base de dados ou identificação de empresa por request.

```text
Browser -> Nginx -> PHP-FPM/Laravel -> MySQL
                              |-----> Redis
                              |-----> Mailpit (desenvolvimento)
Queue e Scheduler reutilizam a imagem e o código PHP.
Vite/Node serve e compila os assets React/TypeScript.
```

## Persistência

MySQL 8.4 LTS é a fonte de verdade e usa `utf8mb4`. Redis é acedido através da extensão `phpredis` e suporta cache, sessões e filas. Redis não é fonte de verdade.

Ficheiros usam a abstração Laravel Storage e começam no disco local. Código futuro deve usar `Storage`/`Filesystem` em vez de caminhos físicos, permitindo uma migração posterior para storage S3-compatible.

## Segurança e saúde

Fortify fornece login, logout, recuperação/reset de password, confirmação de password e verificação de email. Registo público, autenticação social, passkeys e 2FA não fazem parte desta fundação.

`/up` é o liveness nativo do Laravel. `/ready` confirma, sem expor configuração ou exceções, conectividade MySQL/Redis e escrita no diretório de storage.

Comandos destrutivos de base de dados são proibidos, exceto em `testing` ou `e2e` quando o nome da base termina em `_test`.
