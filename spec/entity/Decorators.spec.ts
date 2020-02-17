import 'reflect-metadata';
import { Model } from '../../src/entity/Model';
import { DataTypes } from '../../src/entity/Field.Type';
import { IFieldDescribeResult } from '../../src/entity/IField.Describe.Result';
import { JOIN } from '../../src/entity/Join';
import { Eager } from '../../src/entity/Load.Strategy';
import { Entity } from '../../src/entity';

@Entity.Table('auth_owner', 'role', 'rlrl')
class Role extends Model {

    public static get Name(): IFieldDescribeResult {
        return this.Describe.fields['name'];
    }

    @Entity.Id('role_id')
    public id: number;

    @Entity.Column('role_name', DataTypes.VARCHAR)
    public name: string;
}

@Entity.Table('auth_owner', 'site_user_role', 'usrl')
class SiteUserRole extends Model {
    public static get SiteUserId(): IFieldDescribeResult {
        return this.Describe.fields['siteUserId'];
    }
    public static get RoleId(): IFieldDescribeResult {
        return this.Describe.fields['roleId'];
    }
    @Entity.PrimaryKey('site_user_id', DataTypes.NUMBER, 0)
    public siteUserId: number;

    @Entity.PrimaryKey('role_id', DataTypes.NUMBER, 1)
    public roleId: number;
}

@Entity.Table('auth_owner', 'security_profile', 'srpr')
class SecurityProfile extends Model {
    public static get Name(): IFieldDescribeResult {
        return this.Describe.fields['name'];
    }

    @Entity.Id('security_profile_name', false, true)
    public name: string;

    @Entity.Column('security_profile_description', DataTypes.VARCHAR)
    public description: string;
}

@Entity.Table('character_owner', 'character', 'chch')
class Character extends Model {
    public static get SiteUserId(): IFieldDescribeResult {
        return this.Describe.fields['siteUserId'];
    }

    @Entity.Id('character_id')
    public id: number;

    @Entity.Required()
    @Entity.Readonly()
    @Entity.Column('site_user_id', DataTypes.NUMBER)
    public siteUserId: number;
}

@Entity.Table('auth_owner', 'site_user', 'usus')
class SiteUser extends Model {

    public static get Name(): IFieldDescribeResult {
        return this.Describe.fields['name'];
    }
    public static get Identifier(): IFieldDescribeResult {
        return this.Describe.fields['identifier'];
    }
    public static get Calc(): IFieldDescribeResult {
        return this.Describe.fields['calc'];
    }
    public static get SecurityProfileName(): IFieldDescribeResult {
        return this.Describe.fields['securityProfileName'];
    }

    @Entity.Id('site_user_id')
    public id: number;

    @Entity.Required()
    @Entity.Column('site_user_name', DataTypes.VARCHAR)
    public name: string;

    @Entity.Readonly()
    @Entity.Column('site_user_identifier', DataTypes.VARCHAR)
    public identifier: string;

    @Entity.Calculated((dataValues => dataValues.name ? true : false))
    @Entity.Column('site_user_calculated', DataTypes.BOOLEAN)
    public calc: boolean;

    @Entity.Readonly()
    @Entity.Required()
    @Entity.Column('security_profile_name', DataTypes.VARCHAR, 'SiteUser')
    public securityProfileName: string;

    @Entity.Detail(SecurityProfile, JOIN(SiteUser.SecurityProfileName, SecurityProfile.Name))
    public SecurityProfile: SecurityProfile;

    @Entity.Detail(SecurityProfile, [JOIN(SiteUser.SecurityProfileName, SecurityProfile.Name)], Eager, true)
    public SecurityProfile2: SecurityProfile;

    @Entity.Junction(SiteUserRole, Role, JOIN(SiteUser.Describe.Id, SiteUserRole.SiteUserId), JOIN(Role.Describe.Id, SiteUserRole.RoleId))
    public Roles: Role[];

    @Entity.Junction(SiteUserRole, Role, [JOIN(SiteUser.Describe.Id, SiteUserRole.SiteUserId)], [JOIN(Role.Describe.Id, SiteUserRole.RoleId)], Eager)
    public Roles2: Role[];

    @Entity.Details(Character, JOIN(SiteUser.Describe.Id, Character.SiteUserId))
    public Characters: Character[];

    @Entity.Details(Character, [JOIN(SiteUser.Describe.Id, Character.SiteUserId)], Eager)
    public Characters2: Character[];
}

@Entity.Table('test_owner', 'typed_table', 'type')
export class TypeTable extends Model {
    @Entity.String('VARCHAR')
    public VARCHAR: string;

    @Entity.Char('CHAR')
    public CHAR: string;

    @Entity.Number('NUMBER')
    public NUMBER: number;

    @Entity.Boolean('BOOLEAN')
    public BOOLEAN: boolean;

    @Entity.Flag('FLAG')
    public FLAG: boolean;

    @Entity.Date('DATE')
    public DATE: Date;

    @Entity.ForeignKey('foreign_key')
    public foreignKey: number;

    @Entity.ForeignKey('foreign_key_string', DataTypes.VARCHAR)
    public foreignKeyString: number;
}

describe('Decorators', () => {
    it('Should create the objects with metadata', () => {
        const user = SiteUser.Describe;
        const character = Character.Describe;
        const profile = SecurityProfile.Describe;
        const userRole = SiteUserRole.Describe;
        const role = Role.Describe;

        expect(user.schema).toBe('auth_owner');
        expect(profile.schema).toBe('auth_owner');
        expect(userRole.schema).toBe('auth_owner');
        expect(role.schema).toBe('auth_owner');
        expect(character.schema).toBe('character_owner');
        
        expect(user.table).toBe('site_user');
        expect(profile.table).toBe('security_profile');
        expect(userRole.table).toBe('site_user_role');
        expect(role.table).toBe('role');
        expect(character.table).toBe('character');
        
        expect(user.alias).toBe('usus');
        expect(profile.alias).toBe('srpr');
        expect(userRole.alias).toBe('usrl');
        expect(role.alias).toBe('rlrl');
        expect(character.alias).toBe('chch');

        expect(user.getFields()).toHaveLength(5);

        const userObj = new SiteUser({}, {});
        expect(userObj.calc).toBe(false);
        let err: Error | undefined = undefined;
        try {
            userObj.calc = true;
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        err = undefined;

        expect(userObj.securityProfileName).toBeDefined();
        try {
            userObj.securityProfileName = 'newName';
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        err = undefined;

        const userWithoutDefaults = new SiteUser({}, {ignoreDefaults: true});
        expect(userWithoutDefaults.securityProfileName).toBeUndefined();
        userWithoutDefaults.securityProfileName = 'Admin';
        expect(userWithoutDefaults.securityProfileName).toBe('Admin');
        try {
            userWithoutDefaults.securityProfileName = 'newName';
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();

        const userFromDB = new SiteUser({calc: true}, {isNew: false, isFromDatabase: true});
        expect(userFromDB.calc).toBe(true);

    });
})