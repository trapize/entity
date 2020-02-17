import 'reflect-metadata';
import { SiteUserRole, SiteUser } from '../mocks/models/Auth.Owner';

describe('Model Describe Result', () => {
    it('Should Throw an error with no Id', () => {
        let error: Error | undefined = undefined;
        try {
            const id = SiteUserRole.Id;
            expect(id).toBeUndefined();
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
    });

    it('Should Determine if the describe result has an Id', () => {
        expect(SiteUserRole.Describe.HasId).toBe(false);
        expect(SiteUser.Describe.HasId).toBe(true);
    });

    it('Should return all relationships', () => {
        expect(SiteUser.Describe.getRelationships()).toHaveLength(3);
    });

    it('Should return just detail relationships', () => {
        expect(SiteUser.Describe.getDetailRelationships()).toHaveLength(1);
    });

    it('Should return just details relationships', () => {
        expect(SiteUser.Describe.getDetailsRelationships()).toHaveLength(1);
    });

    it('Should return just junction relationships', () => {
        expect(SiteUser.Describe.getJunctionRelationships()).toHaveLength(1);
    });

    
    it('Should return the relationships by key', () => {
        expect(SiteUser.Describe.getRelationship('Roles')).toBeDefined();
        expect(SiteUser.Describe.getRelationship('Profiles')).toBeDefined();
        expect(SiteUser.Describe.getRelationship('SecurityProfile')).toBeDefined();

        let error: Error | undefined = undefined;
        try {
            const relationship = SiteUser.Describe.getRelationship('AnythingElse');
            expect(relationship).toBe(undefined);
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
    });

    it('Should find the column name', () => {
        expect(SiteUser.Describe.getColumnName('id')).toBe('site_user_id');
        expect(SiteUser.Describe.getColumnName('site_user_id')).toBe('site_user_id');
        let error: Error | undefined = undefined;
        try {
            SiteUser.Describe.getColumnName('Unknown');
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
    });

    it('Should find the field name', () => {
        expect(SiteUser.Describe.getFieldName('id')).toBe('id');
        expect(SiteUser.Describe.getFieldName('site_user_id')).toBe('id');
        let error: Error | undefined = undefined;
        try {
            SiteUser.Describe.getFieldName('Unknown');
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
    });

    it('Should find the field', () => {
        expect(SiteUser.Describe.getField('id')).toBeDefined();

        let error: Error | undefined = undefined;
        try {
            SiteUser.Describe.getField('Unknown')
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
    });

    it('Should determine if it is a column or field', () => {
        
        expect(SiteUser.Describe.getIsColumnOrField('id')).toBe(true);
        expect(SiteUser.Describe.getIsColumnOrField('site_user_id')).toBe(true);
        expect(SiteUser.Describe.getIsColumnOrField('Unknown')).toBe(false);
    });

    it('Should find the auto increment field', () => {
        expect(SiteUser.Describe.getAutoField()).toBeDefined();
        expect(SiteUserRole.Describe.getAutoField()).toBeUndefined();
    });

    it('Should get and sort the PKs', () => {
        expect(SiteUserRole.Describe.getPrimaryKeys()).toHaveLength(2);
        expect(SiteUserRole.Describe.getPrimaryKeys()[0].field).toBe('userId');
        expect(SiteUserRole.Describe.getPrimaryKeys()[1].field).toBe('roleId');
    });
});