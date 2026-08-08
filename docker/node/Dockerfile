FROM node:24.5.0-bookworm-slim AS node

FROM orcaflow-php:dev

USER root

COPY --from=node /usr/local /usr/local

USER app

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
