import 'reflect-metadata';
import { Entity } from '../../../src/entity/Decorators';
import { Model } from '../../../src/entity/Model';
import { DataTypes } from '../../../src/entity/Field.Type';
import { JOIN } from '../../../src/entity/Join';
import { IFieldDescribeResult } from '../../../src/entity/IField.Describe.Result';
import { QueryBuilder } from '../../../src/entity/query-builder/Query.Builder';
import { MockConnection } from '../../mocks/Connection';
import { DetailRelationship, JunctionRelationship } from '../../../src/entity/Relations';
import { Lazy, Eager } from '../../../src/entity/Load.Strategy';
import { FIELD } from '../../../src/entity/query-builder/Filters';
import { Operators } from '../../../src/entity/query-builder/Query.Operators';

@Entity.Table('auth_owner', 'role', 'rlrl')
class Role extends Model {
    @Entity.Id('rlrl_id')
    public id: number;

    @Entity.Column('rlrl_name', DataTypes.VARCHAR)
    public name: string;
}

@Entity.Table('auth_owner', 'meme_role', 'merl')
class MemberRole extends Model {
    public static get MemberId(): IFieldDescribeResult {
        return this.Describe.fields['memeId'];
    }
    public static get RoleId(): IFieldDescribeResult {
        return this.Describe.fields['rlrlId'];
    }

    @Entity.PrimaryKey('meme_id', DataTypes.NUMBER, 0)
    public memeId: number;

    @Entity.PrimaryKey('rlrl_id', DataTypes.NUMBER, 1)
    public rlrlId: number;
}

@Entity.Table('auth_owner', 'member', 'meme')
class Member extends Model {
    
    public static get SubscriberId(): IFieldDescribeResult {
        return this.Describe.fields['sbsbId'];
    }

    @Entity.Id('meme_id')
    public id: number;

    @Entity.Column('sbsb_id', DataTypes.NUMBER)
    public sbsbId: number;

    @Entity.Column('meme_first_name', DataTypes.VARCHAR)
    public firstName: string;

    @Entity.Column('meme_middle_name', DataTypes.VARCHAR)
    public middleName: string;

    @Entity.Column('meme_last_name', DataTypes.VARCHAR)
    public lastName: string;
}

@Entity.Table('auth_owner', 'subscriber', 'sbsb')
class Subscriber extends Model {

    public static get Identifier(): IFieldDescribeResult {
        return this.Describe.fields['identifier'];
    }
    public static get Username(): IFieldDescribeResult {
        return this.Describe.fields['username'];
    }
    public static get Active(): IFieldDescribeResult {
        return this.Describe.fields['active'];
    }


    @Entity.Id('sbsb_id')
    public id: number;

    @Entity.Column('sbsb_identifier', DataTypes.VARCHAR)
    public identifier: string;

    @Entity.Column('sbsb_username', DataTypes.VARCHAR)
    public username: string;

    @Entity.Column('sbsb_active_flag', DataTypes.FLAG)
    public active: boolean;

    @Entity.Details(Member, JOIN(Subscriber.Describe.Id, Member.SubscriberId))
    public Members: Member[];
}


describe('Query Builder', () => {
    it('Should throw No Fields Selected', () => {
        let err: Error | undefined = undefined;
        try {
            new QueryBuilder(new MockConnection()).GetSelect();
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        err = undefined;
    });

    it('Should throw No Tables Queried', () => {
        let err: Error | undefined = undefined;
        try {
            new QueryBuilder(new MockConnection()).GetFrom();
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        err = undefined;
    });

    it('Should Select all the Objects Fields', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.Select(Subscriber);
        expect(qb.GetSelect()).toBe('SELECT sbsb.sbsb_id, sbsb.sbsb_identifier, sbsb.sbsb_username, sbsb.sbsb_active_flag');
    });

    it('Should Select all fields from all tables with no duplicates', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.Select(Subscriber, Member);
        expect(qb.GetSelect()).toBe('SELECT sbsb.sbsb_id, sbsb.sbsb_identifier, sbsb.sbsb_username, sbsb.sbsb_active_flag, meme.meme_id, meme.meme_first_name, meme.meme_middle_name, meme.meme_last_name');
    });

    it('Should Add the table to the FROM list', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Subscriber);
        expect(qb.GetFrom()).toBe('FROM auth_owner.subscriber sbsb');
    });

    it('Should add all the tables to the from list', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Subscriber, Member);
        expect(qb.GetFrom()).toBe('FROM auth_owner.subscriber sbsb, auth_owner.member meme');
    });

    it('Should Outer Join the tables', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Member)
        .OuterJoin(new DetailRelationship('Subscriber', Member, Subscriber, [JOIN(Member.SubscriberId, Subscriber.Describe.Id)], Lazy, false));
        expect(qb.GetFrom()).toBe('FROM auth_owner.member meme OUTER JOIN auth_owner.subscriber sbsb ON meme.sbsb_id = sbsb.sbsb_id');
    });

    it('Should inner join the tables', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Subscriber)
        .InnerJoin(new DetailRelationship('Member', Subscriber, Member, [JOIN(Subscriber.Describe.Id, Member.SubscriberId)], Eager, true));
        expect(qb.GetFrom()).toBe('FROM auth_owner.subscriber sbsb, auth_owner.member meme');
        expect(qb.GetWhere()).toBe('WHERE sbsb.sbsb_id = meme.sbsb_id');
    });

    it('Should Junction Join the master', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Member).JunctionJoinMaster(new JunctionRelationship('Roles', Member, MemberRole, Role, [JOIN(Member.Describe.Id, MemberRole.MemberId)], [JOIN(Role.Describe.Id, MemberRole.RoleId)], Lazy));
        expect(qb.GetFrom()).toBe('FROM auth_owner.member meme, auth_owner.meme_role merl');
        expect(qb.GetWhere()).toBe('WHERE meme.meme_id = merl.meme_id');
    });

    it('Should junction join the detail', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Member).JunctionJoinDetail(new JunctionRelationship('Roles', Member, MemberRole, Role, [JOIN(Member.Describe.Id, MemberRole.MemberId)], [JOIN(Role.Describe.Id, MemberRole.RoleId)], Lazy));
        expect(qb.GetFrom()).toBe('FROM auth_owner.member meme, auth_owner.meme_role merl, auth_owner.role rlrl');
        expect(qb.GetWhere()).toBe('WHERE rlrl.rlrl_id = merl.rlrl_id');
    });

    it('Should Join Master and Detail to Junction', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.From(Member)
            .JunctionJoinMaster(new JunctionRelationship('Roles', Member, MemberRole, Role, [JOIN(Member.Describe.Id, MemberRole.MemberId)], [JOIN(Role.Describe.Id, MemberRole.RoleId)], Lazy))
            .JunctionJoinDetail(new JunctionRelationship('Roles', Member, MemberRole, Role, [JOIN(Member.Describe.Id, MemberRole.MemberId)], [JOIN(Role.Describe.Id, MemberRole.RoleId)], Lazy));
        expect(qb.GetFrom()).toBe('FROM auth_owner.member meme, auth_owner.meme_role merl, auth_owner.role rlrl');
        expect(qb.GetWhere()).toBe('WHERE meme.meme_id = merl.meme_id AND rlrl.rlrl_id = merl.rlrl_id');
    });

    it('Should add filters', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.Where(
            FIELD(Subscriber.Username, Operators.Like, 'search%'),
            FIELD(Subscriber.Identifier, Operators.Eq, 'identifier')
        );
        expect(qb.GetWhere()).toBe('WHERE sbsb.sbsb_username LIKE ? AND sbsb.sbsb_identifier = ?');
    });

    it('Should add Limit', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.Limit(1);
        expect(qb.GetLimit()).toBe('LIMIT 1');
    });

    it('Should add Offset', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.Limit(1, 10);
        expect(qb.GetLimit()).toBe('LIMIT 10, 1');
    });

    it('Should add Order By', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.OrderBy([Subscriber, Subscriber.Describe.Id], [Subscriber, Subscriber.Username, 'DESC']);
        expect(qb.GetOrderBy()).toBe('ORDER BY sbsb.sbsb_id, sbsb.sbsb_username DESC');
    });

    it('Should Create the full SQL statement', () => {
        const qb = new QueryBuilder(new MockConnection());
        qb.Select(Subscriber, Member)
        .From(Subscriber, Member)
        .Where(
            FIELD(Subscriber.Describe.Id, Operators.Eq, Member.SubscriberId),
            FIELD(Subscriber.Identifier, Operators.Eq, 'identifier')
        );
        expect(qb.ToSql()).toBe('SELECT sbsb.sbsb_id, sbsb.sbsb_identifier, sbsb.sbsb_username, sbsb.sbsb_active_flag, meme.meme_id, meme.meme_first_name, meme.meme_middle_name, meme.meme_last_name FROM auth_owner.subscriber sbsb, auth_owner.member meme WHERE sbsb.sbsb_id = meme.sbsb_id AND sbsb.sbsb_identifier = ?');
    });

    it('Should execute', (done) => {
        const connection = new MockConnection();
        connection.query.mockImplementation((query, inputs) => {
            expect(query).toBe('SELECT sbsb.sbsb_id, sbsb.sbsb_identifier, sbsb.sbsb_username, sbsb.sbsb_active_flag, meme.meme_id, meme.meme_first_name, meme.meme_middle_name, meme.meme_last_name FROM auth_owner.subscriber sbsb, auth_owner.member meme WHERE sbsb.sbsb_id = meme.sbsb_id AND sbsb.sbsb_identifier = ?');
            expect(inputs).toHaveLength(1);
            expect(inputs[0]).toBe('identifier');
            return Promise.resolve([]);
        })
        const qb = new QueryBuilder(connection)
            .Select(Subscriber, Member)
            .From(Subscriber, Member)
            .Where(
                FIELD(Subscriber.Describe.Id, Operators.Eq, Member.SubscriberId),
                FIELD(Subscriber.Identifier, Operators.Eq, 'identifier')
            );
        qb.Execute().subscribe({
            next: res => {
                done();
            },
            error: done
        });

    });
});