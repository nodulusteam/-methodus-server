import 'reflect-metadata';
import { Dictionary, ClassRef } from '../interfaces';

export namespace Decorators {
  /** the MethodConfig decorator registers the controller as a router
   *  @param {string} name - the identifier of the controller in the resolver.
   *  @param {Function[]} middlewares - an array of middlewares to apply to this controller}
   */
  export function PluginConfiguration(name: string, options?: Dictionary) {
    return (target: ClassRef) => {
      const original = target.prototype.constructor;
      original.prototype.options = original.prototype.options ||
        { servers: [], classes: [], clients: [], plugins: [] };
      original.prototype.options.plugins.push({ name, options });
      // // the new constructor behaviour
      // const f: any = () => {
      //     const instance = new original(target.prototype.options);
      //     return instance;
      // };
      // // copy prototype so intanceof operator still works
      // f.prototype = original.prototype;
      // // return new constructor (will override original)
      // return f;
    };
  }
}
