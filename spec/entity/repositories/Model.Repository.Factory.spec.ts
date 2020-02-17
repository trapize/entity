import 'reflect-metadata';
import { ModelRepositoryFactory } from '../../../src/entity/repositories/Model.Repository.Factory';
import { Role } from '../../mocks/models/Auth.Owner';
import { ModelRepository } from '../../../src/entity/repositories/Model.Repository';

describe('Model Repository Factory', () => {
    it('Should create a ModelRepository', () => {
        const factory = new ModelRepositoryFactory(<any>{});
        const repo = factory.Create(Role);
        expect(repo).toBeInstanceOf(ModelRepository);
    });
});