import 'reflect-metadata';
import { InvalidModelException } from '../../../src/entity';

describe('Invalid Model Exception', () => {
    it('Should call ToJSON on the data', () => {
        const jsonable = {
            ToJSON: jest.fn().mockReturnValue({value: 'this'})
        };
        const notJsonable = {
            value: 'this'
        };

        const jsonDataException = new InvalidModelException(jsonable);
        const notJsonDataException = new InvalidModelException(notJsonable);
        const undefinedData = new InvalidModelException();

        expect(jsonDataException.ToJSON().data.value).toBe('this');
        expect(notJsonDataException.ToJSON().data.value).toBe('this');
        expect(undefinedData.ToJSON().data).toBeDefined();
    });
});