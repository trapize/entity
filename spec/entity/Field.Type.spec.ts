import 'reflect-metadata';
import { DataTypes } from '../../src/entity/Field.Type';

describe('FieldType', () => {
    describe('BOOLEAN', () => {
        it('Should be convert Properly', () => {
            expect(DataTypes.BOOLEAN.ToDatabase(true)).toBe(1);
            expect(DataTypes.BOOLEAN.ToDatabase(false)).toBe(0);
            expect(DataTypes.BOOLEAN.ToDatabase('anything else')).toBe(0);
            expect(DataTypes.BOOLEAN.ToDatabase(1)).toBe(1);
            expect(DataTypes.BOOLEAN.ToDatabase(0)).toBe(0);

            expect(DataTypes.BOOLEAN.FromDatabase(1)).toBe(true);
            expect(DataTypes.BOOLEAN.FromDatabase(10)).toBe(true);
            expect(DataTypes.BOOLEAN.FromDatabase(0)).toBe(false);
            expect(DataTypes.BOOLEAN.FromDatabase('not number')).toBe(false);
            expect(DataTypes.BOOLEAN.FromDatabase(parseInt('not number'))).toBe(false);
        });
    });

    describe('FLAG', () => {
        it('Should Convert properly', () => {
            expect(DataTypes.FLAG.ToDatabase('Y')).toBe('Y');
            expect(DataTypes.FLAG.ToDatabase('y')).toBe('Y');
            expect(DataTypes.FLAG.ToDatabase(true)).toBe('Y');
            expect(DataTypes.FLAG.ToDatabase('anything else')).toBe('N');
            expect(DataTypes.FLAG.ToDatabase('N')).toBe('N');
            expect(DataTypes.FLAG.ToDatabase('n')).toBe('N');
            expect(DataTypes.FLAG.ToDatabase(false)).toBe('N');

            expect(DataTypes.FLAG.FromDatabase('Y')).toBe(true);
            expect(DataTypes.FLAG.FromDatabase('y')).toBe(true);
            expect(DataTypes.FLAG.FromDatabase(true)).toBe(true);

            expect(DataTypes.FLAG.FromDatabase('anything else')).toBe(false);
            expect(DataTypes.FLAG.FromDatabase('N')).toBe(false);
            expect(DataTypes.FLAG.FromDatabase('n')).toBe(false);
            expect(DataTypes.FLAG.FromDatabase(false)).toBe(false);
        })
    })
})