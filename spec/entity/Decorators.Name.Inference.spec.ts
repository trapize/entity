import 'reflect-metadata';
import { Model, Entity, DataTypes } from '../../src/entity';

@Entity.Table('schema_owner', 'alias')
export class InferredTableOne extends Model {

    @Entity.Id()
    public id: number;

    @Entity.PrimaryKey()
    public primaryKey: number;

    @Entity.PrimaryKey(2)
    public primaryKeyTwo: number;

    @Entity.PrimaryKey('named_pk')
    public primaryKeyThree: number;

    @Entity.PrimaryKey(DataTypes.VARCHAR)
    public primaryKeyFour: string;

    @Entity.PrimaryKey('named_pk_typed', DataTypes.VARCHAR)
    public primaryKeyFive: string;

    @Entity.ForeignKey()
    public foreignKey: number;

    @Entity.ForeignKey(DataTypes.VARCHAR)
    public foreignKeyTwo: string;

    @Entity.ForeignKey('named_fk')
    public foreignKeyThree: number;

    @Entity.ForeignKey('named_fk_typed', DataTypes.VARCHAR)
    public foreignKeyFour: string;

    @Entity.String()
    public stringField: string;

    @Entity.Char()
    public charField: string;

    @Entity.Number()
    public numberField: number;

    @Entity.Boolean()
    public booleanField: boolean;

    @Entity.Flag()
    public flagField: boolean;

    @Entity.Date()
    public dateField: Date;
}

describe('Inferred Values', () => {
    it('Should infer the names', () => {
        const d = InferredTableOne.Describe;
        expect(d.table).toBe('inferred_table_one')
        expect(d.fields['id'].column).toBe('inferred_table_one_id');

        expect(d.fields['primaryKey'].column).toBe('inferred_table_one_primary_key');
        expect(d.fields['primaryKeyTwo'].column).toBe('inferred_table_one_primary_key_two');
        expect(d.fields['primaryKeyThree'].column).toBe('named_pk');
        expect(d.fields['primaryKeyFour'].column).toBe('inferred_table_one_primary_key_four');
        expect(d.fields['primaryKeyFive'].column).toBe('named_pk_typed');

        expect(d.fields['foreignKey'].column).toBe('foreign_key');
        expect(d.fields['foreignKeyTwo'].column).toBe('foreign_key_two');
        expect(d.fields['foreignKeyThree'].column).toBe('named_fk');
        expect(d.fields['foreignKeyFour'].column).toBe('named_fk_typed');

        expect(d.fields['stringField'].column).toBe('inferred_table_one_string_field');
        expect(d.fields['charField'].column).toBe('inferred_table_one_char_field');
        expect(d.fields['numberField'].column).toBe('inferred_table_one_number_field');
        expect(d.fields['booleanField'].column).toBe('inferred_table_one_boolean_field');
        expect(d.fields['flagField'].column).toBe('inferred_table_one_flag_field');
        expect(d.fields['dateField'].column).toBe('inferred_table_one_date_field');
    });
});