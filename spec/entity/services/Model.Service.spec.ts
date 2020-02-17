import 'reflect-metadata';
import { ModelService } from '../../../src/entity/services/Model.Service';
import { of } from 'rxjs';

const repo = {
    Find: jest.fn().mockImplementation(() => {
        return of(undefined);
    }),
    FindOne: jest.fn().mockImplementation(() => {
        return of(undefined);
    }),
    GetByPrimaryKeys: jest.fn().mockImplementation(() => {
        return of(undefined);
    }),
    Save: jest.fn().mockImplementation(() => {
        return of(undefined);
    }),
    Delete: jest.fn().mockImplementation(() => {
        return of(undefined);
    }),
    DeleteWhere: jest.fn().mockImplementation(() => {
        return of(undefined);
    })
};

beforeEach(() => {
    repo.Find.mockClear();
    repo.FindOne.mockClear();
    repo.GetByPrimaryKeys.mockClear();
    repo.Save.mockClear();
    repo.Delete.mockClear();
    repo.DeleteWhere.mockClear();
});

describe('Model Service', () => {
    it('should passthrough to repo: Find', (done) => {
        const service = new ModelService(repo);
        service.Find().subscribe({
            next: () => {
                expect(repo.Find).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('should passthrough to repo: FindOne', (done) => {
        const service = new ModelService(repo);
        service.FindOne({}).subscribe({
            next: () => {
                expect(repo.FindOne).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('should passthrough to repo: GetByPrimaryKeys', (done) => {
        const service = new ModelService(repo);
        service.GetByPrimaryKeys({values:[15]}).subscribe({
            next: () => {
                expect(repo.GetByPrimaryKeys).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('should passthrough to repo: Save', (done) => {
        const service = new ModelService(repo);
        service.Save({}).subscribe({
            next: () => {
                expect(repo.Save).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('should passthrough to repo: Delete', (done) => {
        const service = new ModelService(repo);
        service.Delete(15).subscribe({
            next: () => {
                expect(repo.Delete).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });

    it('should passthrough to repo: DeleteWhere', (done) => {
        const service = new ModelService(repo);
        service.DeleteWhere().subscribe({
            next: () => {
                expect(repo.DeleteWhere).toHaveBeenCalledTimes(1);
                done();
            },
            error: done
        });
    });
});