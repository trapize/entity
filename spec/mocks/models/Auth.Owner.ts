/* istanbul ignore file */
import { Entity } from '../../../src/entity/Decorators';
import { Model } from '../../../src/entity/Model';
import { DataTypes } from '../../../src/entity/Field.Type';
import { JOIN } from '../../../src/entity/Join';
import { IFieldDescribeResult } from '../../../src/entity/IField.Describe.Result';

@Entity.Table('auth_owner', 'role', 'rlrl')
export class Role extends Model {
    @Entity.Id('role_id')
    public id: Number;

    @Entity.Column('role_name', DataTypes.VARCHAR)
    public name: string;

    @Entity.Column('role_description', DataTypes.VARCHAR)
    public description: string;

    @Entity.Column('role_default_flag', DataTypes.FLAG)
    public default: boolean;
}

@Entity.Table('auth_owner', 'site_user_role', 'usrl')
export class SiteUserRole extends Model {
    public static get UserId(): IFieldDescribeResult {
        return this.Describe.fields['userId'];
    }

    public static get RoleId(): IFieldDescribeResult {
        return this.Describe.fields['roleId'];
    }

    @Entity.PrimaryKey('site_user_id', DataTypes.NUMBER)
    public userId: number;

    @Entity.PrimaryKey('role_id', DataTypes.NUMBER)
    public roleId: number;
}

@Entity.Table('auth_owner', 'site_user_profile', 'uspr')
export class SiteUserProfile extends Model {

    @Entity.Id('site_user_id', true)
    public id: number;

    @Entity.Column('site_user_profile_first_name', DataTypes.VARCHAR)
    public firstName: string;
    
    @Entity.Column('site_user_profile_last_name', DataTypes.VARCHAR)
    public lastName: string;

    @Entity.Calculated(val => `${val.firstName} ${val.lastName}`)
    @Entity.Column('site_user_full_name', DataTypes.VARCHAR)
    public fullName: string;
}

@Entity.Table('auth_owner', 'security_profile', 'srpr')
export class SecurityProfile extends Model {
    @Entity.Id('security_profile_id')
    public id: number;

    @Entity.Column('security_profile_name', DataTypes.VARCHAR)
    public name: string;

    @Entity.Column('security_profile_description', DataTypes.VARCHAR)
    public description: string;

    @Entity.Column('security_profile_default_flag', DataTypes.FLAG)
    public default: boolean;
}

@Entity.Table('auth_owner', 'site_user', 'usus')
export class SiteUser extends Model {

    public static get SecurityProfileId(): IFieldDescribeResult {
        return this.Describe.fields['securityProfileId'];
    }
    @Entity.Id('site_user_id')
    public id: number;

    @Entity.Readonly()
    @Entity.Required()
    @Entity.Column('security_profile_id', DataTypes.NUMBER)
    public securityProfileId: number;

    @Entity.Column('site_user_name', DataTypes.VARCHAR)
    public username: string;

    @Entity.Column('site_user_active', DataTypes.FLAG)
    public active: boolean;

    @Entity.Junction(SiteUserRole, Role, JOIN(SiteUser.Describe.Id, SiteUserRole.UserId), JOIN(Role.Describe.Id, SiteUserRole.RoleId))
    public Roles: Role[];

    @Entity.Details(SiteUserProfile, JOIN(SiteUser.Describe.Id, SiteUserProfile.Describe.Id))
    public Profiles: SiteUserProfile[];

    @Entity.Detail(SecurityProfile, JOIN(SiteUser.SecurityProfileId, SecurityProfile.Describe.Id))
    public SecurityProfile: SecurityProfile;
}