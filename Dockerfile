FROM node:18
# Create app directory
#RUN mkdir -p /src/app/
WORKDIR /src/app/
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN pwd && ls

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev


# Bundle app source
COPY /src/app/ ./
COPY /src/index.html ./

#COPY /src/favicon/ ./favicon/
#COPY /src/js/ ./
#COPY /src/css ./

EXPOSE 8000

CMD [ "npm", "start" ]

