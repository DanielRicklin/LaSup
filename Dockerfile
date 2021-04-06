FROM node

ENV MONGO_DB_USERNAME=root \
    MONGO_DB_PWD=example

RUN mkdir -p /home/LaSup

COPY ./app /home/LaSup

EXPOSE 3000

# RUN npm install

CMD ["node", "/home/LaSup/bin/www"]