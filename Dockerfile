FROM node:fermium-alpine
RUN npm config set unsafe-perm true
RUN npm install pm2 -g
RUN apk add bash
WORKDIR /opt/maxy-media
COPY package.json ./
RUN npm install
RUN npm uninstall handlebars
RUN npm install handlebars@4.1.2
COPY config/config.js ./config/config.js
COPY gulpfile.js ./
COPY ./public ./public
COPY .env ./
RUN npm run minifyjs
COPY . .
CMD ["./wait-for-it.sh", "mongodb:27017", "-t", "120", "--", "sh", "start.sh"]
