import 'reflect-metadata';
import { Operator, Operators } from '../../../src/entity/query-builder/Query.Operators';

type OperatorTestCase = [typeof Operator, string, boolean, string];

describe('Test Static values on Operators', () => {
    it('Should be the base Operator', () => {
        expect(Operator.ToString()).toBe('');
        expect(Operator.HasRightOperand()).toBe(true);
        expect(Operator.RightOperand()).toBe('?');
    });

    it('Should Return correct operator values for each test case', () => {
        const testCases = <OperatorTestCase[]>[
            [Operators.In, 'IN', true, '(?)'],
            [Operators.Eq, '=', true, '?'],
            [Operators.Ne, '<>', true, '?'],
            [Operators.Lt, '<', true, '?'],
            [Operators.Lte, '<=', true, '?'],
            [Operators.Gt, '>', true, '?'],
            [Operators.Gte, '>=', true, '?'],
            [Operators.IsNull, 'IS NULL', false, ''],
            [Operators.NotNull, 'IS NOT NULL', false, ''],
            [Operators.Like, 'LIKE', true, '?']
        ];
        testCases.forEach((testCase: OperatorTestCase) => {
            expect(testCase[0].ToString()).toBe(testCase[1]);
            expect(testCase[0].HasRightOperand()).toBe(testCase[2]);
            expect(testCase[0].RightOperand()).toBe(testCase[3]);
        });
    });
});