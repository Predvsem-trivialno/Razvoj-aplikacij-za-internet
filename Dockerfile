FROM node:latest
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN apt-get update && apt-get -y install python3 python3-pip libgl1
RUN pip3 install -r requirements.txt
CMD ["npm", "run", "start"]