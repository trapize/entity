import 'reflect-metadata';
import { Entity } from '../../../src/entity/Decorators';
import { Model } from '../../../src/entity/Model';
import { DataTypes } from '../../../src/entity/Field.Type';
import { DmlBuilder } from '../../../src/entity/query-builder/Dml.Builder';

@Entity.Table('character_owner', 'player_character', 'chch')
class Character extends Model {
    @Entity.Id('player_character_id')
    public id: number;

    @Entity.Column('player_character_name', DataTypes.VARCHAR)
    public name: string;

    @Entity.Column('player_character_description', DataTypes.VARCHAR)
    public description: string;

    @Entity.Calculated(v => v)
    @Entity.Column('player_character_not_insertable', DataTypes.FLAG)
    public notInsertable: boolean;
}

const newCharacter = new Character({
    id: undefined,
    name: 'Thai Amakiir',
    description: 'My DnD Character'
}, {isFromDatabase: false, isNew: true});

const existingCharacter = new Character({
    id: 15,
    name: 'F',
    description: 'Kind of a jerk'
}, {isFromDatabase: true, isNew: false});

existingCharacter.name = 'Fjuazzek';
existingCharacter.description = 'Def a jerk';

describe('Dml Builder', () => {
    it('Should generate an insert statement', () => {
        const retVal = new DmlBuilder().insert(newCharacter);
        expect(retVal).toHaveLength(2);
        expect(retVal[0]).toBe(`INSERT INTO character_owner.player_character SET ?`);
        expect(retVal[1]).toBeDefined();
        expect(retVal[1]).toHaveLength(1);
        expect(retVal[1][0].player_character_name).toBe('Thai Amakiir');
        expect(retVal[1][0].player_character_description).toBe('My DnD Character');
        expect(retVal[1][0].player_character_not_insertable).toBeUndefined();
    });

    it('Should generate an update statement', () => {
        const retVal = new DmlBuilder().update(existingCharacter);
        expect(retVal).toHaveLength(2);
        expect(retVal[0]).toBe(`UPDATE character_owner.player_character SET ? WHERE ?`);
        expect(retVal[1]).toBeDefined();
        expect(retVal[1]).toHaveLength(2);
        expect(retVal[1][0].player_character_name).toBe('Fjuazzek');
        expect(retVal[1][0].player_character_description).toBe('Def a jerk');
        expect(retVal[1][0].player_character_not_insertable).toBeUndefined();
        expect(retVal[1][1].player_character_id).toBe(15);
    });
    
    it('Should generate an delete statement', () => {
        const retVal = new DmlBuilder().delete(existingCharacter);
        expect(retVal).toHaveLength(2);
        expect(retVal[0]).toBe(`DELETE FROM character_owner.player_character WHERE ?`);
        expect(retVal[1]).toBeDefined();
        expect(retVal[1]).toHaveLength(1);
        expect(retVal[1][0].player_character_id).toBe(15);
    });

    it('Should generate Upsert statement', () => {
        const retVal = new DmlBuilder().upsert(existingCharacter);
        expect(retVal).toHaveLength(2);
        expect(retVal[0]).toBe(`INSERT INTO character_owner.player_character SET ? ON DUPLICATE KEY UPDATE ?`);
        expect(retVal[1]).toBeDefined();
        expect(retVal[1]).toHaveLength(2);
        expect(retVal[1][0].player_character_name).toBe('Fjuazzek');
        expect(retVal[1][0].player_character_description).toBe('Def a jerk');
        expect(retVal[1][0].player_character_not_insertable).toBeUndefined();
        expect(retVal[1][1].player_character_name).toBe('Fjuazzek');
        expect(retVal[1][1].player_character_description).toBe('Def a jerk');
    });

    it('Should generate Update statement for New characters too', () => {
        const retVal = new DmlBuilder().upsert(newCharacter);
        expect(retVal).toHaveLength(2);
        expect(retVal[0]).toBe(`INSERT INTO character_owner.player_character SET ? ON DUPLICATE KEY UPDATE ?`);
        expect(retVal[1]).toBeDefined();
        expect(retVal[1]).toHaveLength(2);
        expect(retVal[1][0].player_character_name).toBe('Thai Amakiir');
        expect(retVal[1][0].player_character_description).toBe('My DnD Character');
        expect(retVal[1][0].player_character_not_insertable).toBeUndefined();
        expect(retVal[1][1]).toBeDefined();
        expect(retVal[1][1].player_character_name).toBe('Thai Amakiir');
        expect(retVal[1][1].player_character_description).toBe('My DnD Character');
    });

    it('Should throw errors on mismatches', () => {
        let err: Error | undefined = undefined;
        try {
            new DmlBuilder().insert(existingCharacter);
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        err = undefined;

        try {
            new DmlBuilder().update(newCharacter);
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
        err = undefined;

        try {
            new DmlBuilder().delete(newCharacter);
        } catch(e) {
            err = e;
        }
        expect(err).toBeDefined();
    });
})