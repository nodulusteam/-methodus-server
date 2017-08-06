import { Express, SocketIO, MQ, Redis, RedisServer, Kafka } from './servers';
import { MethodulusConfig, MethodulusConfigFromFile, MethodType, ServerType } from './config';
import { MethodEvent } from './response';
import { fp } from './fp';
import { logger } from './logger';

const debug = require('debug')('methodulus');
import http = require('http');
import colors = require('colors');
// Import events module
var events = require('events');



export interface IApp {
    set(key, value);
}

const figlet = require('figlet');



export class Server {
    public app: any;//IApp;
    private _app: any = {};//IApp;
    private port: number = 0;
    public config: MethodulusConfig;
    private eventEmitter: any;
    constructor(port?: number) {
        this.port = port || 0;
        // Create an eventEmitter object
        this.eventEmitter = new events.EventEmitter();
        //this.start(port);
    }

    async startFromConfig() {
        //MethodulusConfig = MethodulusConfigFromFile()
    }
    configure(config: MethodulusConfig) {
        this.config = config
        return this;
    }
    async printlogo() {
        return new Promise((resolve, reject) => {

            figlet.text('Methodulus', {
                font: 'Bigfig',//Delta Corps Priest 1
                horizontalLayout: 'default',
                verticalLayout: 'default'
            }, function (err, data) {
                if (err) {
                    return;
                }
                console.log(colors.blue(data));
                resolve();
            });


        })
    }
    async start(port?: number) {
        global.methodulus = { server: this };
        this.port = this.port || port || 0;
        debug('activating server on ', port);
        await this.printlogo();

        for (let i = 0; i < this.config.servers.length; i++) {
            let server = this.config.servers[i];
            let serverType = server.type;
            switch (server.type) {
                case ServerType.Express:
                    {
                        console.log(colors.green(JSON.stringify(server.options)))
                        console.log(colors.green(`Starting REST server on port`, server.options.port))
                        this._app[serverType] = new Express(server.options.port);
                        var httpServer = http.createServer(this._app[serverType]._app);//this is the inside express instance
                        this._app['http'] = httpServer;
                        //listen on provided ports
                        httpServer.listen(server.options.port);
                        break;
                    }
                case ServerType.Socket:
                    {
                        console.log(colors.green(`Starting SOCKETIO server on port`, this.port))
                        this._app[serverType] = await new SocketIO(this.port, this._app['http']);
                        break;
                    }
                case ServerType.RabbitMQ:
                    {
                        console.log(colors.green(`Starting MQ server`))
                        try {
                            this._app[serverType] = new MQ(this.port, this._app['http']);
                        } catch (error) {
                            console.log(error);
                        }
                        break;
                    }
                case ServerType.Kafka:
                    {
                        console.log(colors.green(`Starting Kafka server`))
                        try {
                            this._app[serverType] = new Kafka(this.port, this._app['http']);
                        } catch (error) {
                            console.log(error);
                        }
                        break;
                    }
                case ServerType.Redis:
                    {
                        console.log(colors.green(`Starting REDIS server`))
                        try {
                            this._app[serverType] = new Redis(server.options);
                            this._app[serverType].connection = new RedisServer();                         
                        } catch (error) {
                            console.log(error);
                        }
                        break;
                    }
            }
        }

        let classes = this.config.classes.entries()
        for (var i = 0; i < this.config.classes.size; i++) {
            let name, element = classes.next();
            let _class = element.value[1];
            if (_class.methodType === MethodType.Local) {
                this.useClass(_class);
            } else {
                console.log(colors.green(`using class ${_class.classType.name} in ${_class.methodType} mode`));
            }




        }

        return this;
    }

    public useClass(_class) {
        this.config.servers.forEach((server) => {
            console.log(colors.blue(`using class ${_class.classType.name} in ${_class.methodType} mode`));
            this._app[server.type].useClass(_class.classType);
        });

    }

    // public bindEvents(classType) {
    //     let proto = fp.proto(classType);
    //     let methodulus = proto.methodulus;
    //     //let collection = Object.getOwnPropertyNames(proto);

    //     Object.keys(methodulus._events).forEach(itemKey => {
    //         let item = methodulus._events[itemKey];
    //         this.eventEmitter.on(item.name, proto[item.propertyKey]);
    //         //methodulus.name + ':' +
    //     });

    // }
    public kill() {
        ['http', 'socketio'].forEach((server) => {
            if (this._app[server]) {
                this._app[server].close();
                delete this._app[server];
            }
        });
    }

    async sendEvent(methodEvent: MethodEvent) {
        this.config.servers.forEach((server) => {
            this._app[server.type]._sendEvent(methodEvent);
        });

    }
    async _send(channel: ServerType, params, message, parametersMap) {
        return await this._app[channel]._send(params, message, parametersMap);
    }

    async registerEvent(channel, eventName) {
        if (this._app[channel].registerEvent)
            return await this._app[channel].registerEvent(event);
    }
}