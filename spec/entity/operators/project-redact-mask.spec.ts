import 'reflect-metadata';
import { Entity } from '../../../src/entity/Decorators';
import { Model } from '../../../src/entity/Model';
import { DataTypes } from '../../../src/entity/Field.Type';
import { JOIN } from '../../../src/entity/Join';
import { of } from 'rxjs';
import { project, redact, mask } from '../../../src/entity/operators';


@Entity.Table('test_owner', 'test_sub_table', 'tlst')
class TestSubTable extends Model {
    @Entity.Id('test_sub_table_id')
    public id: number;
}

@Entity.Table('test_owner', 'test_junct_table', 'tljx')
class TestJunctTable extends Model {
    @Entity.PrimaryKey('test_sub_table_id', DataTypes.NUMBER)
    public testSubTableId: number;

    @Entity.PrimaryKey('test_table_id', DataTypes.NUMBER)
    public testTableId: number;
}

@Entity.Table('test_owner', 'test_table', 'tltl')
class TestTable extends Model {

    @Entity.Id('test_table_id')
    public id: number;

    @Entity.Column('test_table_name', DataTypes.VARCHAR)
    public tableName: string;

    @Entity.Column('test_table_description', DataTypes.VARCHAR)
    public description: string;

    @Entity.Detail(TestSubTable, JOIN(TestTable.Describe.fields['id'], TestSubTable.Describe.fields['id']))
    public TestSubTable: TestSubTable;

    @Entity.Details(TestSubTable, JOIN(TestTable.Describe.fields['id'], TestSubTable.Describe.fields['id']))
    public TestSubTables: TestSubTable[];

    @Entity.Junction(TestJunctTable, TestSubTable, 
        JOIN(TestTable.Describe.fields['id'], TestJunctTable.Describe.fields['testTableId']),
        JOIN(TestSubTable.Describe.fields['id'], TestJunctTable.Describe.fields['testSubTableId'])
    )
    public JoinedSubTables: TestSubTable[];

}

const TestModel = new TestTable({
    id: 15,
    tableName: 'name',
    description: 'description'
}, {isNew: false, isFromDatabase: true});

TestModel.TestSubTable = new TestSubTable({
    id: 20
}, {isNew: false, isFromDatabase: true});

TestModel.TestSubTables = [new TestSubTable({id: 25}, {isNew: false, isFromDatabase: true})];
TestModel.JoinedSubTables = [new TestSubTable({id: 15}, {isNew: false, isFromDatabase: true})];

const emptyModel = new TestTable({}, {});

describe('Entity Operators', () => {
    describe('Project', () => {
        it('Should project only [Id]', (done) => {
            of(TestModel)
                .pipe(
                    project('')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.attributes).toBeUndefined();
                    expect(model.includes).toBeUndefined();
                    expect(model.type).toBe('TestTable');
                    done();
                });
        });

        it('Should project only [Id]', (done) => {
            of([TestModel])
                .pipe(
                    project('')
                ).subscribe(model => {
                    expect(model[0].id).toBe(15);
                    expect(model[0].attributes).toBeUndefined();
                    expect(model[0].includes).toBeUndefined();
                    expect(model[0].type).toBe('TestTable');
                    done();
                });
        });
        it('Should project only [Id, TableName]', (done) => {
            of(TestModel)
                .pipe(
                    project('tableName')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('name');
                    expect(model.attributes?.description).toBeUndefined();
                    expect(model.includes).toBeUndefined();
                    expect(model.type).toBe('TestTable');
                    done();
                });
        });
    
        it('Should project only [Id, TableName, TestSubTable]', (done) => {
            of(TestModel)
                .pipe(
                    project('tableName', 'TestSubTable')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('name');
                    expect(model.attributes?.description).toBeUndefined();
                    expect(model.includes).toBeDefined();
                    expect(model.includes?.TestSubTable).toBeDefined();
                    expect(model.includes?.TestSubTables).toBeUndefined();
                    expect(model.includes?.JoinedSubTables).toBeUndefined();
                    expect(model.type).toBe('TestTable');
                    done();
                });
        });
    });
    
    describe('Redact', () => {
        it('Should Redact only [tableName]', (done) => {
            of(TestModel)
                .pipe(
                    redact('tableName')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBeUndefined();
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeDefined();
                    expect(model.includes?.TestSubTable).toBeDefined();
                    expect(model.includes?.TestSubTables).toHaveLength(1);
                    expect(model.includes?.JoinedSubTables).toHaveLength(1);
                    done();
                });
        });

        it('Should Redact only [tableName]', (done) => {
            of([TestModel])
                .pipe(
                    redact('tableName')
                ).subscribe(model => {
                    expect(model[0].id).toBe(15);
                    expect(model[0].type).toBe('TestTable');
                    expect(model[0].attributes).toBeDefined();
                    expect(model[0].attributes?.tableName).toBeUndefined();
                    expect(model[0].attributes?.description).toBeDefined();
                    expect(model[0].includes).toBeDefined();
                    expect(model[0].includes?.TestSubTable).toBeDefined();
                    expect(model[0].includes?.TestSubTables).toHaveLength(1);
                    expect(model[0].includes?.JoinedSubTables).toHaveLength(1);
                    done();
                });
        });

        it('Should Redact [tableName, JoinedSubTables]', (done) => {
            of(TestModel)
                .pipe(
                    redact('tableName', 'JoinedSubTables')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBeUndefined();
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeDefined();
                    expect(model.includes?.TestSubTable).toBeDefined();
                    expect(model.includes?.TestSubTables).toHaveLength(1);
                    expect(model.includes?.JoinedSubTables).toBeUndefined();
                    done();
                });
        });

        it('Should Redact [tableName, description, JoinedSubTables, TestSubTable, TestSubTables]', (done) => {
            of(TestModel)
                .pipe(
                    redact('tableName', 'description', 'JoinedSubTables', 'TestSubTable', 'TestSubTables')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeUndefined();
                    expect(model.includes).toBeUndefined();
                    done();
                });
        });
    });

    describe('Mask', () => {
        it('Should Mask only [tableName]', (done) => {
            of(TestModel)
                .pipe(
                    mask('*****', 'tableName')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('*****');
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeDefined();
                    expect(model.includes?.TestSubTable).toBeDefined();
                    expect(model.includes?.TestSubTables).toHaveLength(1);
                    expect(model.includes?.JoinedSubTables).toHaveLength(1);
                    done();
                });
        });

        it('Should Mask only [tableName]', (done) => {
            of([TestModel])
                .pipe(
                    mask('*****', 'tableName')
                ).subscribe(model => {
                    expect(model[0].id).toBe(15);
                    expect(model[0].type).toBe('TestTable');
                    expect(model[0].attributes).toBeDefined();
                    expect(model[0].attributes?.tableName).toBe('*****');
                    expect(model[0].attributes?.description).toBeDefined();
                    expect(model[0].includes).toBeDefined();
                    expect(model[0].includes?.TestSubTable).toBeDefined();
                    expect(model[0].includes?.TestSubTables).toHaveLength(1);
                    expect(model[0].includes?.JoinedSubTables).toHaveLength(1);
                    done();
                });
        });

        it('Should Mask [tableName, JoinedSubTables]', (done) => {
            of(TestModel)
                .pipe(
                    mask('*****', 'tableName', 'JoinedSubTables')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('*****');
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeDefined();
                    expect(model.includes?.TestSubTable).toBeDefined();
                    expect(model.includes?.TestSubTables).toHaveLength(1);
                    expect(model.includes?.JoinedSubTables).toBeUndefined();
                    done();
                });
        });

        it('Should Mask [tableName, JoinedSubTables, TestSubTable, TestSubTables]', (done) => {
            of(TestModel)
                .pipe(
                    mask('*****', 'tableName', 'JoinedSubTables', 'JoinedSubTables', 'TestSubTable', 'TestSubTables')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('*****');
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeUndefined();
                    done();
                });
        });

        it('Should Mask [tableName, description, JoinedSubTables, TestSubTable, TestSubTables]', (done) => {
            of(TestModel)
                .pipe(
                    mask('*****', 'tableName', 'JoinedSubTables', 'description', 'JoinedSubTables', 'TestSubTable', 'TestSubTables')
                ).subscribe(model => {
                    expect(model.id).toBe(15);
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('*****');
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeUndefined();
                    done();
                });
        });

        it('Should Mask [tableName, description, JoinedSubTables, TestSubTable, TestSubTables]', (done) => {
            of(emptyModel)
                .pipe(
                    mask('*****', 'tableName', 'JoinedSubTables', 'description', 'JoinedSubTables', 'TestSubTable', 'TestSubTables')
                ).subscribe(model => {
                    expect(model.id).toBeUndefined();
                    expect(model.type).toBe('TestTable');
                    expect(model.attributes).toBeDefined();
                    expect(model.attributes?.tableName).toBe('*****');
                    expect(model.attributes?.description).toBeDefined();
                    expect(model.includes).toBeUndefined();
                    done();
                });
        });
    });
});