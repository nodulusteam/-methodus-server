import { SecondClass } from '../../classes/SecondClass';
import { ServerType, Server, MethodType, MethodulusConfig } from '../../../index';


let config = new MethodulusConfig();
const redis_addr = '//192.168.99.100:32768';

if(process.env.servers)
{
    process.env.servers.split(',').map(server=>{
            config.run(server, {port:process.env.PORT, client: redis_addr, server:redis_addr, amqp:'localhost'  })  ;         

    })
}

config.use(SecondClass, process.env.METHODTYPE, 'http://localhost:8092');
const server = new Server(process.env.PORT).configure(config).start();

