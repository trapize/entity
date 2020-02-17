/* istanbul ignore file */
import { injectable } from 'inversify';
import { IConnectionFactory, IPool } from '@trapize/connections';

@injectable()
export class MockConnectionFactory implements IConnectionFactory {
    public connect = jest.fn();
    public reconnect = jest.fn();

    public SetPool(pool: IPool): void {
        this.connect.mockImplementation(() => Promise.resolve(pool));
    }

    public clear(): void {
        this.connect.mockClear();
        this.reconnect.mockClear();
    }

    public reset(): void {
        this.connect.mockReset();
        this.reconnect.mockReset();
    }
}