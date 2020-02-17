import 'reflect-metadata';
import { Entity } from '../../src/entity/Decorators';
import { Model } from '../../src/entity/Model';
import { DataTypes } from '../../src/entity/Field.Type';

@Entity.Table('test', 'test', 'test')
class Test extends Model {

    @Entity.Id('test_id')
    public id: number;

    @Entity.Readonly()
    @Entity.Column('test_name', DataTypes.VARCHAR)
    public name: string;
}


@Entity.Table('test', 'test2', 'test2')
class Test2 extends Model {
    @Entity.PrimaryKey('pk1', DataTypes.NUMBER, 0)
    public pk1: number;

    @Entity.PrimaryKey('pk2', DataTypes.NUMBER, 1)
    public pk2: number;
}
describe('Field Describe Result', () => {
    it('Should determine insertable and updatable', () => {
        const newTest = new Test({},{});
        newTest.name = 'name';
        expect(Test.Describe.Id.getIsInsertable(newTest)).toBe(false);
        expect(Test.Describe.fields['name'].getIsInsertable(newTest)).toBe(true);
        expect(Test.Describe.Id.getIsUpdateable(newTest)).toBe(false);
        expect(Test.Describe.fields['name'].getIsUpdateable(newTest)).toBe(true);

        const newTest2 = new Test({id: null},{isNew: true});
        expect(Test.Describe.Id.getIsInsertable(newTest2)).toBe(false);

        const oldTEst = new Test({id: 15, name: 'name'}, {isNew: false, isFromDatabase: true});
        expect(Test.Describe.Id.getIsInsertable(oldTEst)).toBe(false);
        expect(Test.Describe.fields['name'].getIsInsertable(oldTEst)).toBe(false);
        expect(Test.Describe.Id.getIsUpdateable(oldTEst)).toBe(false);
        expect(Test.Describe.fields['name'].getIsUpdateable(oldTEst)).toBe(false);
    });

    it('Should determine order correctly', () => {
        expect(Test2.Describe.fields['pk1'].CompareTo(Test2.Describe.fields['pk1'])).toBe(0);
        expect(Test2.Describe.fields['pk1'].CompareTo(Test2.Describe.fields['pk2'])).toBeLessThan(0);
        expect(Test2.Describe.fields['pk2'].CompareTo(Test2.Describe.fields['pk1'])).toBeGreaterThan(0);
    });
})