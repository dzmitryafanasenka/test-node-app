# Node.js Blog Service API

This project was created by [Igor Lyatsky](https://github.com/igorlyatskiy) as part of an iTechArt internship.

I'm maintaining this project for use as a server for interns client applications.

## Original Repository

https://github.com/igorlyatskiy/test-node-app

## Documentation

The documentation could be found [here](http://178.124.178.6:3000/api-docs).

## How to run

- Clone the repository
- Run `npm install` command
- Create a `.env` file (use `.env.example` as an example)

### with Docker

- Run `npm run dev`

### without Docker

1. Run the PostgreSQL server. ( You can use `docker-compose start db` command to run PostgreSQL server in the docker container)
2. Run `node index.js` to start the Node.js server

## Release notes

Release notes could be found [here](./.releases).