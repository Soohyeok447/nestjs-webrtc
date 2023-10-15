FROM node:16.16.0

RUN mkdir -p /home/haze-api

WORKDIR /home/haze-api

COPY . ./

ENV PORT=3001
ENV NODE_ENV=development
ENV TZ=Asia/Seoul

RUN npm i

EXPOSE 3001

CMD ["node", "dist/src/index.js"]
