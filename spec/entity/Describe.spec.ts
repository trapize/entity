import 'reflect-metadata';
import { Entity } from '../../src/entity/Decorators';
import { Model } from '../../src/entity/Model';
import { Describe } from '../../src/entity/Describe';

@Entity.Table('test_owner', 'site', 'stst')
class Site extends Model {
    @Entity.Id('site_id')
    public id: number;
}

class Another {

}

function expectError(factory: () => void): void {
    let err: Error | undefined = undefined;
    try {
        factory();
    } catch(e) {
        err = e;
    }
    expect(err).toBeDefined();
}

describe('Describe', () => {
    it('Should return the describe and correct assertions', () => {
        const describe = Describe.GetDescribe(Site);
        expect(describe).toBeDefined();
        Describe.AssertExtension(Site.prototype);
        expect(Describe.AssertPropertyKey('id')).toBe(true);
    });

    it('Should throw errors', () => {
        expectError(() => {
            Describe.GetDescribe(Another);
        });

        expectError(() => {
            Describe.AssertExtension(Another.prototype, 'TestMessage');
        });

        expectError(() => {
            Describe.AssertPropertyKey(Symbol('Symbol'), 'TestMessage');
        });
    });
})