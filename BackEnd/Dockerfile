FROM node:20-alpine3.16
WORKDIR /app
ADD . .
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install
RUN npm run build
CMD npm run start
