FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN sed '2s#.*#MONGODB_URI=mongodb://mongo#' /usr/src/app/.env -i
EXPOSE 3000
CMD [ "npm", "start" ]