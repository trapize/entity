/**
 *
 *
 * @class DataType
 */
class DataType {

    /**
     *
     *
     * @static
     * @param {*} val
     * @returns {*}
     * @memberof DataType
     */
    public static ToDatabase(val: any): any {
        return val;
    }

    /**
     *
     *
     * @static
     * @param {*} val
     * @returns {*}
     * @memberof DataType
     */
    public static FromDatabase(val: any): any {
        return val;
    }
}

/**
 *
 *
 * @class VARCHAR
 * @extends {DataType}
 */
class VARCHAR extends DataType {

}

/**
 *
 *
 * @class CHAR
 * @extends {DataType}
 */
class CHAR extends DataType {

}

/**
 *
 *
 * @class NUMBER
 * @extends {DataType}
 */
class NUMBER extends DataType {

}

/**
 *
 *
 * @class BOOLEAN
 * @extends {DataType}
 */
class BOOLEAN extends DataType {
    
    /**
     *
     *
     * @static
     * @param {*} val
     * @returns {number}
     * @memberof BOOLEAN
     */
    public static ToDatabase(val: any): number {
        if(val === true || val === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     *
     *
     * @static
     * @param {*} val
     * @returns {boolean}
     * @memberof BOOLEAN
     */
    public static FromDatabase(val: any): boolean {
        if(typeof val === 'number') {
            if(isNaN(val)) {
                return false;
            } else if(val > 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
}

/**
 *
 *
 * @class FLAG
 * @extends {DataType}
 */
class FLAG extends DataType {
    /**
     *
     *
     * @static
     * @param {*} val
     * @returns {('Y' | 'N')}
     * @memberof FLAG
     */
    public static ToDatabase(val: any): 'Y' | 'N' {
        if(val === true || val === 'Y' || val === 'y') {
            return 'Y';
        } else {
            return 'N';
        }
    }

    /**
     *
     *
     * @static
     * @param {*} val
     * @returns {boolean}
     * @memberof FLAG
     */
    public static FromDatabase(val: any): boolean {
        if(val === 'Y' || val === 'y' || val === true) {
            return true;
        }
        return false;
    }
}

/**
 *
 *
 * @class DATE
 * @extends {DataType}
 */
class DATE extends DataType {

}

export const DataTypes = {
    VARCHAR,
    CHAR,
    NUMBER,
    BOOLEAN,
    FLAG,
    DATE
};

export {DataType}