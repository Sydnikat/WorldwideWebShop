FROM node:14.7-alpine

WORKDIR /code
COPY Web/frontend/package*.json Web/frontend/tsconfig.json ./
RUN npm install

COPY Web/frontend/public ./public
COPY Web/frontend/src ./src
COPY Web/frontend/tsconfig.json ./tsconfig.json

CMD [ "npm", "start" ]