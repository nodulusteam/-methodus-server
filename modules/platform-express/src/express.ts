import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { BaseServer, Servers, logger, Singleton } from '@methodus/server';
import { ExpressRouter } from './Router';


export * from './Router';
import * as http from 'http';
import * as colors from 'colors';




import * as fileUpload from 'express-fileupload';
/**
 * @hidden
 */
@Singleton()
export class ExpressPlugin extends BaseServer {
    _app: any;
    constructor(port: any, onStart?: any) {
        super();
        this._app = express();
        this._app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        this._app.use(bodyParser.urlencoded({
            extended: true,
        }));

        this._app.use(bodyParser.json({ limit: '10mb' }));
        this._app.use(cookieParser());

        this._app.set('showStackError', true);
        this._app.set('view engine', 'ejs');
        const viewPath = path.join(__dirname, '..', '..', '..', 'views');
        this._app.set('views', viewPath);
        // Add headers
        this._app.use((req: any, res: any, next: any) => {
            // Website you wish to allow to connect
            if (req.headers.origin) {
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            }

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            let headersX = Object.keys(req.headers).map((headerName: any) => {
                return headerName.split('-').map((word: any) => {
                    return headerName.charAt(0).toUpperCase() + headerName.substr(1);
                }).join('-');
            }).join(',');
            headersX = 'Content-Type,' + headersX;

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', headersX);
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            // Pass to next layer of middleware
            next();
        });

        if (onStart) {
            onStart.forEach((eventStart: any) => {
                eventStart(this._app);
            });
        }
    }

    register(server: any, parentServer: any) {
        if (server.options) {
            const serverType = server.type.name;
            logger.info(colors.green(`> Starting REST server on port ${server.options.port}`));

            parentServer._app[serverType] = new ExpressPlugin(server.options.port, server.options.onStart);
            const app = Servers.set(server.instanceId, server.type.name, parentServer._app[serverType]);
            parentServer.app = app._app;
            const httpServer = Servers.get(server.instanceId, 'http')
                || http.createServer(app._app);
            parentServer._app.http = httpServer;

            Servers.set(server.instanceId, 'http', httpServer);
        } else {
            throw new Error('Missing configuration options for Express');
        }
    }

    close() {
        return true;
        // this._app.close();
    }

    useClass(classType: any, methodType: any) {
        return new ExpressRouter(classType, methodType, this._app);
    }
}