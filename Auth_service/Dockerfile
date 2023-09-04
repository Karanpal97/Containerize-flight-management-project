FROM node

WORKDIR /developer/nodejs/authservice

ENV NODE_ENV = production

COPY . .

RUN npm ci
# apt-get update && apt-get install -y git // for intaling something
# RUN git cline link the repo link

Run cd src && npx sequelize db:create
Run cd src && npx sequelize db:migrate

ENV PORT 3006

CMD ["npm","run","dev"]