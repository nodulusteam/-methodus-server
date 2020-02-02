import { Test } from '../testing';
import { TestMap } from '../test-map';
import { TestController } from './controllers/controller.test';
import { ScreensDataController } from './controllers/screen.data.controller';
import { ScreenModel } from './models/screen.model';





describe('Test Testing module', () => {
    it('Load controller', async () => {

        const m = Test.createTestingModule({
            controllers: [TestController],
            providers: [ScreensDataController]
        } as TestMap);

        const controller: TestController = m.get<TestController>('TestController');

        try {

            const result = await controller.create(new ScreenModel({ name: '' }));
            return result;

        } catch (error) {

            expect(error.message).toBe('Name should not be empty');

        }
        return true;

    });
});


// (async () => {

//     const m = Test.createTestingModule({
//         controllers: [TestController],
//         providers: [ScreensDataController]
//     } as TestMap);
//     const controller = m.get<TestController>('TestController');
//     const result = await controller.create({}, {}, 'TestController');
//     console.log(result);
//     return result;
// })()
