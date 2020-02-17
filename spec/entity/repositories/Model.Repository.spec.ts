import 'reflect-metadata';
import { ModelRepository } from '../../../src/entity/repositories/Model.Repository';
import { Schema, Operators, FIELD } from '../../../src/entity';
import { Role } from '../../mocks/models/Auth.Owner';
import { of } from 'rxjs';

const schema = {
    Find: jest.fn(),
    FindOne: jest.fn(),
    Save: jest.fn(),
    DeleteWhere: jest.fn()
};

beforeEach(() => {
    schema.Find.mockReset();
    schema.FindOne.mockReset();
    schema.Save.mockReset();
    schema.DeleteWhere.mockReset();
});

describe('Model Repository', () => {
    it('Should pass through Find', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.Find.mockImplementation((type, query) => {
            expect(type).toBe(Role);
            return of([]);
        });

        repo.Find({}).subscribe({
            next: () => {
                expect(schema.Find).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('Should pass through FindOne', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.FindOne.mockImplementation((type, query) => {
            expect(type).toBe(Role);
            return of(Schema.NewInstance(Role, {}, {isFromDatabase:true}));
        });

        repo.FindOne({}).subscribe({
            next: () => {
                expect(schema.FindOne).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('Should pass through to save', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.Save.mockImplementation((obj, query) => {
            expect(obj).toBeInstanceOf(Role);
            return of(Schema.NewInstance(Role, {}, {isFromDatabase:true}));
        });

        repo.Save({}).subscribe({
            next: () => {
                expect(schema.Save).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('Should query by primary key', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.Find.mockImplementation((type, query) => {
            expect(type).toBe(Role);
            expect(query.filters).toHaveLength(1);
            expect(query.filters[0].ToString()).toBe('rlrl.role_id = ?');
            return of([Schema.NewInstance(Role, {}, {isFromDatabase:true})]);
        });

        repo.GetByPrimaryKeys({values: [15]}).subscribe({
            next: () => {
                expect(schema.Find).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('Should throw error with too many values', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.Find.mockImplementation((type, query) => {
            expect(type).toBe(Role);
            expect(query.filters).toHaveLength(1);
            expect(query.filters[0].ToString()).toBe('rlrl.role_id = ?');
            return of([Schema.NewInstance(Role, {}, {isFromDatabase:true})]);
        });

        repo.GetByPrimaryKeys({values: [15, 13]}).subscribe({
            next: () => done('It should have errored'),
            error: () => {
                done();
            }
        });
    });

    it('Should delete by pks', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.DeleteWhere.mockImplementation((type, ...filters: any[]) => {
            expect(type).toBe(Role);
            expect(filters).toHaveLength(1);
            expect(filters[0].ToString()).toBe('rlrl.role_id = ?');
            return of(undefined);
        });

        repo.Delete(15).subscribe({
            next: () => {
                expect(schema.DeleteWhere).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('Should throw error with too many values DELETE', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.DeleteWhere.mockImplementation((type, query) => {
            return of(undefined);
        });

        repo.Delete(15,13).subscribe({
            next: () => done('It should have errored'),
            error: () => {
                done();
            }
        });
    });

    it('Should delete', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.DeleteWhere.mockImplementation((type, ...filters: any[]) => {
            expect(type).toBe(Role);
            expect(filters).toHaveLength(1);
            expect(filters[0].ToString()).toBe('rlrl.role_id = ?');
            return of(undefined);
        });

        repo.DeleteWhere(FIELD(Role.Id, Operators.Eq, 15)).subscribe({
            next: () => {
                expect(schema.DeleteWhere).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('Should error on deleteWhere', (done) => {
        const repo = new ModelRepository(Role, <any>schema);
        schema.DeleteWhere.mockImplementation((type, ...filters: any[]) => {
            return of(undefined);
        });

        repo.DeleteWhere().subscribe({
            next: () => done('It should have errored'),
            error: () => {
                done();
            }
        });
    });
})