import { Model } from './Model';
import { Join } from './Join';
import { LoadStrategy } from './Load.Strategy';

/**
 *
 *
 * @export
 * @interface IRelationship
 */
export interface IRelationship {
    /**
     *
     *
     * @type {string}
     * @memberof IRelationship
     */
    key: string;
    /**
     *
     *
     * @type {typeof Model}
     * @memberof IRelationship
     */
    master: typeof Model;
    /**
     *
     *
     * @type {typeof Model}
     * @memberof IRelationship
     */
    detail: typeof Model;
}

/**
 *
 *
 * @export
 * @interface IDetailRelationship
 * @extends {IRelationship}
 */
export interface IDetailRelationship extends IRelationship {
    /**
     *
     *
     * @type {Join[]}
     * @memberof IDetailRelationship
     */
    joins: Join[];
    /**
     *
     *
     * @type {typeof LoadStrategy}
     * @memberof IDetailRelationship
     */
    strategy: typeof LoadStrategy;
    /**
     *
     *
     * @type {boolean}
     * @memberof IDetailRelationship
     */
    inner: boolean;
    /**
     *
     *
     * @returns {string[]}
     * @memberof IDetailRelationship
     */
    getJoinArray(): string[];
}

/**
 *
 *
 * @export
 * @interface IDetailsRelationship
 * @extends {IRelationship}
 */
export interface IDetailsRelationship extends IRelationship {
    /**
     *
     *
     * @type {Join[]}
     * @memberof IDetailsRelationship
     */
    joins: Join[];
    /**
     *
     *
     * @type {typeof LoadStrategy}
     * @memberof IDetailsRelationship
     */
    strategy: typeof LoadStrategy;
    /**
     *
     *
     * @returns {string[]}
     * @memberof IDetailsRelationship
     */
    getJoinArray(): string[];
    /**
     *
     *
     * @param {Model} master
     * @param {Model} detail
     * @returns {boolean}
     * @memberof IDetailsRelationship
     */
    isDetail(master: Model, detail: Model): boolean;
}

/**
 *
 *
 * @export
 * @interface IJunctionRelationship
 * @extends {IRelationship}
 */
export interface IJunctionRelationship extends IRelationship {
    /**
     *
     *
     * @type {typeof Model}
     * @memberof IJunctionRelationship
     */
    junction: typeof Model;
    /**
     *
     *
     * @type {Join[]}
     * @memberof IJunctionRelationship
     */
    masterJoins: Join[];
    /**
     *
     *
     * @type {Join[]}
     * @memberof IJunctionRelationship
     */
    detailJoins: Join[];
    /**
     *
     *
     * @type {typeof LoadStrategy}
     * @memberof IJunctionRelationship
     */
    strategy: typeof LoadStrategy;

    /**
     *
     *
     * @param {Model[]} masters
     * @param {Model[]} junctions
     * @param {Model[]} details
     * @memberof IJunctionRelationship
     */
    CrossJoin(masters: Model[], junctions: Model[], details: Model[]): void;
}