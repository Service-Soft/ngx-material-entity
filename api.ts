import { apiData } from './api-data';
import * as jsonServer from 'json-server';
import { Request, Response, NextFunction } from 'express';
import { LodashUtilities } from './projects/ngx-material-entity/src/capsulation/lodash.utilities';

const data = LodashUtilities.cloneDeep(apiData);

const server = jsonServer.create();
const router = jsonServer.router(data);
const reset = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'POST' && req.url.endsWith('/reset/')) {
        router.db.setState(LodashUtilities.cloneDeep(apiData));
        res.sendStatus(201);
    }
    else {
        next();
    }
};
const getFile = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET' && req.url.endsWith('/file/')) {
        res.sendFile('./projects/ngx-material-entity/src/mocks/test.jpg', {root: __dirname});
    }
    else {
        next();
    }
};
const middlewares = jsonServer.defaults().concat(reset, getFile);

const port = 3000;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`JSON Server is running on port ${port}`);
});