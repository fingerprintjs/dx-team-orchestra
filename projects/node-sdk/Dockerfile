FROM node:22

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app
WORKDIR /app

RUN npm install -g pnpm

COPY package.json tsconfig.json ./
COPY ./src ./src

RUN pnpm install

EXPOSE 3002

CMD ["pnpm", "start"]
