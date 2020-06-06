import { DataController } from './data.controller';
import { MethodConfig, Method, Mapping, MethodResult } from '@methodus/server';
import { ScreenModel } from '../models/screen.model';
import { TestLogger } from './logger.service';
import { Inject } from '@methodus/framework-injection';
/**
 * @hidden
 */
@MethodConfig('ScreensDataController', [], '/screens')
export class ScreensDataController extends DataController {

    @Method('Get', '/special/:id')
    public async special(@Mapping.Param('id') id: string) {
        const result = this.repository.get(id);

        // const item = await this.repository.get(id);
        return new MethodResult(result);
    }
    constructor(@Inject('TestLogger', 'testLogger') private testLogger: TestLogger) {
        super(ScreenModel);
        this.testLogger.log('instance created for ScreensDataController');
        this.repository = ScreenModel;
    }

}