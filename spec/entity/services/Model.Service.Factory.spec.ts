import 'reflect-metadata';import 'reflect-metadata';
import { ModelServiceFactory } from '../../../src/entity/services/Model.Service.Factory';
import { Role } from '../../mocks/models/Auth.Owner';
import { ModelService } from '../../../src/entity/services/Model.Service';

describe('Model Repository Factory', () => {
    it('Should create a ModelService', () => {
        const repoFactory = {Create: jest.fn().mockReturnValue({})};
        const factory = new ModelServiceFactory(<any>repoFactory);
        const repo = factory.Create(Role);
        expect(repo).toBeInstanceOf(ModelService);
        expect(repoFactory.Create).toHaveBeenCalledWith(Role);
    });
});