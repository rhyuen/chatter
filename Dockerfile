FROM node:argon
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 9999
CMD ["node", "server.js"]
