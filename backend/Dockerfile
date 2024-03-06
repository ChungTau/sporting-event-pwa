FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon   # Install nodemon globally
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "dev" ]
