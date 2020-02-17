/* istanbul ignore file */
import { injectable } from 'inversify';
import { IConnection } from '@trapize/connections';

@injectable()
export class MockConnection implements IConnection {
    public framework = jest.fn();
    public query = jest.fn();
    public procedure = jest.fn();
    public cacheQuery = jest.fn();
    public getQuery = jest.fn();
    
    public clear(): void {
        this.framework.mockClear();
        this.query.mockClear();
        this.procedure.mockClear();
        this.cacheQuery.mockClear();
        this.getQuery.mockClear();
    }

    public reset(): void {
        this.framework.mockReset();
        this.query.mockReset();
        this.procedure.mockReset();
        this.cacheQuery.mockReset();
        this.getQuery.mockReset();
    }
}