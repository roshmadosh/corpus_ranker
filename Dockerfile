FROM python:3.8.15-slim-buster
WORKDIR /app
COPY . /app
RUN apt-get update; apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs
RUN pip install -r requirements.txt
RUN npm install
CMD ["npm", "start"]
