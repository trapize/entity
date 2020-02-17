import 'reflect-metadata';
import { Schema } from '../../../src/entity';
import { Role } from '../../mocks/models/Auth.Owner';
import { Models } from '../../../src/entity/helpers/Models';

describe('Helpers - Models', () => {
    it('Shoulds update values', () => {
        const role = Schema.NewInstance<Role>(Role);
        expect(role.IsModified).toBeFalsy();
        Models.Map(role, {id: 15, name: 'roleName', description: 'description'});
        expect(role.IsModified).toBeTruthy();
        expect(role.id).toBe(15);
        expect(role.name).toBe('roleName');
        expect(role.description).toBe('description');
    });
});