FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./


# run npm install in our local machine
RUN npm install

# Bundle app source
COPY . .

# #nginx setup
# FROM nginx
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d

# App is running on port 8080
EXPOSE 8080

# the command that starts our app
CMD [ "node", "app.js" ]