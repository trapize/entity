import 'reflect-metadata';
import { FieldDescribeResult } from '../../src/entity/Field.Describe.Result';
import { DataTypes } from '../../src/entity/Field.Type';
import { isIFieldDescribeResult } from '../../src/entity/IField.Describe.Result';

describe('IFieldDescribeResult', () => {
    it('Should Identify IFieldDescribeResult', () => {
        const result = new FieldDescribeResult('field', 'column', DataTypes.VARCHAR);
        expect(isIFieldDescribeResult(result)).toBeTruthy();
        expect(isIFieldDescribeResult('Value')).toBeFalsy();
    })
})