# node-log-server

##Install mongodb

-install mongodb: https://www.mongodb.com/download-center/community

##Install elasticsearch

-install elasticsearch: https://www.elastic.co/downloads/elasticsearch


# Install Project

- Firstly, install this project: `https://github.com/TRabia/node-log-server.git`

1. Install packages : `npm install`
2. Change directory : `cd public`
3. Install packages : `npm install`
4. Change directory : `cd..`
5. Change directory : `cd config`
6. Edit port : `config/ app.js`
7. Edit database : `config/ database.js`
8. Change directory : `cd public`
9. Change directory : `cd config`
10. Edit service url : `config/ index.js`

## Port and Database Configuration

- You can change the port that the server will listen to. *app.js*
- You can change your hostname,port password according to the database you are using. *database.js*

##Run elasticsearch

1. change directory cd ../elasticsearch/bin on the command line
2. run elasticsearch elasticsearch.bat on the command line


## Run Project
- *node app.js or npm start* on the command line.

## Create database
1. change directory: cd lib
2. create database: node mongodb.js	(for first usage please create a user (role:admin) on mongodb)





