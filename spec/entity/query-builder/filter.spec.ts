import 'reflect-metadata';
import { Entity } from '../../../src/entity/Decorators';
import { Model } from '../../../src/entity/Model';
import { IFieldDescribeResult } from '../../../src/entity/IField.Describe.Result';
import { Operators, Operator } from '../../../src/entity/query-builder/Query.Operators';
import { IQueryFilterable, FIELD, AND, OR, GetFilterAndInputs } from '../../../src/entity/query-builder/Filters';
@Entity.Table('test_schema', 'test_table', 'tltl')
class TestClass extends Model {
    public static get Id(): IFieldDescribeResult {
        return this.Describe.fields['id'];
    }

    @Entity.Id('test_table_id')
    public id: number;
}

@Entity.Table('test_schema', 'test_table_join', 'tltj')
class TestClassJoin extends Model {
    public static get Id(): IFieldDescribeResult {
        return this.Describe.fields['id'];
    }

    @Entity.Id('test_table_join_id')
    public id: number;
}

describe('Query Filters', () => {
    it('Should not use the alias', () => {
        const filter = AND(
            OR(
                FIELD(TestClass.Id, Operators.Eq, 1),
                FIELD(TestClass.Id, Operators.Eq, 2)
            ),
            OR(
                FIELD(TestClassJoin.Id, Operators.Eq, 1),
                FIELD(TestClassJoin.Id, Operators.Eq, TestClass.Id),
                FIELD(TestClassJoin.Id, Operators.IsNull)
            )
        );

        expect(filter.ToStringNoAlias()).toBe('((test_table_id = ? OR test_table_id = ?) AND (test_table_join_id = ? OR test_table_join_id = test_table_id OR test_table_join_id IS NULL))');
    });

    it('Should be safe with empty ANDs and ORs', () => {
        expect(AND().ToString()).toBe('');
        expect(AND().ToStringNoAlias()).toBe('');
        expect(OR().ToString()).toBe('');
        expect(OR().ToStringNoAlias()).toBe('');
    });

    it('Should create the filter field', () => {
        [
            [TestClass.Id, Operators.Eq, TestClassJoin.Id, 'tltl.test_table_id = tltj.test_table_join_id', []],
            [TestClass.Id, Operators.Eq, 15, 'tltl.test_table_id = ?', [15]],
            [TestClass.Id, Operators.Ne, 15, 'tltl.test_table_id <> ?', [15]],
            [TestClass.Id, Operators.Lt, 15, 'tltl.test_table_id < ?', [15]],
            [TestClass.Id, Operators.Gt, 15, 'tltl.test_table_id > ?', [15]],
            [TestClass.Id, Operators.Lte, 15, 'tltl.test_table_id <= ?', [15]],
            [TestClass.Id, Operators.Gte, 15, 'tltl.test_table_id >= ?', [15]],
            [TestClass.Id, Operators.In, [15], 'tltl.test_table_id IN (?)', [[15]]],
            [TestClass.Id, Operators.IsNull, 15, 'tltl.test_table_id IS NULL', []],
            [TestClass.Id, Operators.NotNull, undefined, 'tltl.test_table_id IS NOT NULL', []]
        ].forEach(testCase => {
            const filter: IQueryFilterable = FIELD(<IFieldDescribeResult>testCase[0], <typeof Operator>testCase[1], testCase[2]);
            const value = filter.ToString();
            const inputs = filter.GetInputs();
            expect(value).toBe(testCase[3]);
            expect(inputs).toHaveLength((<Array<any>>testCase[4]).length);
            if(Array.isArray(testCase[2])) {
                expect(inputs[0]).toHaveLength(1);
                expect(inputs[0][0]).toBe((<Array<any>>testCase[4])[0][0]);
            } else if((<typeof Operator>testCase[1]).HasRightOperand()){
                inputs.forEach((input: any, index: number) => {
                    expect(input).toBe((<Array<any>>testCase[4])?.[index]);
                });
            } else {
                expect(inputs).toHaveLength(0);
            }
        });
    });

    it('Should combine with AND', () => {
        const and = AND(
            FIELD(TestClass.Id, Operators.Eq, 15),
            FIELD(TestClassJoin.Id, Operators.Eq, 12)
        );
        const value = and.ToString();
        const inputs = and.GetInputs();
        expect(value).toBe('(tltl.test_table_id = ? AND tltj.test_table_join_id = ?)');
        expect(inputs).toHaveLength(2);
        expect(inputs[0]).toBe(15);
        expect(inputs[1]).toBe(12);
    });

    it('Should combine with OR', () => {
        const and = OR(
            FIELD(TestClass.Id, Operators.Eq, 15),
            FIELD(TestClassJoin.Id, Operators.Eq, 12)
        );
        const value = and.ToString();
        const inputs = and.GetInputs();
        expect(value).toBe('(tltl.test_table_id = ? OR tltj.test_table_join_id = ?)');
        expect(inputs).toHaveLength(2);
        expect(inputs[0]).toBe(15);
        expect(inputs[1]).toBe(12);
    });

    it('Should Nest an OR', () => {
        const and = AND(
            FIELD(TestClass.Id, Operators.Eq, 15),
            FIELD(TestClassJoin.Id, Operators.Eq, 12),
            OR(
                FIELD(TestClass.Id, Operators.Eq, 32),
                FIELD(TestClassJoin.Id, Operators.Eq, 57),
            )
        );
        const value = and.ToString();
        const inputs = and.GetInputs();
        expect(value).toBe('(tltl.test_table_id = ? AND tltj.test_table_join_id = ? AND (tltl.test_table_id = ? OR tltj.test_table_join_id = ?))');
        expect(inputs).toHaveLength(4);
        expect(inputs[0]).toBe(15);
        expect(inputs[1]).toBe(12);
        expect(inputs[2]).toBe(32);
        expect(inputs[3]).toBe(57);
    });

    it('Should Combine with ANDs without surrounding ()', () => {
        const where = GetFilterAndInputs([
            FIELD(TestClass.Id, Operators.Eq, 15),
            FIELD(TestClassJoin.Id, Operators.Eq, 12),
            OR(
                FIELD(TestClass.Id, Operators.Eq, 32),
                FIELD(TestClassJoin.Id, Operators.Eq, 57),
            )
        ]);
        const value = where[0];
        const inputs = where[1];
        expect(value).toBe('tltl.test_table_id = ? AND tltj.test_table_join_id = ? AND (tltl.test_table_id = ? OR tltj.test_table_join_id = ?)');
        expect(inputs).toHaveLength(4);
        expect(inputs[0]).toBe(15);
        expect(inputs[1]).toBe(12);
        expect(inputs[2]).toBe(32);
        expect(inputs[3]).toBe(57);
    });
})