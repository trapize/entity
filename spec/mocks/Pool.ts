/* istanbul ignore file */
import { injectable } from 'inversify';
import { IPool, IConnection } from '@trapize/connections';

@injectable()
export class MockPool implements IPool {
    public framework = jest.fn();  
    public query = jest.fn();
    public procedure = jest.fn();
    public getConnection = jest.fn();
    public release = jest.fn();
    public cacheQuery = jest.fn();
    public getQuery = jest.fn();

    public SetConnection(connection: IConnection): void {
        this.getConnection.mockImplementation(() => Promise.resolve(connection));
    }
    
    public clear(): void {
        this.framework.mockClear();
        this.query.mockClear();
        this.procedure.mockClear();
        this.getConnection.mockClear();
        this.release.mockClear();
        this.cacheQuery.mockClear();
        this.getQuery.mockClear();
    }

    public reset(): void {
        this.framework.mockReset();
        this.query.mockReset();
        this.procedure.mockReset();
        this.getConnection.mockReset();
        this.release.mockReset();
        this.cacheQuery.mockReset();
        this.getQuery.mockReset();
    }
}