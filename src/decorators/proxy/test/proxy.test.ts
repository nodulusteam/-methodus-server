import { Proxy } from '../proxy';
import { Verbs } from '@methodus/platform-express';
import { MethodConfig, Method } from '../../../shim';

(global as any).METHODUS_BRIDGE.classes['ProxiedClass'] = 'local';
@Proxy.ProxyClass('../build/decorators/proxy/test', 'ProxiedClass', './class.test')
@MethodConfig('ProxiedClass')
export class ProxiedClass {
    @Method(Verbs.Get, '/add')
    public static add(a: number, b: number) {
        return a + b;
    }
}
