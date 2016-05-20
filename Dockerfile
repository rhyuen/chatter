FROM ubuntu:latest
RUN apt-get update -y && apt-get install -y && apt-get install nodejs && apt-get install npm
COPY . ./app
RUN npm install
EXPOSE 9999
CMD ["node", "server.js"]
