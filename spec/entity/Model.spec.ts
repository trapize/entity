import 'reflect-metadata';
import { SiteUser, SecurityProfile, Role, SiteUserProfile, SiteUserRole } from '../mocks/models/Auth.Owner';
import { ModelJSON } from '../../src/entity/types';

describe('Model', () => {
    describe('Static', () => {
        it('Should get the ID, Describe, and Metadata Key', () => {
            expect(SiteUser.Id).toBeDefined();
            expect(SiteUser.Describe).toBeDefined();
            expect(SiteUser.MetadataKey).toBeDefined();
        });
    });

    describe('Construct', () => {
        const secProf = new SecurityProfile({
            id: 1,
            name: 'SecurityProfile',
            description: 'SP Description'
        }, {isNew: false, isFromDatabase: false});
        const roles = [
            new Role({id: 1, name: 'Role', description: 'Role Description'}, {isNew: false, isFromDatabase: false})
        ];
        const profiles = [
            new SiteUserProfile({
                id: 1,
                firstName: 'First',
                lastName: 'Last'
            }, {isFromDatabase: false, isNew: false})
        ];

        const user = new SiteUser({
            id: 1,
            username: 'username',
            active: true,
            securityProfileId: 1
        }, {});

        expect(user).toBeDefined();
        expect(user.id).toBe(1);
        expect(user.username).toBe('username');
        user.SecurityProfile = secProf;
        user.Roles = roles;
        user.Set('Profiles', profiles);

        expect(user.SecurityProfile).toBeDefined();
        expect(user.Roles).toHaveLength(1);
        expect(user.Profiles).toHaveLength(1);
        expect(user.securityProfileId).toBe(1);
        expect(user.active).toBe(true);
        expect(user.IsModified).toBe(false);
        expect(user.IsNew).toBe(true);
        expect(user.Type).toBe(SiteUser);
        expect(user.Constructor).toBe(SiteUser);
        expect(user.Function).toBe(SiteUser);
        user.username = 'username2';
        expect(user.IsModified).toBe(true);

        const expectedJson = {
            type: 'SiteUser',
            id: 1,
            attributes: {
                username: 'username2',
                active: true,
                securityProfileId: 1
            },
            includes: {
                SecurityProfile: {
                    type: 'SecurityProfile',
                    id: 1,
                    attributes: {
                        name: 'SecurityProfile',
                        description: 'SP Description'
                    }
                },
                Roles: [
                    {
                        type: 'Role',
                        id: 1,
                        attributes: {
                            name: 'Role',
                            description: 'Role Description'
                        }
                    }
                ],
                Profiles: [
                    {
                        type: 'SiteUserProfile',
                        id: 1,
                        attributes: {
                            firstName: 'First',
                            lastName: 'Last',
                            fullName: 'First Last'
                        }
                    }
                ]
            }
        };

        const actual = user.ToJSON();
        expect(actual.type).toBe(expectedJson.type);
        expect(actual.id).toBe(expectedJson.id);
        expect(actual.attributes).toBeDefined();
        expect(actual.attributes?.username).toBe(expectedJson.attributes.username);
        expect(actual.attributes?.active).toBe(expectedJson.attributes.active);
        expect(actual.attributes?.securityProfileId).toBe(expectedJson.attributes.securityProfileId);
        expect(actual.includes).toBeDefined();
        expect(actual.includes?.SecurityProfile).toBeDefined();
        expect(actual.includes?.Roles).toHaveLength(1);
        expect(actual.includes?.Profiles).toHaveLength(1);
        expect((<ModelJSON>actual.includes?.SecurityProfile).id).toBe(expectedJson.includes.SecurityProfile.id);
        expect((<ModelJSON>actual.includes?.SecurityProfile).type).toBe(expectedJson.includes.SecurityProfile.type);
        expect((<ModelJSON>actual.includes?.SecurityProfile).attributes?.name).toBe(expectedJson.includes.SecurityProfile.attributes.name);
        expect((<ModelJSON>actual.includes?.SecurityProfile).attributes?.description).toBe(expectedJson.includes.SecurityProfile.attributes.description);
        
        expect((<ModelJSON[]>actual.includes?.Roles)[0].id).toBe(expectedJson.includes.Roles[0].id);
        expect((<ModelJSON[]>actual.includes?.Roles)[0].type).toBe(expectedJson.includes.Roles[0].type);
        expect((<ModelJSON[]>actual.includes?.Roles)[0].attributes?.name).toBe(expectedJson.includes.Roles[0].attributes.name);
        expect((<ModelJSON[]>actual.includes?.Roles)[0].attributes?.description).toBe(expectedJson.includes.Roles[0].attributes.description);
        
        expect((<ModelJSON[]>actual.includes?.Profiles)[0].id).toBe(expectedJson.includes.Profiles[0].id);
        expect((<ModelJSON[]>actual.includes?.Profiles)[0].type).toBe(expectedJson.includes.Profiles[0].type);
        expect((<ModelJSON[]>actual.includes?.Profiles)[0].attributes?.firstName).toBe(expectedJson.includes.Profiles[0].attributes.firstName);
        expect((<ModelJSON[]>actual.includes?.Profiles)[0].attributes?.lastName).toBe(expectedJson.includes.Profiles[0].attributes.lastName);
        expect((<ModelJSON[]>actual.includes?.Profiles)[0].attributes?.fullName).toBe(expectedJson.includes.Profiles[0].attributes.fullName);

        const userRole = new SiteUserRole({
            userId: 1,
            roleId: 1
        });

        const expectedRole = {
            type: 'SiteUserRole',
            id: {
                userId: 1,
                roleId: 1
            }
        };

        const actualRole = userRole.ToJSON();
        expect(actualRole.type).toBe(expectedRole.type);
        expect(actualRole.id).toBeDefined();
        expect(actualRole.id.userId).toBe(expectedRole.id.userId);
        expect(actualRole.id.roleId).toBe(expectedRole.id.roleId);

        const empty = new SiteUser();
        expect(empty.IsNew).toBe(true);
    });
})