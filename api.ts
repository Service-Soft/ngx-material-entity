import { Application, NextFunction, Request, Response, RequestHandler } from 'express';
import * as jsonServer from 'json-server';
import { ApiData, apiData } from './api-data';
import { LodashUtilities } from './projects/ngx-material-entity/src/encapsulation/lodash.utilities';

const data: ApiData = LodashUtilities.cloneDeep(apiData);

const server: Application = jsonServer.create();
const router: jsonServer.JsonServerRouter<ApiData> = jsonServer.router(data);
const reset: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'POST' && req.url.endsWith('/reset/')) {
        router.db.setState(LodashUtilities.cloneDeep(apiData));
        res.sendStatus(201);
    }
    else {
        next();
    }
};
const getFile: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'GET' && req.url.endsWith('/file/')) {
        res.sendFile('./projects/ngx-material-entity/src/mocks/test.jpg', { root: __dirname });
    }
    else {
        next();
    }
};
const middlewares: RequestHandler[] = jsonServer.defaults().concat(reset, getFile);

const port: number = 3000;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`JSON Server is running on port ${port}`);
});