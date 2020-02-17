import 'reflect-metadata';
import { JOIN } from '../../src/entity/Join';
import { SiteUser, SiteUserProfile } from '../mocks/models/Auth.Owner';

describe('Joins', () => {
    it('Should create a join', () => {
        const join = JOIN(SiteUser.Id, SiteUserProfile.Id);
        expect(join).toBeDefined();
        expect(join.left).toBe(SiteUser.Id);
        expect(join.right).toBe(SiteUserProfile.Id);
    });
});