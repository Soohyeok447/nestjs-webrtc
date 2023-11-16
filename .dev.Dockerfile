FROM node:16.16.0

RUN mkdir -p /home/haze-api

WORKDIR /home/haze-api

COPY . /home/haze-api

COPY credentials /root/.aws/credentials


ENV PORT=3000
ENV NODE_ENV=development
ENV TZ=Asia/Seoul

RUN npm i

EXPOSE 3000

CMD ["npm","run","start"]
