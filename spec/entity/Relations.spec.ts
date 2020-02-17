import 'reflect-metadata';
import { Relationship, DetailRelationship, DetailsRelationship, JunctionRelationship } from '../../src/entity/Relations';
import { SiteUser, SecurityProfile, SiteUserRole, Role } from '../mocks/models/Auth.Owner';
import { Schema } from '../../src/entity/Schema';
import { JOIN } from '../../src/entity/Join';
import { Eager, Lazy } from '../../src/entity/Load.Strategy';

describe('Relations', () => {
    describe('Relation Super', () => {
        it('Should construct and check joins', () => {
            const relation = new Relationship('SecurityProfile', SiteUser, SecurityProfile);
            expect(relation).toBeDefined();
            expect(relation.key).toBe('SecurityProfile');
            expect(relation.master).toBe(SiteUser);
            expect(relation.detail).toBe(SecurityProfile);
            const user = Schema.Create(SiteUser, {
                id: 1,
                securityProfileId: 14,
                username: 'username',
                active: true
            });
            const securityProfile = Schema.Create(SecurityProfile, {
                id: 14,
                name: 'TestProfile',
                description: 'Description'
            });

            const securityProfileNotJoined = Schema.Create(SecurityProfile, {
                id: 19,
                name: 'TestProfile2',
                description: 'Description2'
            });

            expect(relation.checkJoin(user, securityProfile, JOIN(SiteUser.SecurityProfileId, SecurityProfile.Id))).toBeTruthy();
            expect(relation.checkJoin(user, securityProfileNotJoined, JOIN(SiteUser.SecurityProfileId, SecurityProfile.Id))).toBeFalsy();
        });
    });

    describe('Detail', () => {
        it('Should Construct and return joins', () => {
            const relation = new DetailRelationship('SecurityProfile', SiteUser, SecurityProfile, [JOIN(SiteUser.SecurityProfileId, SecurityProfile.Id)], Eager, true);
            expect(relation).toBeDefined();
            expect(relation.key).toBe('SecurityProfile');
            expect(relation.master).toBe(SiteUser);
            expect(relation.detail).toBe(SecurityProfile);
            expect(relation.getJoinArray()).toHaveLength(1);
            expect(relation.getJoinArray()[0]).toBe('usus.security_profile_id = srpr.security_profile_id');
        });
    });

    describe('Details', () => {
        it('Should construct, create Joins, and Check joins', () => {
            const relation = new DetailsRelationship('SecurityProfile', SiteUser, SecurityProfile, [JOIN(SiteUser.SecurityProfileId, SecurityProfile.Id)], Lazy);
            expect(relation).toBeDefined();
            expect(relation.key).toBe('SecurityProfile');
            expect(relation.master).toBe(SiteUser);
            expect(relation.detail).toBe(SecurityProfile);
            const user = Schema.Create(SiteUser, {
                id: 1,
                securityProfileId: 14,
                username: 'username',
                active: true
            });
            const securityProfile = Schema.Create(SecurityProfile, {
                id: 14,
                name: 'TestProfile',
                description: 'Description'
            });

            const securityProfileNotJoined = Schema.Create(SecurityProfile, {
                id: 19,
                name: 'TestProfile2',
                description: 'Description2'
            });

            expect(relation.getJoinArray()).toHaveLength(1);
            expect(relation.getJoinArray()[0]).toBe('usus.security_profile_id = srpr.security_profile_id');

            expect(relation.isDetail(user, securityProfile)).toBeTruthy();
            expect(relation.isDetail(user, securityProfileNotJoined)).toBeFalsy();
        });
    });

    describe('Junctions', () => {
        it('Should construct and cross join', () => {
            const relation = new JunctionRelationship('Roles', SiteUser, SiteUserRole, Role, [JOIN(SiteUser.Id, SiteUserRole.UserId)], [JOIN(Role.Id, SiteUserRole.RoleId)], Lazy);
            const users = [
                Schema.Create<SiteUser>(SiteUser, {
                    id: 1
                }),
                Schema.Create<SiteUser>(SiteUser, {
                    id: 2
                }),
                Schema.Create<SiteUser>(SiteUser, {
                    id: 3
                }),
                Schema.Create<SiteUser>(SiteUser, {
                    id: 4
                }),
                Schema.Create<SiteUser>(SiteUser, {
                    id: 199
                })
            ];

            const roles = [
                Schema.Create<Role>(Role, {
                    id: 1,
                    name: 'BasicUser'
                }),
                Schema.Create<Role>(Role, {
                    id: 2,
                    name: 'Elevated'
                }),
                Schema.Create<Role>(Role, {
                    id: 3,
                    name: 'Admin'
                }),
                Schema.Create<Role>(Role, {
                    id: 199,
                    name: 'NotJoined'
                })
            ];

            const siteUserRoles = [
                Schema.Create<SiteUserRole>(SiteUserRole, {
                    userId: 1,
                    roleId: 1
                }),
                Schema.Create<SiteUserRole>(SiteUserRole, {
                    userId: 2,
                    roleId: 1
                }),
                Schema.Create<SiteUserRole>(SiteUserRole, {
                    userId: 2,
                    roleId: 2
                }),
                Schema.Create<SiteUserRole>(SiteUserRole, {
                    userId: 2,
                    roleId: 3
                }),
                Schema.Create<SiteUserRole>(SiteUserRole, {
                    userId: 4,
                    roleId: 99
                }),
                Schema.Create<SiteUserRole>(SiteUserRole, {
                    userId: 99,
                    roleId: 1
                })
            ];

            relation.CrossJoin(users, siteUserRoles, roles);
            users.forEach(user => {
                if(user.id === 1) {
                    expect(user.Roles).toHaveLength(1);
                    expect(user.Roles[0].id).toBe(1);
                    expect(user.Roles[0].name).toBe('BasicUser');
                } else if(user.id === 2) {
                    expect(user.Roles).toHaveLength(3);
                    expect(user.Roles[0].id).toBe(1);
                    expect(user.Roles[0].name).toBe('BasicUser');
                    expect(user.Roles[1].id).toBe(2);
                    expect(user.Roles[1].name).toBe('Elevated');
                    expect(user.Roles[2].id).toBe(3);
                    expect(user.Roles[2].name).toBe('Admin');
                } else {
                    expect(user.Roles).toHaveLength(0);
                }
            });
        });
    });
});