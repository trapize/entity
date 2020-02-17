import { Join } from './Join';
import { LoadStrategy } from './Load.Strategy';
import { Model } from './Model';
import { IJunctionRelationship, IDetailsRelationship, IDetailRelationship, IRelationship } from './IRelations';

/**
 *
 *
 * @export
 * @class Relationship
 * @implements {IRelationship}
 */
export class Relationship implements IRelationship {
    public key: string
    /**
     *
     *
     * @type {typeof Model}
     * @memberof Relationship
     */
    public master: typeof Model;
    /**
     *
     *
     * @type {typeof Model}
     * @memberof Relationship
     */
    public detail: typeof Model;

    /**
     *Creates an instance of Relationship.
     * @param {string} key
     * @param {typeof Model} master
     * @param {typeof Model} detail
     * @memberof Relationship
     */
    public constructor(key: string, master: typeof Model, detail: typeof Model) {
        this.key = key;
        this.master = master;
        this.detail = detail;
    }

    /**
     *
     *
     * @param {Model} left
     * @param {Model} right
     * @param {Join} join
     * @returns {boolean}
     * @memberof Relationship
     */
    public checkJoin(left: Model, right: Model, join: Join): boolean {
        return left.Get(join.left.field) === right.Get(join.right.field);
    }
}

/**
 *
 *
 * @export
 * @class DetailRelationship
 * @extends {Relationship}
 * @implements {IDetailRelationship}
 */
export class DetailRelationship extends Relationship implements IDetailRelationship {

    /**
     *Creates an instance of DetailRelationship.
     * @param {string} key
     * @param {typeof Model} master
     * @param {typeof Model} detail
     * @param {Join[]} joins
     * @param {typeof LoadStrategy} strategy
     * @param {boolean} inner
     * @memberof DetailRelationship
     */
    public constructor(
        key: string,
        master: typeof Model,
        detail: typeof Model,
        public joins: Join[],
        public strategy: typeof LoadStrategy,
        public inner: boolean
    ) {
        super(key, master, detail);
    }

    /**
     *
     *
     * @returns {string[]}
     * @memberof DetailRelationship
     */
    public getJoinArray(): string[] {
        return this.joins.map(j => `${j.left.alias}.${j.left.column} = ${j.right.alias}.${j.right.column}`);
    }
}

/**
 *
 *
 * @export
 * @class DetailsRelationship
 * @extends {Relationship}
 * @implements {IDetailsRelationship}
 */
export class DetailsRelationship extends Relationship implements IDetailsRelationship {

    /**
     *Creates an instance of DetailsRelationship.
     * @param {string} key
     * @param {typeof Model} master
     * @param {typeof Model} detail
     * @param {Join[]} joins
     * @param {typeof LoadStrategy} strategy
     * @memberof DetailsRelationship
     */
    public constructor(
        key: string,
        master: typeof Model,
        detail: typeof Model,
        public joins: Join[],
        public strategy: typeof LoadStrategy
    ) {
        super(key, master, detail);
    }

    /**
     *
     *
     * @param {Model} master
     * @param {Model} detail
     * @returns {boolean}
     * @memberof DetailsRelationship
     */
    public isDetail(master: Model, detail: Model): boolean {
        return this.joins.reduce((isDetail: boolean, join: Join) => isDetail && this.checkJoin(master, detail, join), true);
    }

    /**
     *
     *
     * @returns {string[]}
     * @memberof DetailsRelationship
     */
    public getJoinArray(): string[] {
        return this.joins.map(j => `${j.left.alias}.${j.left.column} = ${j.right.alias}.${j.right.column}`);
    }
}

/**
 *
 *
 * @export
 * @class JunctionRelationship
 * @extends {Relationship}
 * @implements {IJunctionRelationship}
 */
export class JunctionRelationship extends Relationship implements IJunctionRelationship {
    /**
     *Creates an instance of JunctionRelationship.
     * @param {string} key
     * @param {typeof Model} master
     * @param {typeof Model} junction
     * @param {typeof Model} detail
     * @param {Join[]} masterJoins
     * @param {Join[]} detailJoins
     * @param {typeof LoadStrategy} strategy
     * @memberof JunctionRelationship
     */
    public constructor(
        key: string,
        master: typeof Model,
        public junction: typeof Model,
        detail: typeof Model,
        public masterJoins: Join[],
        public detailJoins: Join[],
        public strategy: typeof LoadStrategy
    ) {
        super(key, master, detail);
    }

    /**
     *
     *
     * @param {Model[]} masters
     * @param {Model[]} junctions
     * @param {Model[]} details
     * @memberof JunctionRelationship
     */
    public CrossJoin(masters: Model[], junctions: Model[], details: Model[]): void {
        const masterJunctions = new Map<Model, Model[]>();
        const detailJunctions = new Map<Model, Model[]>();

        masters.forEach(master => {
            masterJunctions.set(master, junctions.filter(junction => this.masterJoins.reduce((isJunction: boolean, join: Join) => isJunction && this.checkJoin(master, junction, join), true)));
        });

        junctions.forEach(junction => {
            detailJunctions.set(junction, details.filter(detail => this.detailJoins.reduce((isJunction: boolean, join: Join) => isJunction && this.checkJoin(detail, junction, join), true)));
        });

        masterJunctions.forEach((mJuncts: Model[], master: Model) => {
            mJuncts.forEach(junction => {
                master.Set(this.key, (master.Get(this.key) || []).concat(detailJunctions.get(junction) || []));
            });
        });

        masters.forEach(master => master.Set(this.key, master.Get(this.key) || []));
    }
}