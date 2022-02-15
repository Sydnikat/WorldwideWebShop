FROM node:14.7-alpine

WORKDIR /code
COPY Web/frontend/package*.json Web/frontend/tsconfig.json ./
RUN npm install

COPY Web/frontend .
COPY Web/frontend/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD [ "npm", "run", "build" ]