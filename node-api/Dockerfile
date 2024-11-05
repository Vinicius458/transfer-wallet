# Etapa 1: Build (dependências e compilação do TypeScript)
FROM node:20-alpine AS build

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção e desenvolvimento
RUN npm install --legacy-peer-deps

# Copiar todo o código do projeto para dentro do contêiner
COPY . .

# Executar o build do projeto
RUN npm run build

# Etapa 2: Imagem final (somente os arquivos necessários para rodar o app)
FROM node:20-alpine AS production

# Definir o diretório de trabalho na imagem final
WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.8.0

RUN apk update --no-cache \
    && apk add --no-cache wget openssl \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apk del wget

# Copiar apenas as dependências de produção da etapa de build
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copiar os arquivos do build para a imagem final
COPY --from=build /usr/src/app/dist ./dist

RUN npm install

# Expor a porta usada pelo aplicativo
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["dockerize", "-wait", "tcp://mysql:3306", "-wait", "tcp://rabbitmq:5672", "-timeout", "30s","node", "dist/main/server.js"]