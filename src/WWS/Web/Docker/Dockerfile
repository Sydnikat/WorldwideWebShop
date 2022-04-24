FROM node:17-alpine AS builder

WORKDIR /code
COPY Web/frontend/package*.json Web/frontend/tsconfig.json ./
RUN npm install

COPY Web/frontend .
COPY Web/frontend/tsconfig.json ./tsconfig.json

RUN npm run build


FROM nginx:1.18.0-alpine

COPY --from=builder /code/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY Web/frontend/nginx/default.conf /etc/nginx/conf.d

RUN ls /etc/nginx/conf.d
RUN cat /etc/nginx/conf.d/default.conf

EXPOSE 80 443

COPY Web/frontend/config-generator.sh /docker-entrypoint.d/00-gv-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/00-gv-entrypoint.sh
