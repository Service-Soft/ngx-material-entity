import { data } from './api-data';
import * as jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();
const port = 3000;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});