import 'reflect-metadata';
import { Model } from '../../src/entity/Model';
import { Entity } from '../../src/entity/Decorators';
import { DataTypes } from '../../src/entity/Field.Type';
import { IFieldDescribeResult } from '../../src/entity/IField.Describe.Result';
import { JOIN } from '../../src/entity/Join';
import { Eager } from '../../src/entity/Load.Strategy';
import { Schema } from '../../src/entity/Schema';
import { MockPool } from '../mocks/Pool';
import { MockConnection } from '../mocks/Connection';
import { MockConnectionFactory } from '../mocks/Connection.Factory';
import { Observable } from 'rxjs';
import { IConnection, IPool } from '@trapize/connections';
import { mergeMap, map } from 'rxjs/operators';
import { FIELD } from '../../src/entity/query-builder/Filters';
import { Operators } from '../../src/entity/query-builder/Query.Operators';

const appConfig = {
    schema: {
        connection: 'schemaConnectionName'
    }
}
class TestSchema extends Schema {

    constructor(connFactory: any = {}) {
        super(<any>appConfig, connFactory);
    }

    public get Pool(): IPool {
        return this.pool
    }
    public get Connection(): IConnection {
        return this.connection
    }
    public getPool(): Observable<IPool> {
        return super.GetPool();
    }
    public getConnection(): Observable<IConnection> {
        return super.GetConnection();
    }
}

@Entity.Table('auth_owner', 'site_user_profile', 'uspr')
class UserProfile extends Model {
    public static get id(): IFieldDescribeResult {
        return this.Describe.fields['id'];
    }
    
    public static get firstName(): IFieldDescribeResult {
        return this.Describe.fields['firstName'];
    }
    
    @Entity.Id('site_user_id', true)
    public id: number;

    @Entity.Column('site_user_profile_first_name', DataTypes.VARCHAR)
    public firstName: string;
}

@Entity.Table('auth_owner', 'security_profile', 'srpr')
class SecurityProfile extends Model {
    @Entity.Id('security_profile_id')
    public id: number;

    @Entity.Column('security_profile_name', DataTypes.VARCHAR)
    public name: string;
}

@Entity.Table('character_owner', 'skill', 'sksk')
class Skill extends Model {
    @Entity.Id('skill_id')
    public id: number;

    @Entity.Column('skill_name', DataTypes.VARCHAR)
    public name: string;
}

@Entity.Table('character_owner', 'player_character_skill', 'chsk')
class CharacterSkill extends Model {
    public static get skillId(): IFieldDescribeResult {
        return this.Describe.fields['skillId'];
    }

    public static get characterId(): IFieldDescribeResult {
        return this.Describe.fields['characterId'];
    }

    @Entity.PrimaryKey('player_character_id', DataTypes.NUMBER, 1)
    public characterId: number;

    @Entity.PrimaryKey('skill_id', DataTypes.NUMBER, 2)
    public skillId: number;

    @Entity.Column('player_character_skill_ranks', DataTypes.NUMBER)
    public ranks: number;

    @Entity.Detail(Skill, JOIN(CharacterSkill.skillId, Skill.Describe.Id), Eager)
    public skill: Skill;
}

@Entity.Table('character_owner', 'attribute', 'attr')
class Attribute extends Model {
    @Entity.Id('attribute_id')
    public id: number;

    @Entity.Column('attribute_name', DataTypes.VARCHAR)
    public name: string;
}

@Entity.Table('character_owner', 'player_character_attribute', 'chat')
class CharacterAttribute extends Model {
    public static get attributeId(): IFieldDescribeResult {
        return this.Describe.fields['attributeId'];
    }

    public static get characterId(): IFieldDescribeResult {
        return this.Describe.fields['characterId'];
    }

    @Entity.PrimaryKey('player_character_id', DataTypes.NUMBER, 1)
    public characterId: number;

    @Entity.PrimaryKey('attribute_id', DataTypes.NUMBER, 2)
    public attributeId: number;

    @Entity.Column('player_character_attribute_ranks', DataTypes.NUMBER)
    public ranks: number;

    @Entity.Detail(Attribute, JOIN(CharacterAttribute.attributeId, Attribute.Describe.Id), Eager)
    public attribute: Attribute;
}

@Entity.Table('character_owner', 'player_character', 'chch')
class Character extends Model {
    public static get userId(): IFieldDescribeResult {
        return this.Describe.fields['userId'];
    }

    public static get Name(): IFieldDescribeResult {
        return this.Describe.fields['name'];
    }

    public static get skills(): string {
        return 'skills';
    }

    public static get attributes(): string {
        return 'attributes';
    }

    @Entity.Id('player_character_id')
    public id: number;

    @Entity.Required()
    @Entity.Readonly()
    @Entity.Column('site_user_id', DataTypes.NUMBER)
    public userId: number;

    @Entity.Column('player_character_name', DataTypes.VARCHAR)
    public name: string;

    @Entity.Details(CharacterSkill, JOIN(Character.Describe.Id, CharacterSkill.characterId))
    public skills: CharacterSkill[];

    @Entity.Details(CharacterAttribute, JOIN(Character.Describe.Id, CharacterAttribute.characterId))
    public attributes: CharacterAttribute[];
}


@Entity.Table('auth_owner', 'role', 'rlrl')
class Role extends Model {
    @Entity.Id('role_id')
    public id: number;

    @Entity.Column('role_name', DataTypes.VARCHAR)
    public name: string;
}


@Entity.Table('auth_owner', 'site_user_role', 'usrl')
class UserRole extends Model {
    public static get userId(): IFieldDescribeResult {
        return this.Describe.fields['userId'];
    }
    public static get roleId(): IFieldDescribeResult {
        return this.Describe.fields['roleId'];
    }

    @Entity.PrimaryKey('site_user_id', DataTypes.NUMBER, 1)
    public userId: number;

    @Entity.PrimaryKey('role_id', DataTypes.NUMBER, 2)
    public roleId: number;
}

@Entity.Table('auth_owner', 'site_user', 'usus')
class User extends Model {

    public static get securityProfileId(): IFieldDescribeResult {
        return this.Describe.fields['securityProfileId'];
    }

    public static get username(): IFieldDescribeResult {
        return this.Describe.fields['username'];
    }

    public static get userProfile(): string {
        return 'userProfile';
    }
    public static get securityProfile(): string {
        return 'securityProfile';
    }
    public static get roles(): string {
        return 'roles';
    }
    public static get characters(): string {
        return 'characters';
    }

    @Entity.Id('site_user_id')
    public id: number;

    @Entity.Column('site_user_name', DataTypes.VARCHAR)
    public username: string;

    @Entity.Readonly()
    @Entity.Required()
    @Entity.Column('security_profile_id', DataTypes.NUMBER)
    public securityProfileId: number;

    @Entity.Detail(UserProfile, JOIN(User.Describe.Id, UserProfile.Describe.Id), Eager)
    public userProfile: UserProfile;

    @Entity.Detail(SecurityProfile, JOIN(User.securityProfileId, SecurityProfile.Describe.Id) )
    public securityProfile: SecurityProfile;

    @Entity.Junction(
        UserRole, 
        Role,
        JOIN(User.Describe.Id, UserRole.userId), 
        JOIN(Role.Describe.Id, UserRole.roleId)
    )
    public roles: Role[];
    
    @Entity.Details(Character, JOIN(User.Describe.Id, Character.userId))
    public characters: Character[];
}

const pool = new MockPool();
const connection = new MockConnection();
const connectionFactory = new MockConnectionFactory();


beforeEach(() => {
    connectionFactory.reset();
    pool.reset();
    connection.reset();
    pool.SetConnection(connection);
    connectionFactory.SetPool(pool);
})

describe('Entity runthrough', () => {
    it('Should create the Delete Where statement properly', (done) => {
        connection.procedure.mockImplementation((query, inputs) => {
            expect(query).toBe('DELETE FROM character_owner.player_character_attribute WHERE player_character_id = ?');
            expect(inputs).toHaveLength(1);
            expect(inputs[0]).toBe(10);
            return Promise.resolve();
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.DeleteWhere(CharacterAttribute, FIELD(CharacterAttribute.characterId, Operators.Eq, 10))
            .subscribe({
                next: () => {
                    expect(connection.procedure).toHaveBeenCalledTimes(1);
                    done();
                },
                error: done
            });
    });

    it('Should create the Delete Where statement properly, multiple', (done) => {
        connection.procedure.mockImplementation((query, inputs) => {
            expect(query).toBe('DELETE FROM character_owner.player_character_attribute WHERE player_character_id = ? AND attribute_id = ?');
            expect(inputs).toHaveLength(2);
            expect(inputs[0]).toBe(10);
            expect(inputs[1]).toBe(1);
            return Promise.resolve();
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.DeleteWhere(CharacterAttribute, FIELD(CharacterAttribute.characterId, Operators.Eq, 10), FIELD(CharacterAttribute.attributeId, Operators.Eq, 1))
            .subscribe({
                next: () => {
                    expect(connection.procedure).toHaveBeenCalledTimes(1);
                    done();
                },
                error: done
            });
    });

    it('Should Query just a user and eager relationships', (done) => {
        connection.query.mockImplementation((query, inputs) => {
            expect(query).toBe(`SELECT usus.site_user_id, usus.site_user_name, usus.security_profile_id, uspr.site_user_profile_first_name FROM auth_owner.site_user usus, auth_owner.site_user_profile uspr WHERE usus.site_user_id = uspr.site_user_id`);
            expect(inputs).toHaveLength(0);
            return Promise.resolve([
                {
                    site_user_id: 15,
                    site_user_name: 'UserName',
                    security_profile_id: 1,
                    site_user_profile_first_name: 'FirstName'
                },
                {
                    site_user_id: 16,
                    site_user_name: 'UserName2',
                    security_profile_id: 1,
                    site_user_profile_first_name: 'FirstName2'
                }
            ])
        });

        const schema = new Schema(<any>appConfig, connectionFactory);

        schema.Find<User>(User).subscribe({
            next: (vals: User[]) => {
                expect(vals).toBeDefined();
                expect(vals[0].userProfile).toBeDefined();
                done();
            },
            error: done
        });
        
    });
    it('Should Query user, eager relationships, and included', (done) => {
        connection.query.mockImplementation((query, inputs) => {
            expect(query).toBe(`SELECT usus.site_user_id, usus.site_user_name, usus.security_profile_id, uspr.site_user_profile_first_name, srpr.security_profile_name FROM auth_owner.site_user usus, auth_owner.site_user_profile uspr, auth_owner.security_profile srpr WHERE usus.site_user_id = uspr.site_user_id AND usus.security_profile_id = srpr.security_profile_id`);
            expect(inputs).toHaveLength(0);
            return Promise.resolve([
                {
                    site_user_id: 15,
                    site_user_name: 'UserName',
                    security_profile_id: 1,
                    site_user_profile_first_name: 'FirstName',
                    security_profile_name: 'User'
                },
                {
                    site_user_id: 16,
                    site_user_name: 'UserName2',
                    security_profile_id: 1,
                    site_user_profile_first_name: 'FirstName2',
                    security_profile_name: 'User'
                }
            ])
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<User>(User, {include: User.securityProfile}).subscribe({
            next: (vals: User[]) => {
                expect(vals).toBeDefined();
                expect(vals[0].userProfile).toBeDefined();
                expect(vals[0].userProfile.firstName).toBe('FirstName');
                expect(vals[0].securityProfile).toBeDefined();
                expect(vals[0].securityProfile.name).toBe('User');
                done();
            },
            error: done
        });
    });
    
    it('Should Query user, eager relationships, and included, with children', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            if(queryCount === 0) {
                queryCount += 1;
                expect(query).toBe(`SELECT usus.site_user_id, usus.site_user_name, usus.security_profile_id, uspr.site_user_profile_first_name, srpr.security_profile_name FROM auth_owner.site_user usus, auth_owner.site_user_profile uspr, auth_owner.security_profile srpr WHERE usus.site_user_id = uspr.site_user_id AND usus.security_profile_id = srpr.security_profile_id`);
                expect(inputs).toHaveLength(0);
                return Promise.resolve([
                    {
                        site_user_id: 15,
                        site_user_name: 'UserName',
                        security_profile_id: 1,
                        site_user_profile_first_name: 'FirstName',
                        security_profile_name: 'User'
                    },
                    {
                        site_user_id: 16,
                        site_user_name: 'UserName2',
                        security_profile_id: 1,
                        site_user_profile_first_name: 'FirstName2',
                        security_profile_name: 'User'
                    }
                ])
            } else {
                expect(query).toBe(`SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch WHERE chch.site_user_id IN (?)`);
                expect(inputs).toHaveLength(1);
                expect(inputs[0]).toHaveLength(2);
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'TestCharacter',
                        security_profile_id: 1
                    },
                    {
                        player_character_id: 2,
                        site_user_id: 15,
                        player_character_name: 'TestCharacter2',
                        security_profile_id: 1
                    },
                    {
                        player_character_id: 3,
                        site_user_id: 15,
                        player_character_name: 'TestCharacter3',
                        security_profile_id: 1
                    }
                ])
            }
            
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<User>(User, {include: [User.securityProfile, User.characters]}).subscribe({
            next: (vals: User[]) => {
                expect(vals).toBeDefined();
                expect(vals[0].userProfile).toBeDefined();
                expect(vals[0].userProfile.firstName).toBe('FirstName');
                expect(vals[0].securityProfile).toBeDefined();
                expect(vals[0].securityProfile.name).toBe('User');
                expect(vals[0].characters).toHaveLength(3);
                expect(vals[1].characters).toHaveLength(0);
                done();
            },
            error: done
        });
    });

    it('Should cover that last stupid bit of code', (done) => {
        let count = 0;
        connection.query.mockImplementation(() => {
            count++;
            if(count === 1) {
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 1,
                        player_character_name: 'name'
                    }
                ]);
            } else {
                return Promise.resolve([{
                    skill_id: 1,
                    skill_name: 'skill',
                    player_character_id: 1,
                    player_character_skill_ranks: 2
                }])
            } 
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<Character>(Character, {include: Character.skills}).subscribe({
            next: characters => {
                expect(characters).toHaveLength(1);
                expect(characters[0].skills).toHaveLength(1);
                done();
            },
            error: done
        });
    });

    it('Should Query user, eager relationships, and included, with children, and junctions', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            if(queryCount === 0) {
                queryCount += 1;
                expect(query).toBe(`SELECT usus.site_user_id, usus.site_user_name, usus.security_profile_id, uspr.site_user_profile_first_name, srpr.security_profile_name FROM auth_owner.site_user usus, auth_owner.site_user_profile uspr, auth_owner.security_profile srpr WHERE usus.site_user_id = uspr.site_user_id AND usus.security_profile_id = srpr.security_profile_id`);
                expect(inputs).toHaveLength(0);
                return Promise.resolve([
                    {
                        site_user_id: 15,
                        site_user_name: 'UserName',
                        security_profile_id: 1,
                        site_user_profile_first_name: 'FirstName',
                        security_profile_name: 'User'
                    },
                    {
                        site_user_id: 16,
                        site_user_name: 'UserName2',
                        security_profile_id: 1,
                        site_user_profile_first_name: 'FirstName2',
                        security_profile_name: 'User'
                    }
                ])
            } else if(queryCount === 1) {
                queryCount += 1;
                expect(query).toBe(`SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch WHERE chch.site_user_id IN (?)`);
                expect(inputs).toHaveLength(1);
                expect(inputs[0]).toHaveLength(2);
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'TestCharacter',
                        security_profile_id: 1
                    },
                    {
                        player_character_id: 2,
                        site_user_id: 15,
                        player_character_name: 'TestCharacter2',
                        security_profile_id: 1
                    },
                    {
                        player_character_id: 3,
                        site_user_id: 15,
                        player_character_name: 'TestCharacter3',
                        security_profile_id: 1
                    }
                ])
            } else if(queryCount === 2) {
                queryCount += 1;
                expect(query).toBe('SELECT usrl.site_user_id, usrl.role_id FROM auth_owner.site_user_role usrl WHERE usrl.site_user_id IN (?)');
                expect(inputs).toHaveLength(1);
                expect(inputs[0]).toHaveLength(2);
                expect(inputs[0][0]).toBe(15);
                expect(inputs[0][1]).toBe(16);
                return Promise.resolve([
                    {
                        site_user_id: 15,
                        role_id: 1
                    },
                    {
                        site_user_id: 15,
                        role_id: 2
                    },
                    {
                        site_user_id: 16,
                        role_id: 1
                    }
                ]);
            } else {
                expect(query).toBe('SELECT rlrl.role_id, rlrl.role_name FROM auth_owner.role rlrl WHERE rlrl.role_id IN (?)');
                expect(inputs).toHaveLength(1);
                expect(inputs[0]).toHaveLength(2);
                expect(inputs[0][0]).toBe(1);
                expect(inputs[0][1]).toBe(2);
                return Promise.resolve([
                    {
                        role_id: 1,
                        role_name: 'Player'
                    },
                    {
                        role_id: 2,
                        role_name: 'Referee'
                    }
                ]);
            }
            
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<User>(User, {include: [User.securityProfile, User.characters, User.roles]}).subscribe({
            next: (vals: User[]) => {
                expect(vals).toBeDefined();
                expect(vals[0].userProfile).toBeDefined();
                expect(vals[0].userProfile.firstName).toBe('FirstName');
                expect(vals[0].securityProfile).toBeDefined();
                expect(vals[0].securityProfile.name).toBe('User');
                expect(vals[0].characters).toHaveLength(3);
                expect(vals[1].characters).toHaveLength(0);
                expect(vals[0].roles).toBeDefined();
                expect(vals[0].roles).toHaveLength(2);
                expect(vals[1].roles).toHaveLength(1);
                done();
            },
            error: done
        });
    });

    it('Should auto chain get eager items', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            queryCount += 1;
            if(queryCount === 1) {
                expect(query).toBe('SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch');
                expect(inputs).toBeDefined();
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'Thia Amakiir'
                    }
                ]);
            } else if(queryCount === 2) {
                expect(query).toBe('SELECT chsk.player_character_id, chsk.skill_id, chsk.player_character_skill_ranks, sksk.skill_name FROM character_owner.player_character_skill chsk, character_owner.skill sksk WHERE chsk.skill_id = sksk.skill_id AND chsk.player_character_id IN (?)');
                return Promise.resolve([]);
            } else {
                expect(query).toBe('SELECT chat.player_character_id, chat.attribute_id, chat.player_character_attribute_ranks, attr.attribute_name FROM character_owner.player_character_attribute chat, character_owner.attribute attr WHERE chat.attribute_id = attr.attribute_id AND chat.player_character_id IN (?)');
                return Promise.resolve([]);
            }
            
        });
        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<Character>(Character, {include: [Character.skills, Character.attributes]}).subscribe({
            next: (vals: Character[]) => {
                done();
            },
            error: done
        });
    });

    it('Should include order by', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            queryCount += 1;
            if(queryCount === 1) {
                expect(query).toBe('SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch ORDER BY chch.site_user_id');
                expect(inputs).toBeDefined();
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'Thia Amakiir'
                    }
                ]);
            } else if(queryCount === 2) {
                expect(query).toBe('SELECT chsk.player_character_id, chsk.skill_id, chsk.player_character_skill_ranks, sksk.skill_name FROM character_owner.player_character_skill chsk, character_owner.skill sksk WHERE chsk.skill_id = sksk.skill_id AND chsk.player_character_id IN (?)');
                return Promise.resolve([]);
            } else {
                expect(query).toBe('SELECT chat.player_character_id, chat.attribute_id, chat.player_character_attribute_ranks, attr.attribute_name FROM character_owner.player_character_attribute chat, character_owner.attribute attr WHERE chat.attribute_id = attr.attribute_id AND chat.player_character_id IN (?)');
                return Promise.resolve([]);
            }
            
        });
        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<Character>(Character, {include: [Character.skills, Character.attributes], orderBy: [[Character, Character.userId]]}).subscribe({
            next: (vals: Character[]) => {
                done();
            },
            error: done
        });
    });

    it('Should include order by multiple, with direction', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            queryCount += 1;
            if(queryCount === 1) {
                expect(query).toBe('SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch ORDER BY chch.site_user_id, chch.player_character_name DESC');
                expect(inputs).toBeDefined();
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'Thia Amakiir'
                    }
                ]);
            } else if(queryCount === 2) {
                expect(query).toBe('SELECT chsk.player_character_id, chsk.skill_id, chsk.player_character_skill_ranks, sksk.skill_name FROM character_owner.player_character_skill chsk, character_owner.skill sksk WHERE chsk.skill_id = sksk.skill_id AND chsk.player_character_id IN (?)');
                return Promise.resolve([]);
            } else {
                expect(query).toBe('SELECT chat.player_character_id, chat.attribute_id, chat.player_character_attribute_ranks, attr.attribute_name FROM character_owner.player_character_attribute chat, character_owner.attribute attr WHERE chat.attribute_id = attr.attribute_id AND chat.player_character_id IN (?)');
                return Promise.resolve([]);
            }
            
        });
        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<Character>(Character, {include: [Character.skills, Character.attributes], orderBy: [[Character, Character.userId], [Character, Character.Name, 'DESC']]}).subscribe({
            next: (vals: Character[]) => {
                done();
            },
            error: done
        });
    });

    it('Should include limit', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            queryCount += 1;
            if(queryCount === 1) {
                expect(query).toBe('SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch LIMIT 1');
                expect(inputs).toBeDefined();
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'Thia Amakiir'
                    }
                ]);
            } else if(queryCount === 2) {
                expect(query).toBe('SELECT chsk.player_character_id, chsk.skill_id, chsk.player_character_skill_ranks, sksk.skill_name FROM character_owner.player_character_skill chsk, character_owner.skill sksk WHERE chsk.skill_id = sksk.skill_id AND chsk.player_character_id IN (?)');
                return Promise.resolve([]);
            } else {
                expect(query).toBe('SELECT chat.player_character_id, chat.attribute_id, chat.player_character_attribute_ranks, attr.attribute_name FROM character_owner.player_character_attribute chat, character_owner.attribute attr WHERE chat.attribute_id = attr.attribute_id AND chat.player_character_id IN (?)');
                return Promise.resolve([]);
            }
            
        });
        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<Character>(Character, {include: [Character.skills, Character.attributes], limit: 1}).subscribe({
            next: (vals: Character[]) => {
                done();
            },
            error: done
        });
    });

    it('Should include limit and offset', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            queryCount += 1;
            if(queryCount === 1) {
                expect(query).toBe('SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch LIMIT 10, 1');
                expect(inputs).toBeDefined();
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'Thia Amakiir'
                    }
                ]);
            } else if(queryCount === 2) {
                expect(query).toBe('SELECT chsk.player_character_id, chsk.skill_id, chsk.player_character_skill_ranks, sksk.skill_name FROM character_owner.player_character_skill chsk, character_owner.skill sksk WHERE chsk.skill_id = sksk.skill_id AND chsk.player_character_id IN (?)');
                return Promise.resolve([]);
            } else {
                expect(query).toBe('SELECT chat.player_character_id, chat.attribute_id, chat.player_character_attribute_ranks, attr.attribute_name FROM character_owner.player_character_attribute chat, character_owner.attribute attr WHERE chat.attribute_id = attr.attribute_id AND chat.player_character_id IN (?)');
                return Promise.resolve([]);
            }
            
        });
        const schema = new Schema(<any>appConfig,  connectionFactory);
        schema.Find<Character>(Character, {include: [Character.skills, Character.attributes], limit: 1, offset: 10}).subscribe({
            next: (vals: Character[]) => {
                done();
            },
            error: done
        });
    });

    it('Should ignore offset', (done) => {
        let queryCount = 0;
        connection.query.mockImplementation((query, inputs) => {
            queryCount += 1;
            if(queryCount === 1) {
                expect(query).toBe('SELECT chch.player_character_id, chch.site_user_id, chch.player_character_name FROM character_owner.player_character chch');
                expect(inputs).toBeDefined();
                return Promise.resolve([
                    {
                        player_character_id: 1,
                        site_user_id: 15,
                        player_character_name: 'Thia Amakiir'
                    }
                ]);
            } else if(queryCount === 2) {
                expect(query).toBe('SELECT chsk.player_character_id, chsk.skill_id, chsk.player_character_skill_ranks, sksk.skill_name FROM character_owner.player_character_skill chsk, character_owner.skill sksk WHERE chsk.skill_id = sksk.skill_id AND chsk.player_character_id IN (?)');
                return Promise.resolve([]);
            } else {
                expect(query).toBe('SELECT chat.player_character_id, chat.attribute_id, chat.player_character_attribute_ranks, attr.attribute_name FROM character_owner.player_character_attribute chat, character_owner.attribute attr WHERE chat.attribute_id = attr.attribute_id AND chat.player_character_id IN (?)');
                return Promise.resolve([]);
            }
            
        });
        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Find<Character>(Character, {include: [Character.skills, Character.attributes], offset: 10}).subscribe({
            next: (vals: Character[]) => {
                done();
            },
            error: done
        });
    });

    it('Should search for one', (done) => {
        connection.query.mockImplementation((q, i) => {
            expect(q).toBe('SELECT usus.site_user_id, usus.site_user_name, usus.security_profile_id, uspr.site_user_profile_first_name FROM auth_owner.site_user usus, auth_owner.site_user_profile uspr WHERE usus.site_user_id = uspr.site_user_id LIMIT 1');
            expect(i).toHaveLength(0);
            return Promise.resolve([{
                site_user_id: 15,
                site_user_name: 'UserName',
                security_profile_id: 1,
                site_user_profile_first_name: 'FirstName'
            }]);
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.FindOne<User>(User).subscribe({
            next: (user) => {
                expect(user.id).toBe(15);
                expect(user.username).toBe('UserName');
                expect(user.securityProfileId).toBe(1);
                expect(user.securityProfile).toBeUndefined();
                expect(user.userProfile).toBeDefined();
                expect(user.userProfile.firstName).toBe('FirstName');
                done();
            },
            error: done
        })
    })

    it('Should ensure getters', () => {
        const schema = new TestSchema();
        let error: Error | undefined = undefined;
        try {
            const conn = schema.Connection;
            expect(conn).toBeUndefined();
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
        error = undefined;

        try {
            const pool = schema.Pool;
            expect(pool).toBeUndefined();
        } catch(e) {
            error = e;
        }
        expect(error).toBeDefined();
    });

    it('should cache pool and connection', (done) => {
        const connection = new MockConnection();
        const pool = new MockPool();
        const connectionFactory = new MockConnectionFactory();
        pool.SetConnection(connection);
        connectionFactory.SetPool(pool);
        const schema = new TestSchema(connectionFactory);

        schema.getPool()
            .pipe(
                mergeMap(pool1 => {
                    return schema.getPool().pipe(
                        mergeMap(pool2 => {
                            expect(pool2).toBe(pool1);
                            return schema.getConnection();
                        }),
                    )
                }),
                mergeMap(conn => {
                    return schema.getConnection().pipe(
                        map(conn2 => {
                            expect(conn2).toBe(conn);
                        })
                    )
                })
            ).subscribe({
                next: () => {
                    done();
                },
                error: done
            });
    });

    it('Should save, auto field', (done) => {
        const user = Schema.Create<User>(User);
        user.username = 'testUserName';
        
        connection.procedure.mockImplementation((q, i) => {
            expect(q).toBeDefined();
            expect(i).toBeDefined();
            return Promise.resolve({
                affectedRows: 1,
                insertId: 23
            });
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Save(user).subscribe({
            next: user2 => {
                expect(user2).toBeDefined();
                expect(user2.id).toBe(23);
                done();
            },
            error: done
        });
    });

    it('should save, no auto field', (done) => {
        const user = Schema.NewInstance<User>(User, {}, {isNew: false});
        user.username = 'testUserName2';
        user.id = 23;
        
        connection.procedure.mockImplementation((q, i) => {
            expect(q).toBeDefined();
            expect(i).toBeDefined();
            return Promise.resolve({
                affectedRows: 2
            });
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Save(user).subscribe({
            next: user2 => {
                expect(user2).toBeDefined();
                expect(user2.id).toBe(23);
                done();
            },
            error: done
        });
    });

    it('Should delete', (done) => {
        const user = Schema.NewInstance<User>(User, {}, {isNew: false});
        user.username = 'testUserName2';
        user.id = 23;

        connection.procedure.mockImplementation((q, i) => {
            expect(q).toBeDefined();
            expect(i).toBeDefined();
            return Promise.resolve({});
        });

        const schema = new Schema(<any>appConfig, connectionFactory);
        schema.Delete(user).subscribe({
            next: () => {
                done();
            },
            error: done
        });
    })
});