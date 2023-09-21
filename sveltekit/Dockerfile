# Use Node.js 14 Alpine
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npm run build

EXPOSE 5173
CMD ["node", "build"]