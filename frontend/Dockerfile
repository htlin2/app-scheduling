FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 3001
EXPOSE $PORT

CMD ["npm", "start"]